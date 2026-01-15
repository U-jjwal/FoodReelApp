import React from "react";
import { Github, Mail } from "lucide-react";

export default function SocialButtons() {
  return (
    <div className="flex gap-3">
      <button className="flex-1 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 hover:shadow-md hover:scale-105 flex items-center justify-center gap-2 transition-all duration-200">
        <Mail className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-700 hidden sm:inline">Email</span>
      </button>
      <button className="flex-1 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 hover:shadow-md hover:scale-105 text-white flex items-center justify-center gap-2 transition-all duration-200">
        <Github className="w-4 h-4" />
        <span className="text-sm hidden sm:inline">GitHub</span>
      </button>
    </div>
  );
}
