import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Loader2, 
  Building2, 
  ChefHat 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function FoodPartnerRegister() {
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    phone: "",
    address: "",
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
        import.meta.env.VITE_BACKEND_URL + 
        "/api/v1/foodpartner/register",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      navigate("/create-food"); 
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // OUTER WRAPPER (Desktop Background - Dark Business Theme)
    <div className="min-h-screen bg-[#0f0f11] flex justify-center items-center font-sans">
      
      {/* APP CONTAINER */}
      <div className="w-full md:w-[460px] h-[100dvh] bg-black relative shadow-2xl md:rounded-xl overflow-hidden flex flex-col">
        
        {/* --- BACKGROUND IMAGE LAYER --- */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop" 
            alt="Restaurant Kitchen" 
            className="w-full h-full object-cover opacity-50 grayscale-[20%]"
          />
          {/* Blue/Indigo Gradient for "Business/Partner" feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-blue-900/20" />
        </div>

        {/* --- CONTENT LAYER --- */}
        <div className="relative z-10 w-full h-full flex flex-col px-6 py-6 overflow-y-auto scrollbar-hide">
          
          {/* HEADER SECTION */}
          <div className="mt-8 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-900/40">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
              Partner Registration
            </h1>
            <p className="text-white/60 mt-2 text-sm leading-relaxed">
              Create your business account to manage your restaurant profile.
            </p>
          </div>

          {/* FORM SECTION */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            
            {/* SECTION 1: BUSINESS DETAILS */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Business Details</label>
              
              {/* Restaurant Name */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Restaurant Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Owner Name */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="contactName"
                  required
                  placeholder="Owner / Manager Name"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>


            {/* SECTION 2: LOCATION & CONTACT */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Location & Contact</label>
              
              {/* Phone */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Address */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="Full Business Address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>


            {/* SECTION 3: ACCOUNT SECURITY */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider ml-1">Account Security</label>
              
              {/* Email */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Business Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-indigo-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder:text-white/20 rounded-xl py-3.5 pl-12 pr-4 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>


            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="h-2"></div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/40 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Register Restaurant <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pb-8">
            <p className="text-white/60 text-sm">
              Already a partner?{" "}
              <Link to="/food-partner/login" className="text-white font-bold hover:underline decoration-indigo-500 underline-offset-4">
                Sign In
              </Link>
            </p>
          </div>

          {/* FOOTER / USER LINK */}
          <div className="pt-6 border-t border-white/10 pb-6">
            <div 
                onClick={() => navigate("/user/register")}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                         <User className="w-4 h-4 text-white/70" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Not a restaurant?</p>
                        <p className="text-xs text-white/40">Register as a user instead</p>
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