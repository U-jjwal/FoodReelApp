import { useState } from "react";
import { User, Mail, Lock, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import SocialButtons from "../../components/common/SocialButtons";
import axios from "axios";
 

export default function UserRegister() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
    


  const handleSubmit = async (e) => {
  e.preventDefault();

  const fullName = e.target.fullName.value;
  const email = e.target.email.value;
  const password = e.target.password.value;

   const response = await axios.post("/api/v1/user/register", {
      fullName,
      email,
      password
  },{
    withCredentials: true
  })

    console.log(response.data);

    navigate("/")
    
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">

      {/* Left Promo */}
      <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-black">FoodReel</h1>
        </div>

        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Join the Community
        </h2>
        <p className="text-lg opacity-95 mb-8">
          Discover amazing food reels and order from your favorite restaurants.
        </p>

        <div className="bg-white/20 p-6 rounded-xl">
          <p className="mb-4 font-semibold">Are you a restaurant?</p>
          <button
            onClick={() => navigate("/food-partner/register")}
            className="w-full py-3 bg-white/20 rounded-xl font-bold hover:bg-white/30"
          >
            Register as Partner
          </button>
        </div>
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-black mb-1">Create Account</h2>
          <p className="text-gray-500 mb-8">Register as a FoodReel user</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={User}
              label="Full Name"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
            />
            <InputField
              icon={Mail}
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <InputField
              icon={Lock}
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
             
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-bold"
            >
              Create Account
            </button>
          </form>

          <div className="my-6">
            <SocialButtons />
          </div>

          <p className="text-center text-gray-700 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/user/login")}
              className="text-orange-600 font-bold"
            >
              Login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
