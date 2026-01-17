import React, { useState, useRef, useEffect } from "react";
import { Store, ChevronDown } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

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
      playOnly(0);
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
          className="h-screen w-full snap-start relative"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* BOTTOM INFO */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <p className="text-white text-sm mb-4">{video.description}</p>

            <Link
              to={`/food-partner/${video.foodPartner}`}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold"
            >
              <Store className="w-5 h-5" />
              Visit Store
            </Link>
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
    </div>
  );
}
