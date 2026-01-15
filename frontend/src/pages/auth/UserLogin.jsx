import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import SocialButtons from "../../components/common/SocialButtons";
import axios from "axios";
export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const email = e.target.email.value
    const password = e.target.password.value

    const response = await axios.post("http://localhost:5000/api/v1/user/login", {
        email,
        password
    },{
        withCredentials: true
    })

    console.log(response)

    navigate("/")
    
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">

      {/* Left Promo */}
      <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-pink-500 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-black">FoodReel</h1>
        </div>

        <h2 className="text-5xl font-bold mb-6">Hungry? Discover & Share</h2>
        <p className="text-lg opacity-95 mb-8">
          Sign in to order food and enjoy amazing food reels.
        </p>

        <button
          onClick={() => navigate("/food-partner/login")}
          className="mt-8 px-8 py-4 bg-white/20 rounded-xl font-bold hover:bg-white/30"
        >
          Login as Partner →
        </button>
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-black mb-2">User Login</h2>
          <p className="text-gray-500 mb-8">Login to your FoodReel account</p>

        
            <form onSubmit={handleSubmit} className="space-y-4" >
            <InputField
              icon={Mail}
              label="Email"
              name="email"
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
        

          <button type="submit" className="w-full py-3 mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold">
            Login
          </button>
              </form>
            
          <div className="my-6">
            <SocialButtons />
          </div>

          <p className="text-center text-gray-700">
            Don’t have an account?{" "}
            <button
              onClick={() => navigate("/user/register")}
              className="text-orange-600 font-bold"
            >
              Sign up
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
