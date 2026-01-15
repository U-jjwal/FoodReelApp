import React from "react";

export default function InputField({ icon: Icon, type = "text", label, value, onChange, ...rest }) {
  return (
    <div>
      {label && <label className="block text-sm font-semibold text-gray-800 mb-2">{label}</label>}
      <div className="flex items-center gap-3 bg-white rounded-xl border-2 border-gray-200 px-4 py-3 hover:border-gray-300 focus-within:border-orange-500 focus-within:shadow-md transition-all duration-200">
        {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        <input
          type={type}
          value={value}
          onChange={onChange}
          {...rest}
          className="flex-1 outline-none bg-transparent text-gray-800 placeholder-gray-400 font-medium"
        />
      </div>
    </div>
  );
}
