import { useState } from "react";
import { Store, User, Mail, Lock, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/common/InputField";
import SocialButtons from "../../components/common/SocialButtons";
import axios from "axios";
export default function FoodPartnerRegister() {
  const [name, setName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
     const name = e.target.name.value
     const contactName = e.target.contactName.value
     const phone = e.target.phone.value
     const address = e.target.address.value
     const password = e.target.password.value
     
     const response = await axios.post("/api/v1/foodpartner/register", {
      name,
      contactName,
      phone,
      address,
      email,
      password
     }, {
      withCredentials: true
     })

     console.log(response)

     navigate("/create-food")
     
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50">

      {/* Left Promo */}
      <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-5xl font-black">FoodReel Partner</h1>
        </div>

        <h2 className="text-5xl font-bold mb-6">Grow Your Restaurant</h2>
        <p className="text-lg opacity-95 mb-8">
          Reach hungry customers, manage orders, and upload food reels.
        </p>

        <button
          onClick={() => navigate("/user/register")}
          className="mt-8 px-8 py-4 bg-white/20 rounded-xl font-bold hover:bg-white/30"
        >
          Register as User →
        </button>
      </div>

      {/* Right Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">

          <h2 className="text-3xl font-black mb-2">Register Restaurant</h2>
          <p className="text-gray-500 mb-8">Create your FoodReel Partner account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={User}
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <InputField
              icon={User}
              label="Contact Name"
              name="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />

            <InputField
              icon={Phone}
              label="Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <InputField
              icon={MapPin}
              label="Address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <InputField
              icon={Mail}
              type="email"
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

          <button type="submit" className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold">
            Register Restaurant
          </button>
          </form>

          <div className="my-6">
            <SocialButtons />
          </div>

          <p className="text-center text-gray-700">
            Already a partner?{" "}
            <button
              onClick={() => navigate("/food-partner/login")}
              className="text-blue-600 font-bold"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
