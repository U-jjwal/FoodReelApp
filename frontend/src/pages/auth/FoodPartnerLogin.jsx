import { useState } from "react";
import { Mail, Lock, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import axios from "axios"
export default function FoodPartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("http://localhost:5000/api/v1/foodpartner/login", {
      email,
      password
    },{
      withCredentials: true
    })

    console.log(response)

    navigate("/create-food")
    
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">

      {/* Left Promo */}
      <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
            <Store className="text-white w-7 h-7" />
          </div>
          <h1 className="text-5xl font-black">FoodReel Partner</h1>
        </div>

        <h2 className="text-5xl font-bold mb-6">Manage Your Restaurant</h2>
        <p className="text-lg opacity-95 mb-8">
          Login to manage orders and upload food reels.
        </p>

        <button
          onClick={() => navigate("/user/login")}
          className="mt-8 px-8 py-4 bg-white/20 rounded-xl font-bold hover:bg-white/30"
        >
          Login as User →
        </button>
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-black mb-2">Partner Login</h2>
          <p className="text-gray-500 mb-8">
            Access your restaurant dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={Mail}
              type="email"
              name="email"
              label="Business Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputField
              icon={Lock}
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

          <div className="flex justify-between items-center text-sm mt-6 mb-6">
            <label className="flex gap-2">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>
            <span className="text-blue-600 cursor-pointer font-semibold">
              Forgot password?
            </span>
          </div>

          <button type="submit" className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold">
            Login to Dashboard
          </button>
          </form>

          <p className="text-center text-gray-700 mt-6">
            New partner?{" "}
            <button
              onClick={() => navigate("/food-partner/register")}
              className="text-blue-600 font-bold"
            >
              Register your restaurant
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
