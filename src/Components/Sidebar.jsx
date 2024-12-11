/* eslint-disable react/prop-types */
import { useState } from "react";

function Sidebar({ recentChats, setRecentChats, setChatHistory, darkMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleRemoveChat = (index) => {
    setRecentChats((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <aside
      className={`transition-all ${
        isCollapsed ? "w-16" : "w-64"
      } p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg h-full`}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          className={`p-2 rounded-md transition ${
            darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {/* Hamburger menu */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        {!isCollapsed && (
          <h2
            className={`text-lg font-semibold ${
              darkMode ? "text-yellow-300" : "text-gray-700"
            }`}
          >
            Menu
          </h2>
        )}
      </div>

      {/* New Chat Button */}
      <button
        className={`w-full py-2 mb-4 rounded-md text-lg font-semibold transition ${
          darkMode
            ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
        onClick={() => setChatHistory([])} // Clears the chat history
      >
        {!isCollapsed && "+ New Chat"}
      </button>

      {/* Recently Viewed Section */}
      {!isCollapsed && (
        <>
          <h2
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-yellow-300" : "text-gray-700"
            }`}
          >
            Recently Viewed
          </h2>
          <ul className="space-y-2">
            {recentChats.length === 0 ? (
              <li className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No recent chats
              </li>
            ) : (
              recentChats.map((chat, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer transition ${
                    darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <span className="truncate w-full" title={chat}>
                    {chat}
                  </span>
                  <button
                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveChat(index)}
                  >
                    X
                  </button>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
