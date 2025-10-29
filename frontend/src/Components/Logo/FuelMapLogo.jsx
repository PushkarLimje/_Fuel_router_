import React from "react";

export default function FuelMapLogo({ className = "h-10" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon */}
      <svg 
        viewBox="0 0 48 48" 
        className="h-full w-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="fuelMapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        
        {/* Background Circle */}
        <circle cx="24" cy="24" r="22" fill="url(#fuelMapGradient)" opacity="0.1"/>
        
        {/* Map Pin with Route */}
        <path 
          d="M24 8C18.5 8 14 12.5 14 18C14 25 24 36 24 36C24 36 34 25 34 18C34 12.5 29.5 8 24 8Z" 
          fill="url(#fuelMapGradient)"
          opacity="0.9"
        />
        
        {/* Inner Pin Circle */}
        <circle cx="24" cy="18" r="4" fill="white"/>
        
        {/* Fuel Drop Icon inside pin */}
        <path 
          d="M24 15C23.5 15 23 15.3 23 16C23 16.5 23.3 17 24 17.5C24.7 17 25 16.5 25 16C25 15.3 24.5 15 24 15Z" 
          fill="url(#fuelMapGradient)"
        />
        
        {/* Route Path Line */}
        <path 
          d="M12 40C12 40 18 35 24 35C30 35 36 40 36 40" 
          stroke="url(#fuelMapGradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      
      {/* Logo Text */}
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          FuelMap
        </span>
        <span className="text-[10px] text-gray-500 font-medium tracking-wider">
          SMART ROUTING
        </span>
      </div>
    </div>
  );
}

// Alternative: Logo only (no text)
export function FuelMapIcon({ className = "h-10 w-10" }) {
  return (
    <svg 
      viewBox="0 0 48 48" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fuelMapGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      
      <circle cx="24" cy="24" r="22" fill="url(#fuelMapGradient2)" opacity="0.1"/>
      
      <path 
        d="M24 8C18.5 8 14 12.5 14 18C14 25 24 36 24 36C24 36 34 25 34 18C34 12.5 29.5 8 24 8Z" 
        fill="url(#fuelMapGradient2)"
        opacity="0.9"
      />
      
      <circle cx="24" cy="18" r="4" fill="white"/>
      
      <path 
        d="M24 15C23.5 15 23 15.3 23 16C23 16.5 23.3 17 24 17.5C24.7 17 25 16.5 25 16C25 15.3 24.5 15 24 15Z" 
        fill="url(#fuelMapGradient2)"
      />
      
      <path 
        d="M12 40C12 40 18 35 24 35C30 35 36 40 36 40" 
        stroke="url(#fuelMapGradient2)" 
        strokeWidth="3" 
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}