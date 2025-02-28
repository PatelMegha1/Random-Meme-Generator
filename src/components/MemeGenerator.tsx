"use client"; // Mark this component as a Client Component

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import '../styles/tailwind.css';

// Define the type for the meme object
interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

const MemeGenerator: React.FC = () => {
  // Define state with TypeScript types
  const [meme, setMeme] = useState<Meme | null>(null);
  const [topText, setTopText] = useState<string>(""); 
  const [bottomText, setBottomText] = useState<string>("");
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false); // Track if image is loaded

  // Ref for the meme container to capture it as an image
  const memeRef = useRef<HTMLDivElement>(null);

  // Fetch a random meme from API
  const fetchMeme = async () => {
    try {
      const res = await axios.get<{ data: { memes: Meme[] } }>("https://api.imgflip.com/get_memes");
      const memes = res.data.data.memes;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];
      setMeme(randomMeme);
      setIsImageLoaded(false); // Reset image load state when a new meme is fetched
    } catch (error) {
      console.error("Error fetching meme:", error);
    }
  };

  // Fetch a meme when the component mounts
  useEffect(() => {
    fetchMeme();
  }, []);

  // Function to download the meme as an image
  const downloadMeme = () => {
    if (memeRef.current) {
      html2canvas(memeRef.current, {
        useCORS: true, // Enable CORS handling for external images
        scrollX: 0,
        scrollY: -window.scrollY, // Adjust for scroll position
      }).then((canvas) => {
        const link = document.createElement("a");
        link.download = "meme.png"; // File name for the downloaded image
        link.href = canvas.toDataURL(); // Convert canvas to image URL
        link.click(); // Trigger download
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-6">Random Meme Generator 🤣</h1>

      <button
        onClick={fetchMeme}
        className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 mb-4"
      >
        Generate New Meme
      </button>

      {/* Meme container with ref for capturing */}
      {meme && (
        <div
          ref={memeRef}
          className="relative inline-block mb-6"
        >
          <img
            src={meme.url}
            alt="Meme"
            className="w-96 rounded-lg shadow-lg"
            onLoad={() => setIsImageLoaded(true)} // Set image load state to true when image is loaded
            onError={() => console.error("Failed to load image")}
            crossOrigin="anonymous" // Add this attribute to avoid CORS issues
          />
          <h2 className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white text-shadow-md">
            {topText}
          </h2>
          <h2 className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-white text-shadow-md">
            {bottomText}
          </h2>
        </div>
      )}

      {/* Input fields for top and bottom text */}
      <div className="mb-6 flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Top Text"
          value={topText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopText(e.target.value)}
          className="p-2 w-80 rounded-md border border-gray-600 bg-gray-700 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Bottom Text"
          value={bottomText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBottomText(e.target.value)}
          className="p-2 w-80 rounded-md border border-gray-600 bg-gray-700 focus:outline-none"
        />
      </div>

      {/* Download button */}
      <div className="mb-6">
        <button
          onClick={downloadMeme}
          disabled={!isImageLoaded}
          className={`px-6 py-2 rounded-md transition duration-300 ${isImageLoaded ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 cursor-not-allowed'}`}
        >
          {isImageLoaded ? "Download Meme" : "Loading Image..."}
        </button>
      </div>
    </div>
  );
};

export default MemeGenerator;
