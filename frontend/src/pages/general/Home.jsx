import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  Store,
  ChevronDown,
  Heart,
  Bookmark,
  MessageCircle,
  Home as HomeIcon,
  LogOut, // 1. Import LogOut Icon
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
      // 1. Call the backend logout endpoint
      await axios.post(
        "http://localhost:5000/api/v1/user/logout", 
        {}, 
        { withCredentials: true }
      );

      // 2. Clear the saved reel state so the next user starts fresh
      sessionStorage.removeItem("reelState");

      // 3. Navigate to login page
      navigate("user/login"); 

    } catch (error) {
      console.error("Logout failed:", error);
      // Optional: Force redirect even if API fails
      // navigate("/login");
    }
  };

  /* ================= FETCH OR RESTORE VIDEOS ================= */
  useEffect(() => {
    const savedState = sessionStorage.getItem("reelState");

    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setVideos(parsedState.videos);
      setCurrentIndex(parsedState.currentIndex);
    } else {
      axios
        .get("http://localhost:5000/api/v1/food/", { withCredentials: true })
        .then((res) => {
          const randomizedVideos = shuffleArray(res.data.foodItems);
          setVideos(randomizedVideos);
        })
        .catch((err) => {
          console.error("Error fetching videos:", err);
        });
    }
  }, []);

  /* ================= SAVE STATE ON CHANGE ================= */
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

  /* ================= RESTORE SCROLL POSITION ================= */
  useLayoutEffect(() => {
    if (videos.length > 0 && currentIndex > 0 && reelRefs.current[currentIndex]) {
      reelRefs.current[currentIndex].scrollIntoView({ behavior: "instant" });
    }
  }, [videos]); 

  /* ================= LIKE & SAVE ================= */
  const likehandle = async (videoId) => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/food/like",
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
            }
          : v
      )
    );
  };

  const saveVideo = async (videoId) => {
    const res = await axios.post(
      "http://localhost:5000/api/v1/food/save",
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

  /* ================= PLAY & SOUND ================= */
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

  /* ================= OBSERVER ================= */
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

  /* ================= UI ================= */
  return (
    <div
      ref={containerRef}
      className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-black"
    >
      {/* --- LOGOUT BUTTON (Fixed Top Right) --- */}
      <button 
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-md p-2 rounded-full text-white/80 hover:bg-red-600 hover:text-white transition-all"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {videos.map((video, idx) => (
        <section
          key={video._id}
          data-index={idx}
          ref={(el) => (reelRefs.current[idx] = el)}
          className="w-full snap-start relative"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <video
            ref={(el) => (videoRefs.current[idx] = el)}
            src={video.video}
            className="h-full w-full object-cover"
            loop
            muted={soundOn}
            playsInline
            preload="metadata"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {currentIndex === idx && (
            <button
              onClick={toggleSound}
              className="absolute inset-0 flex items-center justify-center z-0"
            />
          )}

          <div className="absolute bottom-24 left-0 right-0 px-6 z-10">
            <p className="text-white text-sm mb-4">{video.description}</p>
            <Link
              to={`/food-partner/${video.foodPartner}`}
              className="mx-auto w-44 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              <Store className="w-5 h-5" />
              Visit Store
            </Link>
          </div>

          <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-6 text-white">
            <div className="flex flex-col items-center">
              <button
                onClick={() => likehandle(video._id)}
                className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-1"
              >
                <Heart className={`w-6 h-6 ${video.likeCount > 0 ? "" : ""}`} />
              </button>
              <span className="text-xs font-semibold">{video.likeCount || 0}</span>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => saveVideo(video._id)}
                className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-1"
              >
                <Bookmark className="w-6 h-6" />
              </button>
              <span className="text-xs font-semibold">{video.saveCount || 0}</span>
            </div>

            <div className="flex flex-col items-center">
              <button className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-1">
                <MessageCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {idx === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
              <ChevronDown />
            </div>
          )}
        </section>
      ))}

      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 h-16 flex justify-around items-center z-50">
        <button onClick={() => navigate("/")}>
          <HomeIcon className="text-white" />
        </button>
        <button onClick={() => navigate("/saved")}>
          <Bookmark className="text-white" />
        </button>
      </nav>
    </div>
  );
}