import { useState, useRef, useEffect } from "react";
import "./App.css";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import ChatContainer from "./Components/ChatContainer";
import InputForm from "./Components/InputForm";

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentChats, setRecentChats] = useState([]); 

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [
      ...prev,
      { type: "question", content: currentQuestion },
    ]);

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

      const aiResponse =
        response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: aiResponse },
      ]);

      setRecentChats((prev) => {
        const updatedChats = [...prev];
        if (!updatedChats.includes(currentQuestion)) {
          updatedChats.unshift(currentQuestion);
        }
        return updatedChats.slice(0, 5); 
      });
    } catch (error) {
      console.log(error);
      setChatHistory("Sorry - Something went wrong. Please try again!");
    }
    setGeneratingAnswer(false);
  }

  return (
    <div
      className={`fixed inset-0 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-r from-blue-50 to-blue-100"
      }`}
    >
      <div className="h-full flex">
        {/* Sidebar */}
        <Sidebar
          recentChats={recentChats}
          setRecentChats={setRecentChats} 
          setChatHistory={setChatHistory}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col p-3">
          <header className="text-center py-4 flex justify-between items-center">
            <h1
              className={`text-4xl font-bold ${
                darkMode ? "text-yellow-300" : "text-blue-500"
              } hover:scale-105 transition-transform`}
            >
              Chat AI 🌟
            </h1>
            {/* Dark Mode Toggle */}
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

          {/* Chat Container */}
          <ChatContainer
            chatHistory={chatHistory}
            generatingAnswer={generatingAnswer}
            darkMode={darkMode}
          />

          {/* Input Form */}
          <InputForm
            question={question}
            setQuestion={setQuestion}
            generateAnswer={generateAnswer}
            generatingAnswer={generatingAnswer}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
