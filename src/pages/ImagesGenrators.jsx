import { useState } from "react";
import axios from "axios";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setImageUrl("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: prompt,
          n: 1,
          size: "512x512",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
        }
      );

      const generatedImage = response.data.data[0].url;
      setImageUrl(generatedImage || "Image could not be generated.");
    } catch (error) {
      console.error(error);
      setImageUrl("Error generating image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-5 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">AI Image Generator</h2>
      <form onSubmit={handleGenerateImage} className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter a prompt (e.g., sunset over mountains)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Image"}
        </button>
      </form>
      {imageUrl && (
        <div className="mt-5">
          <img src={imageUrl} alt="Generated" className="max-w-full rounded shadow" />
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
