import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion(""); 

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
      setAnswer(aiResponse);
    } catch (error) {
      console.log(error);
      setAnswer("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div className={`fixed inset-0 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-50 to-blue-100"}`}>
      <div className="h-full max-w-4xl mx-auto flex flex-col p-3">
        {/* Fixed Header */}
        <header className="text-center py-4 flex justify-between items-center">
          <h1 className={`text-4xl font-bold ${darkMode ? "text-yellow-300" : "text-blue-500"} hover:scale-105 transition-transform`}>
            Chat AI 🌟
          </h1>
          <div className="flex items-center">
            <span className="mr-2">{darkMode ? "🌙" : "☀️"}</span>
            <label className="relative inline-block w-10 h-6">
              <input
                type="checkbox"
                className="opacity-0 w-0 h-0"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span
                className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition ${
                  darkMode ? "bg-yellow-500" : "bg-blue-500"
                }`}
              ></span>
              <span
                className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? "transform translate-x-4" : ""
                }`}
              ></span>
            </label>
          </div>
        </header>

        {/* Scrollable Chat Container */}
        <div
          ref={chatContainerRef}
          className={`flex-1 overflow-y-auto mb-4 rounded-lg shadow-lg p-4 hide-scrollbar ${
            darkMode ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className={`${darkMode ? "bg-gray-700" : "bg-blue-50"} rounded-xl p-8 max-w-2xl`}>
                <h2 className={`text-2xl font-bold ${darkMode ? "text-yellow-300" : "text-blue-600"} mb-4`}>
                  Welcome to Chat AI! 👋
                </h2>
                <p className="mb-4">
                  I'm here to help you with anything you'd like to know. You can ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className={`p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <span>{darkMode ? "🌟" : "💡"}</span> General knowledge
                  </div>
                  <div className={`p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <span>{darkMode ? "🔨" : "🔧"}</span> Technical questions
                  </div>
                  <div className={`p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <span>{darkMode ? "🖋️" : "📝"}</span> Writing assistance
                  </div>
                  <div className={`p-4 rounded-lg shadow-sm ${darkMode ? "bg-gray-600" : "bg-white"}`}>
                    <span>{darkMode ? "❓" : "🤔"}</span> Problem solving
                  </div>
                </div>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 ${chat.type === "question" ? "text-right" : "text-left"}`}>
                <div
                  className={`inline-block max-w-[80%] p-3 rounded-lg ${
                    chat.type === "question"
                      ? darkMode
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-blue-500 text-white"
                      : darkMode
                      ? "bg-gray-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div
                className={`inline-block p-3 rounded-lg animate-pulse ${
                  darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-gray-800"
                }`}
              >
                Thinking 🤖...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form onSubmit={generateAnswer} className={`rounded-lg shadow-lg p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <div className="flex gap-2 h-14">
            <textarea
              required
              className={`flex-1 border rounded p-3 resize-none focus:ring-1 ${
                darkMode
                  ? "bg-gray-600 text-white border-gray-500 focus:ring-yellow-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 rounded-md transition-colors ${
                generatingAnswer
                  ? "opacity-50 cursor-not-allowed"
                  : darkMode
                  ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={generatingAnswer}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
