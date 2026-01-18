import React, { useEffect, useState, useRef } from "react";
import { Bookmark as BookmarkIcon, Home as HomeIcon, Store, Play } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Saved() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const videoRefs = useRef(new Map());
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/v1/food/save", {
            withCredentials: true
        }).then(response => {
            // Map the nested structure (saveModel has 'food' object)
            const saveFoods = (response.data.saveFoods || []).map((item) => {
                // Handle cases where food might be null (deleted)
                if (!item.food) return null;
                return {
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount || 0,
                    saveCount: item.food.saveCount || 0,
                    foodPartner: item.food.foodPartner // needed for link
                };
            }).filter(item => item !== null); // Remove nulls

            setVideos(saveFoods);
            setLoading(false);
        }).catch(err => {
            console.error("Error fetching saved:", err);
            setLoading(false);
        });
    }, []);

    return (
        <div className="min-h-screen bg-black text-white flex flex-col p-4 pb-20">
            <header className="max-w-3xl mx-auto w-full py-4 border-b border-white/10 mb-4">
                <h1 className="text-2xl font-bold">Saved Reels</h1>
            </header>

            <main className="max-w-3xl mx-auto w-full grid gap-4">
                {loading && <p className="text-center text-white/50">Loading...</p>}
                
                {!loading && videos.length === 0 && (
                    <div className="text-center py-10 text-white/50">
                        <BookmarkIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No saved reels yet.</p>
                    </div>
                )}

                {videos.map((video) => (
                    <div key={video._id} className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
                        <div className="relative w-full aspect-video bg-black">
                            <video
                                src={video.video}
                                className="w-full h-full object-contain"
                                controls
                                playsInline
                                ref={el => { if(el) videoRefs.current.set(video._id, el) }}
                            />
                        </div>
                        <div className="p-3">
                            <p className="text-sm text-white/90 mb-2">{video.description}</p>
                            <div className="flex items-center justify-between mt-2">
                                <Link to={`/food-partner/${video.foodPartner}`} className="text-xs bg-orange-600 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Store className="w-3 h-3" /> Visit Store
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <nav className="fixed left-0 right-0 bottom-0 z-50 bg-black border-t border-white/10">
                <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
                    <button onClick={() => navigate('/')} className="flex flex-col items-center text-white/60 hover:text-white">
                        <HomeIcon className="w-6 h-6" />
                        <span className="text-xs mt-1">home</span>
                    </button>
                    <button onClick={() => navigate('/saved')} className="flex flex-col items-center text-white">
                        <BookmarkIcon className="w-6 h-6 fill-white" />
                        <span className="text-xs mt-1">saved</span>
                    </button>
                </div>
            </nav>
        </div>
    );
}