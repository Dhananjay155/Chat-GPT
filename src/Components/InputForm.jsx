/* eslint-disable react/prop-types */

function InputForm({ question, setQuestion, generateAnswer, generatingAnswer, darkMode }) {
  const formClass = darkMode ? "bg-gray-700" : "bg-white";
  const textareaClass = darkMode ? "bg-gray-600 text-white border-gray-500 focus:ring-yellow-300" : "border-gray-300 focus:ring-blue-400";
  const buttonClass = generatingAnswer ? "opacity-50 cursor-not-allowed" : darkMode ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600" : "bg-gray-900 text-white";

  return (
    <form onSubmit={generateAnswer} className={`rounded-lg shadow-lg p-4 ${formClass}`}>
      <div className="flex gap-2 h-14">
        <textarea
          required
          className={`flex-1 border rounded p-3 resize-none focus:ring-1 ${textareaClass}`}
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
          className={`px-6 py-2 rounded-md transition-colors ${buttonClass}`}
          disabled={generatingAnswer}
        >
          Send
        </button>
      </div>
    </form>
  );
}

export default InputForm;
