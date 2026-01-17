import React, { useState, useEffect } from "react";
import { Upload, Type, AlignLeft } from "lucide-react";
import axios from "axios";

export const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !foodName || !description) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", foodName);
      formData.append("description", description);
      formData.append("video", videoFile);

      const res = await axios.post(
        "http://localhost:5000/api/v1/food/",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Uploaded:", res.data);
      alert("Food reel uploaded!");

      setFoodName("");
      setDescription("");
      setVideoFile(null);
      setVideoPreview(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-start p-4 sm:p-8">
      <div className="w-full max-w-md sm:max-w-lg bg-[#111] rounded-2xl shadow-xl p-5 sm:p-6">

        <h2 className="text-2xl font-bold mb-1">Upload Food Reel</h2>
        <p className="text-sm text-gray-400 mb-6">
          Share your food video to attract customers
        </p>

        <form onSubmit={handleSubmit}>

          {/* VIDEO */}
          <label className="block mb-5 cursor-pointer">
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoChange}
            />

            <div className="border-2 border-dashed border-gray-600 rounded-xl p-4 flex flex-col items-center justify-center hover:border-orange-500 transition">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-lg max-h-[420px] object-cover"
                />
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="text-sm text-gray-400 text-center">
                    Tap to upload food video
                  </p>
                </>
              )}
            </div>
          </label>

          {/* NAME */}
          <div className="mb-4">
            <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <Type className="w-4 h-4" />
              Food Name
            </label>
            <input
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full bg-[#1c1c1c] border border-gray-700 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          {/* DESC */}
          <div className="mb-6">
            <label className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <AlignLeft className="w-4 h-4" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#1c1c1c] border border-gray-700 rounded-xl px-4 py-3 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 py-3 rounded-xl font-bold"
          >
            {loading ? "Uploading..." : "Publish Food Reel"}
          </button>

        </form>
      </div>
    </div>
  );
}
