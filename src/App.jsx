/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Sidebar from "./Components/Sidebar";
import ChatContainer from "./Components/ChatContainer";
import InputForm from "./Components/InputForm";
import ImagesGenrators from "./pages/ImagesGenrators";

function ChatPage({ darkMode, ...props }) {
  return (
    <>
      <ChatContainer
        chatHistory={props.chatHistory}
        generatingAnswer={props.generatingAnswer}
        darkMode={darkMode}
      />
      <InputForm
        question={props.question}
        setQuestion={props.setQuestion}
        generateAnswer={props.generateAnswer}
        generatingAnswer={props.generatingAnswer}
        darkMode={darkMode}
      />
    </>
  );
}

function App() {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  const generateAnswer = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,

        { contents: [{ parts: [{ text: question }] }] }
      );
      

      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response available.";
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);

      setRecentChats((prev) => {
        const updatedChats = prev.includes(currentQuestion) ? prev : [currentQuestion, ...prev];
        return updatedChats.slice(0, 5);
      });
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [...prev, { type: "error", content: "Sorry - Something went wrong. Please try again!" }]);
    }
    setGeneratingAnswer(false);
  };

  const containerClass = darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-50 to-blue-100";
  const headerClass = darkMode ? "text-yellow-300" : "text-blue-500";
  const toggleClass = darkMode ? "bg-yellow-500" : "bg-blue-500";

  return (
    <BrowserRouter>
      <div className={`fixed inset-0 ${containerClass}`}>
        <div className="h-full flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200">
            <Sidebar
              recentChats={recentChats}
              setRecentChats={setRecentChats}
              setChatHistory={setChatHistory}
              darkMode={darkMode}
            />
            {/* Navigation Links */}
            <nav className="p-4">
              <Link 
                to="/" 
                className={`block mb-2 p-2 rounded ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
              >
                💬 Chat
              </Link>
              <Link 
                to="/image-generator" 
                className={`block p-2 rounded ${darkMode ? 'text-white hover:bg-gray-800' : 'text-gray-700 hover:bg-blue-50'}`}
              >
                🎨 Image Generator
              </Link>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col p-3">
            <header className="text-center py-4 flex justify-between items-center">
              <h1 className={`text-4xl font-bold ${headerClass} hover:scale-105 transition-transform`}>
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
                  <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition ${toggleClass}`}></span>
                  <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${darkMode ? "transform translate-x-4" : ""}`}></span>
                </label>
              </div>
            </header>

            <Routes>
              <Route 
                path="/" 
                element={
                  <ChatPage 
                    chatHistory={chatHistory}
                    question={question}
                    setQuestion={setQuestion}
                    generateAnswer={generateAnswer}
                    generatingAnswer={generatingAnswer}
                    darkMode={darkMode}
                  />
                } 
              />
              <Route 
                path="/image-generator" 
                element={<ImagesGenrators darkMode={darkMode} />} 
              />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;