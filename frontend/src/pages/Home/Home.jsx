// src/pages/Home.jsx
import React from "react";
import { useNavigate } from 'react-router-dom';
export default function Home() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden w-full">
      {/* Animated background elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-3xl relative z-10">
        {/* Icon/Badge */}
        {/* <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4 shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fuel Smart, Travel Far
        </div> */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-xs font-medium mb-4 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            FuelMap - Smart Routing
          </div>


        {/* Main heading with gradient */}
        {/* <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
          Smart Fuel-Efficient Route Planner
        </h2> */}
        
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
            FuelMap: Smart Fuel-Efficient Route Planner
          </h2>
        {/* Description */}
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          Plan your trips with real-time fuel optimization and find the best petrol pump stops
          along your route.
        </p>

        {/* CTA Button with enhanced styling */}
        <button className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base font-semibold transform hover:scale-105">
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">100%</div>
            <div className="text-xs text-gray-600">Optimized</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 mb-1">Real-time</div>
            <div className="text-xs text-gray-600">Updates</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">Smart</div>
            <div className="text-xs text-gray-600">Planning</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}