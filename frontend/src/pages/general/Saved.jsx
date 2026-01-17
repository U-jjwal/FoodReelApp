import React from "react";
import { Bookmark as BookmarkIcon, Home as HomeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 pb-20">
      <h1 className="text-2xl font-bold mb-4">Saved</h1>
      <p className="text-sm text-white/70 mb-6">Your saved items will appear here.</p>

      {/* Placeholder grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4">
        <div className="border border-white/10 rounded-xl p-4 text-white/80">No saved reels yet.</div>
      </div>

      {/* bottom nav (same style as Home) */}
  <nav className="fixed left-0 right-0 bottom-0 z-50 bg-black border-t border-white/6">
        <div className="max-w-3xl mx-auto flex justify-around items-center h-16">
          <button
            onClick={() => navigate('/')}
            className="flex flex-col items-center text-white/90"
            aria-label="Home"
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs mt-1">home</span>
          </button>

          <button
            onClick={() => navigate('/saved')}
            className="flex flex-col items-center text-white/90"
            aria-label="Saved"
          >
            <BookmarkIcon className="w-6 h-6" />
            <span className="text-xs mt-1">saved</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
