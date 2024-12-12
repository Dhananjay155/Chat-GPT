/* eslint-disable react/prop-types */
import ReactMarkdown from "react-markdown";

function ChatContainer({ chatHistory, generatingAnswer, darkMode }) {
  const containerClass = darkMode ? "bg-gray-800 text-white" : "bg-white";
  const welcomeBoxClass = darkMode ? "bg-gray-700 text-yellow-300" : "bg-blue-50 text-blue-600";
  const questionClass = darkMode ? "bg-yellow-500 text-gray-900" : "bg-blue-500 text-white";
  const answerClass = darkMode ? "bg-gray-600 text-white" : "bg-gray-100 text-gray-800";

  return (
    <div className={`flex-1 overflow-y-auto mb-4 rounded-lg shadow-lg p-4 hide-scrollbar ${containerClass}`}>
      {chatHistory.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className={`rounded-xl p-8 max-w-2xl ${welcomeBoxClass}`}>
            <h2 className="text-2xl font-bold mb-4">Welcome to Chat AI! 👋</h2>
            <p className="mb-4">I am here to help you with anything you would like to know.</p>
          </div>
        </div>
      ) : (
        chatHistory.map((chat, index) => (
          <div key={index} className={`mb-4 ${chat.type === "question" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block max-w-[80%] p-3 rounded-lg ${
                chat.type === "question" ? questionClass : answerClass
              }`}
            >
              <ReactMarkdown>{chat.content}</ReactMarkdown>
            </div>
          </div>
        ))
      )}
      {generatingAnswer && (
        <div className="text-left">
          <div className={`inline-block p-3 rounded-lg animate-pulse ${answerClass}`}>
            Thinking 🤖...
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatContainer;
