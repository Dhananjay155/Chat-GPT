/* eslint-disable react/prop-types */
// components/ChatContainer.js
import ReactMarkdown from "react-markdown";

function ChatContainer({ chatHistory, generatingAnswer, darkMode }) {
  return (
    <div
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
            <p className="mb-4">I am here to help you with anything you would like to know.</p>
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
  );
}

export default ChatContainer;
