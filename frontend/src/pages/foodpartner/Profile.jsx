import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function FoodPartnerProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/v1/food-partner/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setProfile(response.data.foodPartner);
        setVideos(response.data.foodPartner.foodItems);
      })
      .catch(console.error);
  }, [id]);

  if (!profile) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex justify-center py-6">
      <div className="w-full max-w-sm text-white">

        {/* PROFILE CARD */}
        <div className="bg-[#6b1f2a] rounded-2xl p-4 mb-4">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-full bg-green-800 border-2 border-green-400" />
            <div className="flex-1 space-y-2">
              <div className="bg-green-800 text-center py-1 rounded-lg text-sm font-semibold">
                {profile.name}
              </div>
              <div className="bg-green-800 text-center py-1 rounded-lg text-sm">
                {profile.address}
              </div>
            </div>
          </div>

          <div className="flex justify-around mt-6 text-center">
            <div>
              <p className="text-sm opacity-80">total meals</p>
              <p className="text-lg font-bold">{videos.length}</p>
            </div>
            <div>
              <p className="text-sm opacity-80">customer serve</p>
              <p className="text-lg font-bold">15K</p>
            </div>
          </div>
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-3 gap-1">
          {videos.map((item) => (
            <div
              key={item._id}
              className="aspect-[9/16] bg-[#083a5f] overflow-hidden"
            >
              <video
                src={item.video}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
