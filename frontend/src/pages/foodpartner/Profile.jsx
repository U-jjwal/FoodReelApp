import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { 
  ArrowLeft, 
  Store, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  ChevronDown 
} from "lucide-react";

export default function FoodPartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigation
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  
  // State to track view mode: null = Grid, number = Player
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/food-partner/${id}`, { withCredentials: true })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      })
      .catch(console.error);
  }, [id]);

  // --- HANDLERS ---
  const openPlayer = (index) => {
    setCurrentIndex(index);
    setActiveVideoIndex(index);
  };

  const closePlayer = () => {
    setActiveVideoIndex(null);
  };

  // --- PLAYER LOGIC ---
  const playOnly = (index) => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.muted = false;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  useEffect(() => {
    if (activeVideoIndex === null || !videos.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        let visible = currentIndex;
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible = Number(entry.target.dataset.index);
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
  }, [videos, currentIndex, activeVideoIndex]);

  useLayoutEffect(() => {
    if (activeVideoIndex !== null && reelRefs.current[activeVideoIndex]) {
      reelRefs.current[activeVideoIndex].scrollIntoView({ behavior: "instant" });
      playOnly(activeVideoIndex);
    }
  }, [activeVideoIndex]);


  if (!profile) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-black relative">
      
      {/* ---------------- VIEW 1: PROFILE GRID ---------------- */}
      {activeVideoIndex === null && (
        <div className="flex justify-center py-6">
          
          {/* NEW: Back Button to Home (Top Left) */}
          <button 
            onClick={() => navigate('/')} 
            className="absolute top-4 left-4 z-10 text-white bg-black/40 p-2 rounded-full backdrop-blur-md"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-full max-w-sm text-white mt-8">
            {/* Profile Card */}
            <div className="bg-[#6b1f2a] rounded-2xl p-4 mb-4 mx-2">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 rounded-full bg-green-800 border-2 border-green-400" />
                <div className="flex-1 space-y-2">
                  <div className="bg-green-800 text-center py-1 rounded-lg text-sm font-semibold">
                    {profile.name}
                  </div>
                  <div className="bg-green-800 text-center py-1 rounded-lg text-sm">
                    {profile.address}
                  </div>
                </div>
              </div>
              <div className="flex justify-around mt-6 text-center">
                <div>
                  <p className="text-sm opacity-80">meals</p>
                  <p className="text-lg font-bold">{videos.length}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">customers</p>
                  <p className="text-lg font-bold">15K</p>
                </div>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-3 gap-1">
              {videos.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => openPlayer(index)}
                  className="aspect-[9/16] bg-[#083a5f] overflow-hidden cursor-pointer relative group"
                >
                  <video
                    src={item.video}
                    className="w-full h-full object-cover"
                    muted
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* ---------------- VIEW 2: FULL SCREEN PLAYER OVERLAY ---------------- */}
      {activeVideoIndex !== null && (
        <div 
          ref={containerRef}
          className="fixed inset-0 z-50 bg-black h-screen w-full overflow-y-scroll snap-y snap-mandatory"
        >
          {/* Back Button (Closes Player, Returns to Profile Grid) */}
          <button 
            onClick={closePlayer}
            className="fixed top-4 left-4 z-[60] bg-black/50 backdrop-blur-md p-2 rounded-full text-white hover:bg-black/70 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {videos.map((video, idx) => (
            <section
              key={video._id}
              data-index={idx}
              ref={(el) => (reelRefs.current[idx] = el)}
              className="w-full snap-start relative"
              style={{ height: "100vh" }}
            >
              <video
                ref={(el) => (videoRefs.current[idx] = el)}
                src={video.video}
                className="h-full w-full object-cover"
                loop
                muted={false} 
                playsInline
                onClick={(e) => e.target.muted = !e.target.muted} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-24 left-0 right-0 px-6 z-10 pointer-events-none">
                <p className="text-white text-sm mb-4">{video.description}</p>
                <div className="mx-auto w-44 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-bold">
                   <Store className="w-5 h-5" />
                   {profile.name}
                </div>
              </div>

              <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-6 text-white">
                 <div className="flex flex-col items-center">
                    <button className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-1">
                       <Heart className="w-6 h-6" />
                    </button>
                    <span className="text-xs">{video.likeCount || 0}</span>
                 </div>
                 <div className="flex flex-col items-center">
                    <button className="bg-white/20 backdrop-blur-md rounded-full p-3 mb-1">
                       <Bookmark className="w-6 h-6" />
                    </button>
                    <span className="text-xs">{video.saveCount || 0}</span>
                 </div>
                 <button className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <MessageCircle className="w-6 h-6" />
                 </button>
              </div>

              {idx === 0 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
                  <ChevronDown />
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}