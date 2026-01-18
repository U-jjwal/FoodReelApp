import React, { useState, useEffect } from "react";
import { 
  Upload, 
  Type, 
  AlignLeft, 
  LogOut, 
  Video, 
  Utensils, 
  ArrowLeft,
  X,
  Loader2
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateFood = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [foodName, setFoodName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  // --- LOGOUT FUNCTION ---
  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await axios.post(
          "/api/v1/foodpartner/logout", 
          {},
          { withCredentials: true }
        );
        navigate("/food-partner/login");
      } catch (error) {
        console.error("Logout failed", error);
        navigate("/food-partner/login");
      }
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const clearVideo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !foodName || !description) {
      // You could use a toast notification here
      alert("Please fill in all fields and upload a video.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", foodName);
      formData.append("description", description);
      formData.append("video", videoFile);

      await axios.post(
        "/api/v1/food/",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Reel posted successfully!");
      // Reset form
      setFoodName("");
      setDescription("");
      setVideoFile(null);
      setVideoPreview(null);
      
      // Optional: Navigate to profile to see the new post
      // navigate(`/food-partner/${partnerId}`); 

    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // OUTER WRAPPER (Desktop Background)
    <div className="min-h-screen bg-[#121212] flex justify-center items-center font-sans">
      
      {/* APP CONTAINER */}
      <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">
        
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10 bg-black/50 backdrop-blur-md z-20 absolute top-0 w-full">
           <div className="flex items-center gap-3">
             {/* Optional Back Button if needed */}
             {/* <button onClick={() => navigate(-1)}><ArrowLeft className="w-6 h-6 text-white" /></button> */}
             <h1 className="text-lg font-bold text-white tracking-wide">New Reel</h1>
           </div>
           
           <button 
            onClick={handleLogout}
            className="p-2 bg-white/5 rounded-full text-white/60 hover:text-red-400 hover:bg-white/10 transition-all"
            title="Logout"
           >
             <LogOut className="w-5 h-5" />
           </button>
        </div>

        {/* --- SCROLLABLE FORM AREA --- */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-20 pb-24 px-5">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* 1. VIDEO UPLOAD (9:16 Aspect Ratio) */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-white/60 uppercase tracking-wider ml-1">
                Upload Video
              </label>
              
              <label className="relative block w-full aspect-[9/16] bg-[#1a1a1a] rounded-2xl border-2 border-dashed border-white/10 hover:border-orange-500/50 transition-colors cursor-pointer overflow-hidden group">
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />

                {videoPreview ? (
                  <>
                    <video
                      src={videoPreview}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />
                    
                    {/* Clear Button */}
                    <button 
                      onClick={clearVideo}
                      className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                       <span className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                         Tap to change video
                       </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 group-hover:text-white/80 transition-colors">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                       <Video className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Select Video</p>
                    <p className="text-xs opacity-50 mt-1">9:16 Aspect Ratio Recommended</p>
                  </div>
                )}
              </label>
            </div>

            {/* 2. DETAILS SECTION */}
            <div className="space-y-5">
               
               {/* Name Input */}
               <div className="space-y-2">
                 <label className="block text-xs font-bold text-white/60 uppercase tracking-wider ml-1">
                    Meal Name
                 </label>
                 <div className="relative">
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                     <Utensils className="w-5 h-5" />
                   </div>
                   <input
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition-colors placeholder:text-white/20"
                    placeholder="e.g. Cheesy Smash Burger"
                   />
                 </div>
               </div>

               {/* Description Input */}
               <div className="space-y-2">
                 <label className="block text-xs font-bold text-white/60 uppercase tracking-wider ml-1">
                    Description
                 </label>
                 <div className="relative">
                   <div className="absolute left-4 top-4 text-white/40">
                     <AlignLeft className="w-5 h-5" />
                   </div>
                   <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-[#1a1a1a] text-white border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500 transition-colors placeholder:text-white/20 resize-none"
                    placeholder="Tell customers what makes this special..."
                   />
                 </div>
               </div>

            </div>
          </form>
        </div>

        {/* --- BOTTOM ACTION BAR --- */}
        <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black via-black to-transparent z-30">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Uploading Reel...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                <span>Publish Reel</span>
              </>
            )}
          </button>
        </div>

        {/* LOADING OVERLAY (Full Screen Block) */}
        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
            <p className="text-white font-bold text-lg">Uploading...</p>
            <p className="text-white/50 text-sm">Please keep this app open</p>
          </div>
        )}

      </div>
    </div>
  );
}