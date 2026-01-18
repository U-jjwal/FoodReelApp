import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  Store, 
  Heart, 
  Bookmark, 
  MessageCircle, 
  MapPin, 
  Play,
  Grid3X3,
  UtensilsCrossed
} from "lucide-react";

export default function FoodPartnerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);
  
  // View Mode: null = Grid, number = Player
  const [activeVideoIndex, setActiveVideoIndex] = useState(null);

  const containerRef = useRef(null);
  const reelRefs = useRef([]);
  const videoRefs = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- FETCH DATA ---
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/api/v1/food-partner/${id}`, { withCredentials: true })
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


  if (!profile) return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white/50">
      <div className="animate-pulse">Loading...</div>
    </div>
  );

  return (
    // OUTER RESPONSIVE WRAPPER
    <div className="min-h-screen bg-[#121212] flex justify-center items-center font-sans">
      
      {/* MOBILE APP CONTAINER */}
      <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">

        {/* ==================== VIEW 1: PROFILE GRID ==================== */}
        {activeVideoIndex === null && (
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            
            {/* --- STICKY TOP HEADER --- */}
            {/* Fixed height (h-14) and items-center for perfect vertical alignment */}
            <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md h-14 px-4 flex items-center justify-between border-b border-white/5">
              <button 
                onClick={() => navigate('/')} 
                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition active:scale-95"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
              
              <h1 className="font-bold text-base text-white truncate text-center flex-1 px-4">
                {profile.name}
              </h1>
              
              {/* Invisible spacer to balance the header (keeps title centered) */}
              <div className="w-8"></div>
            </div>

            {/* --- PROFILE INFO SECTION --- */}
            <div className="px-5 pt-6 pb-2">
              <div className="flex flex-col items-center">
                
                {/* Avatar */}
                <div className="mb-3 relative group">
                   <div className="absolute -inset-[2px] bg-gradient-to-tr from-orange-500 to-pink-600 rounded-full opacity-80 group-hover:opacity-100 transition duration-500"></div>
                   <div className="relative w-[88px] h-[88px] rounded-full bg-[#1a1a1a] border-2 border-black flex items-center justify-center overflow-hidden">
                      <UtensilsCrossed className="w-9 h-9 text-white/40" />
                   </div>
                </div>

                {/* Name & Bio */}
                <h2 className="text-lg font-bold text-white tracking-wide text-center leading-tight">
                  {profile.name}
                </h2>
                
                <div className="flex items-center gap-1.5 text-sm text-white/60 mt-2 mb-6 bg-white/5 px-3 py-1 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[200px]">{profile.address || "Location"}</span>
                </div>

                {/* Stats Row (Grid for perfect alignment) */}
                <div className="grid grid-cols-3 divide-x divide-white/10 w-full border-t border-b border-white/10 py-3 mb-2">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-white leading-none mb-1">{videos.length}</span>
                    <span className="text-[11px] text-white/50 uppercase tracking-widest">Meals</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-white leading-none mb-1">15.2K</span>
                    <span className="text-[11px] text-white/50 uppercase tracking-widest">Served</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg text-white leading-none mb-1">4.9</span>
                    <span className="text-[11px] text-white/50 uppercase tracking-widest">Rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- GRID TABS --- */}
            <div className="flex justify-center mt-2">
              <button className="flex-1 flex justify-center py-3 border-b border-white text-white">
                <Grid3X3 className="w-6 h-6" />
              </button>
              <button className="flex-1 flex justify-center py-3 border-b border-white/10 text-white/30 hover:text-white/60 transition">
                <Bookmark className="w-6 h-6" />
              </button>
            </div>

            {/* --- VIDEO GRID --- */}
            <div className="grid grid-cols-3 gap-0.5 pb-20">
              {videos.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => openPlayer(index)}
                  className="aspect-[3/4] bg-[#111] relative cursor-pointer group overflow-hidden"
                >
                  <video
                    src={item.video}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                    muted
                  />
                  {/* Play Count Overlay */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs drop-shadow-md">
                     <Play className="w-3 h-3 fill-white" />
                     <span>{Math.floor(Math.random() * 50) + 1}k</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {videos.length === 0 && (
               <div className="py-20 text-center text-white/30 text-sm flex flex-col items-center gap-2">
                  <UtensilsCrossed className="w-8 h-8 opacity-20" />
                  <p>No meals shared yet.</p>
               </div>
            )}
          </div>
        )}


        {/* ==================== VIEW 2: FULL SCREEN PLAYER ==================== */}
        {activeVideoIndex !== null && (
          <div 
            ref={containerRef}
            className="absolute inset-0 z-50 bg-black h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          >
            {/* HEADER OVERLAY (Fixed Gradient for Visibility) */}
            <div className="fixed top-0 w-full md:w-[460px] z-[60] h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>

            <div className="fixed top-0 w-full md:w-[460px] z-[70] flex items-center justify-between px-4 py-4 pointer-events-none">
                {/* Back Button */}
                <button 
                  onClick={closePlayer}
                  className="pointer-events-auto text-white hover:text-white/80 transition active:scale-95 drop-shadow-lg"
                >
                  <ArrowLeft className="w-7 h-7 stroke-[2]" />
                </button>
                
                {/* Title */}
                <span className="text-xs font-bold text-white/90 uppercase tracking-widest drop-shadow-md">
                   {profile.name}
                </span>

                <div className="w-7"></div>
            </div>

            {/* VIDEO LOOP */}
            {videos.map((video, idx) => (
              <section
                key={video._id}
                data-index={idx}
                ref={(el) => (reelRefs.current[idx] = el)}
                className="w-full h-full snap-start relative"
              >
                {/* Video */}
                <video
                  ref={(el) => (videoRefs.current[idx] = el)}
                  src={video.video}
                  className="h-full w-full object-cover"
                  loop
                  muted={false} 
                  playsInline
                  onClick={(e) => e.target.muted = !e.target.muted} 
                />
                
                {/* Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

                {/* Bottom Info */}
                <div className="absolute bottom-[70px] left-0 right-16 px-5 z-10 pointer-events-none flex flex-col items-start gap-3">
                  
                  {/* Partner Pill */}
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                     <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center">
                       <Store className="w-3 h-3 text-white" />
                     </div>
                     <span className="text-xs font-bold text-white pr-1">{profile.name}</span>
                  </div>

                  <p className="text-white text-[15px] leading-relaxed drop-shadow-md line-clamp-3 opacity-95">
                    {video.description}
                  </p>
                </div>

                {/* Right Action Bar */}
                <div className="absolute right-3 bottom-[80px] z-20 flex flex-col items-center gap-6">
                   <div className="flex flex-col items-center gap-1">
                      <button className="transition-transform active:scale-75 p-2">
                         <Heart className={`w-8 h-8 stroke-[1.5] drop-shadow-lg ${video.likeCount > 0 ? "text-red-500 fill-red-500" : "text-white"}`} />
                      </button>
                      <span className="text-xs font-medium text-white drop-shadow-md">{video.likeCount || 0}</span>
                   </div>
                   
                   <div className="flex flex-col items-center gap-1">
                      <button className="transition-transform active:scale-75 p-2">
                         <Bookmark className={`w-8 h-8 stroke-[1.5] drop-shadow-lg ${video.saveCount > 0 ? "text-white fill-white" : "text-white"}`} />
                      </button>
                      <span className="text-xs font-medium text-white drop-shadow-md">{video.saveCount || 0}</span>
                   </div>

                   <button className="transition-transform active:scale-75 p-2">
                      <MessageCircle className="w-8 h-8 stroke-[1.5] text-white drop-shadow-lg" />
                   </button>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}