import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  UtensilsCrossed, 
  ChefHat 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/v1/user/register",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // OUTER WRAPPER (Desktop Background)
    <div className="min-h-screen bg-[#121212] flex justify-center items-center font-sans">
      
      {/* APP CONTAINER */}
      <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">
        
        {/* --- BACKGROUND IMAGE LAYER --- */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" 
            alt="Delicious Food" 
            className="w-full h-full object-cover opacity-50"
          />
          {/* Stronger Gradient Overlay for better contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/40" />
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center px-6 py-10 overflow-y-auto scrollbar-hide">
          
          {/* HEADER SECTION */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-pink-600 flex items-center justify-center mb-4 shadow-lg shadow-orange-900/40">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-white/60 mt-2 text-sm leading-relaxed">
              Join FoodReels to discover the best dishes and share your cravings.
            </p>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/70 uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/10 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-orange-500/50 focus:bg-white/15 transition-all"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Spacer for better visual separation */}
            <div className="h-4"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/30 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-white/60 text-sm">
              Already have an account?{" "}
              <Link to="/user/login" className="text-white font-bold hover:underline decoration-orange-500 underline-offset-4">
                Log In
              </Link>
            </p>
          </div>

          {/* FOOTER / PARTNER LINK */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div 
                onClick={() => navigate("/food-partner/register")}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                         <ChefHat className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Restaurant Owner?</p>
                        <p className="text-xs text-white/40">Sign up as a partner</p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}