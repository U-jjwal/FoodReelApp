import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Store,
  ChevronDown,
  Heart,
  Bookmark,
  MessageCircle,
  Home as HomeIcon,
  LogOut,
  Music2,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const navigate = useNavigate();

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const videoRefs = useRef([]);

  // --- Helper to Shuffle Array ---
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  /* ================= HANDLE LOGOUT ================= */
  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/user/logout",
        {},
        { withCredentials: true }
      );
      sessionStorage.removeItem("reelState");
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /* ================= LOGIC SECTIONS ================= */
  useEffect(() => {
    const savedState = sessionStorage.getItem("reelState");
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setVideos(parsedState.videos);
      setCurrentIndex(parsedState.currentIndex);
    } else {
      axios
        .get("/api/v1/food/", { withCredentials: true })
        .then((res) => {
          const randomizedVideos = shuffleArray(res.data.foodItems);
          setVideos(randomizedVideos);
        })
        .catch((err) => {
          console.error("Error fetching videos:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      sessionStorage.setItem(
        "reelState",
        JSON.stringify({
          videos: videos,
          currentIndex: currentIndex,
        })
      );
    }
  }, [videos, currentIndex]);

  useLayoutEffect(() => {
    if (videos.length > 0 && currentIndex > 0 && reelRefs.current[currentIndex]) {
      reelRefs.current[currentIndex].scrollIntoView({ behavior: "instant" });
    }
  }, [videos]);

  const likehandle = async (videoId) => {
    const res = await axios.post(
      "/api/v1/food/like",
      { foodId: videoId },
      { withCredentials: true }
    );
    setVideos((prev) =>
      prev.map((v) =>
        v._id === videoId
          ? {
              ...v,
              likeCount: res.data.like
                ? v.likeCount + 1
                : Math.max(0, v.likeCount - 1),
              isLiked: res.data.like
            }
          : v
      )
    );
  };

  const saveVideo = async (videoId) => {
    const res = await axios.post(
      "/api/v1/food/save",
      { foodId: videoId },
      { withCredentials: true }
    );
    setVideos((prev) =>
      prev.map((v) =>
        v._id === videoId
          ? {
              ...v,
              isSaved: res.data.isSaved,
              saveCount: res.data.saveCount,
            }
          : v
      )
    );
  };

  const playOnly = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  const toggleSound = () => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;
    const next = !soundOn;
    video.muted = !next;
    setSoundOn(next);
  };

  useEffect(() => {
    if (videos.length && videoRefs.current[currentIndex]) {
      playOnly(currentIndex);
    }
  }, [videos]);

  useEffect(() => {
    if (!videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let visible = currentIndex;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visible = Number(entry.target.dataset.index);
          }
        });
        if (visible !== currentIndex) {
          setCurrentIndex(visible);
          playOnly(visible);
        }
      },
      { root: containerRef.current, threshold: 0.75 }
    );
    reelRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [videos, currentIndex]);

  /* ================= UI RENDER ================= */
  return (
    // OUTER WRAPPER: Handles the Desktop Background (Gray) and Centering
    <div className="min-h-screen bg-[#121212] flex justify-center items-center font-sans overflow-hidden">
      
      {/* APP CONTAINER: Mimics a phone screen on desktop, Full screen on mobile */}
      {/* w-full md:w-[450px] -> Full width on mobile, 450px on desktop */}
      {/* h-[100dvh] -> Dynamic viewport height handles mobile address bars correctly */}
      <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">

        {/* --- HEADER OVERLAYS (Logout & Logo) --- */}
        {/* Using absolute positioning inside the container to stay within the "app" */}
        
        {/* App Title */}
        <div className="absolute top-6 left-5 z-40 font-bold text-xl tracking-tight text-white drop-shadow-md select-none pointer-events-none">
          FoodReels
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="absolute top-6 right-5 z-50 text-white/80 hover:text-white transition-colors drop-shadow-md p-1"
          title="Logout"
        >
          <LogOut className="w-6 h-6 stroke-[1.5]" />
        </button>

        {/* --- SCROLLABLE VIDEO AREA --- */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} // Hide scrollbar CSS
        >
          {videos.map((video, idx) => (
            <section
              key={video._id}
              data-index={idx}
              ref={(el) => (reelRefs.current[idx] = el)}
              className="w-full h-full snap-start relative"
            >
              {/* VIDEO LAYER */}
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={video.video}
                className="h-full w-full object-cover" // object-cover ensures responsive filling
                loop
                muted={soundOn}
                playsInline
                preload="metadata"
              />

              {/* GRADIENT OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

              {/* SOUND TOGGLE LAYER */}
              {currentIndex === idx && (
                <button
                  onClick={toggleSound}
                  className="absolute inset-0 w-full h-full z-0 cursor-default focus:outline-none"
                  aria-label="Toggle Sound"
                />
              )}

              {/* --- INFO SECTION (Bottom Left) --- */}
              {/* Responsive padding and text sizes */}
              <div className="absolute bottom-[70px] left-0 right-16 px-4 md:px-5 z-10 flex flex-col gap-2 items-start pointer-events-none">
                
                {/* User Info */}
                <div className="flex items-center gap-2 opacity-95">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-orange-400 to-pink-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <span className="font-semibold text-sm md:text-[15px] text-white drop-shadow-md tracking-wide">
                    {/* Fallback name if data is missing */}
                    Food Partner
                  </span>
                </div>

                {/* Description */}
                <p className="text-white text-sm md:text-[15px] leading-snug drop-shadow-md line-clamp-2 pr-2 opacity-95">
                  {video.description}
                </p>

                {/* Audio Ticker */}
                <div className="flex items-center gap-2 opacity-80 mt-1">
                   <Music2 className="w-3 h-3 text-white" />
                   <span className="text-xs text-white">Original Audio</span>
                </div>

                {/* Visit Store Button */}
                <Link
                  to={`/food-partner/${video.foodPartner}`}
                  className="pointer-events-auto mt-2 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 text-white px-5 py-2 rounded-full transition-all active:scale-95 group"
                >
                  <Store className="w-4 h-4 group-hover:text-pink-400 transition-colors" />
                  <span className="text-xs md:text-sm font-bold tracking-wide">Visit Store</span>
                </Link>
              </div>

              {/* --- ACTION BUTTONS (Bottom Right) --- */}
              <div className="absolute right-2 md:right-3 bottom-[80px] z-20 flex flex-col items-center gap-4 md:gap-5">
                {/* LIKE */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => likehandle(video._id)}
                    className="transition-transform active:scale-75 focus:outline-none p-2"
                  >
                    <Heart
                      className={`w-7 h-7 md:w-8 md:h-8 stroke-[1.5px] drop-shadow-lg transition-colors duration-300 ${
                        video.likeCount > 0 ? "fill-red-500 text-red-500 border-none" : "text-white fill-transparent"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-white drop-shadow-md">{video.likeCount || 0}</span>
                </div>

                {/* SAVE */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => saveVideo(video._id)}
                    className="transition-transform active:scale-75 focus:outline-none p-2"
                  >
                    <Bookmark
                      className={`w-7 h-7 md:w-8 md:h-8 stroke-[1.5px] drop-shadow-lg transition-colors duration-300 ${
                        video.isSaved ? "fill-yellow-400 text-yellow-400" : "text-white fill-transparent"
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-white drop-shadow-md">{video.saveCount || 0}</span>
                </div>

                {/* SHARE */}
                <div className="flex flex-col items-center gap-1">
                  <button className="transition-transform active:scale-75 focus:outline-none p-2">
                    <MessageCircle className="w-7 h-7 md:w-8 md:h-8 stroke-[1.5px] text-white drop-shadow-lg" />
                  </button>
                  <span className="text-xs font-medium text-white drop-shadow-md">0</span>
                </div>
                
                 {/* Rotating Disc (Visual) */}
                 {/* <div className="w-8 h-8 rounded-full border-2 border-white/20 overflow-hidden mt-2 bg-black/50 p-1">
                    <div className="w-full h-full bg-gradient-to-tr from-gray-700 to-gray-900 rounded-full animate-spin-slow" /> 
                 </div> */}
              </div>
            </section>
          ))}
        </div>

        {/* --- BOTTOM NAVIGATION --- */}
        {/* Absolute positioned at bottom of container */}
        <nav className="absolute bottom-0 w-full h-[60px] bg-black/90 border-t border-white/10 flex justify-around items-center z-50 backdrop-blur-md">
          <button
            onClick={() => navigate("/")}
            className="p-4 transition-opacity hover:opacity-100 opacity-100 focus:outline-none active:scale-90"
          >
            <HomeIcon className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
          </button>
          
          {/* Visual 'Add' Button in center */}
          {/* <button className="bg-gradient-to-r from-orange-500 to-pink-600 p-[2px] rounded-lg active:scale-95 transition-transform">
             <div className="bg-black rounded-[6px] px-3 py-1">
               <span className="text-white font-bold text-lg leading-none">+</span>
             </div>
          </button> */}

          <button
            onClick={() => navigate("/saved")}
            className="p-4 transition-opacity hover:opacity-100 opacity-60 hover:opacity-80 focus:outline-none active:scale-90"
          >
            <Bookmark className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </button>
        </nav>

      </div>
    </div>
  );
}