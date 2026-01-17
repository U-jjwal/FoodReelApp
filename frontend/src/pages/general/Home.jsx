import React, { useState, useRef, useEffect } from "react";
import {
  Store,
  ChevronDown,
  Heart,
  Bookmark,
  MessageCircle,
  Home as HomeIcon,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const videoRefs = useRef([]);

  /* ================= FETCH VIDEOS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/food/", { withCredentials: true })
      .then((res) => {
        setVideos(res.data.foodItems);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);

  const likehandle = async (videoId) => {
    const response = await axios.post(
      "http://localhost:5000/api/v1/food/like",
      {
        foodId: videoId,
      },
      { withCredentials: true }
    );

    if (response.data.like) {
    //   console.log("Video liked");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, likeCount: v.likeCount + 1 } : v
        )
      );
    } else {
    //   console.log("Video unliked");
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, likeCount: v.likeCount - 1 } : v
        )
      );
    }
  };
   
 const saveVideo = async (videoId) => {
  const response = await axios.post(
    "http://localhost:5000/api/v1/food/save",
    { foodId: videoId },
    { withCredentials: true }
  );

  setVideos((prev) =>
    prev.map((v) =>
      v._id === videoId
        ? {
            ...v,
            isSaved: response.data.isSaved,
            saveCount: response.data.saveCount
          }
        : v
    )
  );
};



  /* ================= PLAY ONLY ONE VIDEO ================= */
  const playOnly = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === index) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  /* ================= AUTO PLAY FIRST VIDEO ================= */
  useEffect(() => {
    if (videos.length > 0 && videoRefs.current[0]) {
      playOnly(currentIndex);
    }
  }, [videos]);

  /* ================= INTERSECTION OBSERVER ================= */
  useEffect(() => {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let visibleIndex = currentIndex;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleIndex = Number(entry.target.dataset.index);
          }
        });

        if (visibleIndex !== currentIndex) {
          setCurrentIndex(visibleIndex);
          playOnly(visibleIndex);
        }
      },
      {
        root: containerRef.current,
        threshold: 0.75,
      }
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
      {videos.map((video, idx) => (
        <section
          key={video._id}
          data-index={idx}
          ref={(el) => (reelRefs.current[idx] = el)}
          className="w-full snap-start relative"
          style={{ height: "calc(100vh - 64px)" }}
        >
          {/* VIDEO */}
          <video
            ref={(el) => (videoRefs.current[idx] = el)}
            src={video.video}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          />

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

          {/* BOTTOM INFO - moved up slightly so it doesn't clash with bottom nav */}
          <div className="absolute bottom-24 left-0 right-0 px-6 pb-2 z-10">
            <p className="text-white text-sm mb-4">{video.description}</p>

            <Link
              to={`/food-partner/${video.foodPartner}`}
              className="mx-auto w-44 bg-linear-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              <Store className="w-5 h-5" />
              Visit Store
            </Link>
          </div>

          {/* RIGHT SIDE ACTIONS (likes, save, comments) */}
          <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center text-white">
              <button
                onClick={() => likehandle(video._id)}
                className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-2"
              >
                <Heart className="w-6 h-6 text-white" />
              </button>
              <span className="text-xs font-semibold">{video.likeCount}</span>
            </div>

            <div className="flex flex-col items-center text-white">
              <button onClick={() => saveVideo(video._id)} className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-2">
                <Bookmark className="w-6 h-6 text-white" />
              </button>
              <span className="text-xs font-semibold">{video.saveCount}</span>
            </div>

            <div className="flex flex-col items-center text-white">
              <button className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-2">
                <MessageCircle className="w-6 h-6 text-white" />
              </button>
              <span className="text-xs font-semibold">
                {(video.comments && video.comments.length) || 0}
              </span>
            </div>
          </div>

          {/* SCROLL HINT */}
          {idx === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70 flex flex-col items-center">
              <span>Scroll</span>
              <ChevronDown />
            </div>
          )}
        </section>
      ))}

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed left-0 right-0 bottom-0 z-50 bg-black border-t border-white/6">
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center text-white/90"
            aria-label="Home"
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">home</span>
          </button>

          <button
            onClick={() => navigate("/saved")}
            className="flex flex-col items-center text-white/90"
            aria-label="Saved"
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-xs mt-1">saved</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
