import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { 
  Bookmark, 
  Home as HomeIcon, 
  Store, 
  Heart, 
  MessageCircle, 
  ArrowLeft,
  Play,
  Grid3X3,
  ChevronDown
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Saved() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // View Mode: null = Grid, number = Player
    const [activeVideoIndex, setActiveVideoIndex] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const containerRef = useRef(null);
    const reelRefs = useRef([]);
    const videoRefs = useRef([]);
    const navigate = useNavigate();

    // --- FETCH DATA ---
    useEffect(() => {
        axios.get("/api/v1/food/save", {
            withCredentials: true
        }).then(response => {
            const saveFoods = (response.data.saveFoods || []).map((item) => {
                if (!item.food) return null;
                return {
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount || 0,
                    saveCount: item.food.saveCount || 0,
                    foodPartner: item.food.foodPartner
                };
            }).filter(item => item !== null);

            setVideos(saveFoods);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching saved:", err);
            setLoading(false);
        });
    }, []);

    // --- HANDLERS ---
    const openPlayer = (index) => {
        setCurrentIndex(index);
        setActiveVideoIndex(index);
    };
    
    const closePlayer = () => {
        setActiveVideoIndex(null);
    };

    // --- PLAYER LOGIC (Same as Profile/Home) ---
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

    return (
        // OUTER RESPONSIVE WRAPPER
        <div className="min-h-screen bg-[#121212] flex justify-center items-center font-sans">
            
            {/* MOBILE APP CONTAINER */}
            <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">

                {/* ==================== VIEW 1: SAVED GRID ==================== */}
                {activeVideoIndex === null && (
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                        
                        {/* --- HEADER --- */}
                        <div className="sticky top-0 z-30 bg-black/95 backdrop-blur-md h-14 px-4 flex items-center justify-between border-b border-white/5">
                            <button 
                                onClick={() => navigate('/')} 
                                className="p-2 -ml-2 rounded-full hover:bg-white/10 transition active:scale-95"
                            >
                                <ArrowLeft className="w-6 h-6 text-white" />
                            </button>
                            <h1 className="font-bold text-base text-white">Saved Collections</h1>
                            <div className="w-8"></div> {/* Spacer for centering */}
                        </div>

                        {/* --- TABS (Visual) --- */}
                        <div className="flex justify-center mt-2 mb-0.5">
                            <div className="flex-1 flex justify-center py-3 border-b border-white text-white">
                                <Grid3X3 className="w-6 h-6" />
                            </div>
                        </div>

                        {/* --- GRID CONTENT --- */}
                        {loading ? (
                            <div className="text-center text-white/40 py-20 text-sm">Loading...</div>
                        ) : (
                            <>
                                {videos.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-32 text-white/30">
                                        <div className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center mb-4">
                                            <Bookmark className="w-8 h-8 opacity-50" />
                                        </div>
                                        <h3 className="font-bold text-lg text-white/60">Save Your Favorites</h3>
                                        <p className="text-xs max-w-[200px] text-center mt-2">
                                            Tap the bookmark icon on any reel to save it here for later.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-0.5 pb-20">
                                        {videos.map((video, index) => (
                                            <div 
                                                key={video._id} 
                                                onClick={() => openPlayer(index)}
                                                className="aspect-[3/4] bg-[#111] relative cursor-pointer group overflow-hidden"
                                            >
                                                <video
                                                    src={video.video}
                                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition duration-300"
                                                    muted
                                                />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs drop-shadow-md">
                                                    <Play className="w-3 h-3 fill-white" />
                                                    <span>{Math.floor(Math.random() * 20) + 1}k</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* ==================== VIEW 2: FULL SCREEN PLAYER ==================== */}
                {activeVideoIndex !== null && (
                    <div 
                        ref={containerRef}
                        className="absolute inset-0 z-50 bg-black h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
                    >
                        {/* HEADER OVERLAY */}
                        <div className="fixed top-0 w-full md:w-[460px] z-[60] h-24 bg-gradient-to-b from-black/80 to-transparent pointer-events-none"></div>
                        <div className="fixed top-0 w-full md:w-[460px] z-[70] flex items-center justify-between px-4 py-4 pointer-events-none">
                            <button 
                                onClick={closePlayer}
                                className="pointer-events-auto text-white hover:text-white/80 transition active:scale-95 drop-shadow-lg"
                            >
                                <ArrowLeft className="w-7 h-7 stroke-[2]" />
                            </button>
                            <span className="text-xs font-bold text-white/90 uppercase tracking-widest drop-shadow-md">Saved</span>
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
                                <video
                                    ref={(el) => (videoRefs.current[idx] = el)}
                                    src={video.video}
                                    className="h-full w-full object-cover"
                                    loop
                                    muted={false} 
                                    playsInline
                                    onClick={(e) => e.target.muted = !e.target.muted} 
                                />
                                
                                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

                                <div className="absolute bottom-[70px] left-0 right-16 px-5 z-10 pointer-events-none flex flex-col items-start gap-3">
                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center">
                                            <Store className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs font-bold text-white pr-1">Saved Reel</span>
                                    </div>
                                    <p className="text-white text-[15px] leading-relaxed drop-shadow-md line-clamp-3 opacity-95">
                                        {video.description}
                                    </p>
                                    
                                    {/* Visit Store Button inside Player */}
                                    <Link 
                                        to={`/food-partner/${video.foodPartner}`}
                                        className="pointer-events-auto flex items-center gap-1 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                                    >
                                        Visit Original Post <ArrowLeft className="w-3 h-3 rotate-180" />
                                    </Link>
                                </div>

                                <div className="absolute right-3 bottom-[80px] z-20 flex flex-col items-center gap-5">
                                    <div className="flex flex-col items-center gap-1">
                                        <button className="transition-transform active:scale-75 p-2">
                                            <Heart className={`w-8 h-8 stroke-[1.5] drop-shadow-lg ${video.likeCount > 0 ? "text-red-500 fill-red-500" : "text-white"}`} />
                                        </button>
                                        <span className="text-xs font-medium text-white drop-shadow-md">{video.likeCount}</span>
                                    </div>
                                    
                                    <div className="flex flex-col items-center gap-1">
                                        <button className="transition-transform active:scale-75 p-2">
                                            <Bookmark className="w-8 h-8 stroke-[1.5] drop-shadow-lg fill-white text-white" />
                                        </button>
                                        <span className="text-xs font-medium text-white drop-shadow-md">Saved</span>
                                    </div>

                                    <button className="transition-transform active:scale-75 p-2">
                                        <MessageCircle className="w-8 h-8 stroke-[1.5] text-white drop-shadow-lg" />
                                    </button>
                                </div>

                                {idx === 0 && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                                        <ChevronDown className="w-6 h-6" />
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                )}

                {/* --- BOTTOM NAVIGATION (Visible only in Grid Mode) --- */}
                {activeVideoIndex === null && (
                    <nav className="absolute bottom-0 w-full h-[60px] bg-black/90 border-t border-white/10 flex justify-around items-center z-50 backdrop-blur-md">
                        <button onClick={() => navigate('/')} className="p-4 transition-opacity hover:opacity-100 opacity-60 hover:opacity-80 active:scale-90">
                            <HomeIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </button>
                        
                        {/* <button className="bg-gradient-to-r from-orange-500 to-pink-600 p-[2px] rounded-lg active:scale-95 transition-transform opacity-50">
                            <div className="bg-black rounded-[6px] px-3 py-1">
                                <span className="text-white font-bold text-lg leading-none">+</span>
                            </div>
                        </button> */}

                        <button onClick={() => navigate('/saved')} className="p-4 transition-opacity hover:opacity-100 opacity-100 active:scale-90">
                            <Bookmark className="w-6 h-6 md:w-7 md:h-7 text-white fill-white" />
                        </button>
                    </nav>
                )}

            </div>
        </div>
    );
}