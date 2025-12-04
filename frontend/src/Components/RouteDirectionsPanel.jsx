import React, { useState } from 'react';
import { Navigation, Clock, Fuel, MapPin, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export default function RouteDirectionsPanel({ routes, isNavigating  }) {
  const [expandedRoute, setExpandedRoute] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // If no routes provided, show placeholder
  if (!routes || routes.length === 0) {
    return (
      <div className="w-96 h-screen bg-white shadow-2xl flex items-center justify-center">
        <div className="text-center p-8">
          <Navigation className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Calculate a route to see directions</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen bg-white shadow-2xl overflow-y-auto transition-all duration-300 ${
      isMinimized ? 'w-16' : 'w-96'
    }`}>
      {/* Header */}
      {/* <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 shadow-lg z-10">
        <div className="flex items-center justify-between">
          {!isMinimized && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Route Options</h2>
              <p className="text-blue-100 text-sm">Choose your preferred route</p>
            </div>
          )} */}
          <div className={`sticky top-0 ${
                isNavigating 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                } text-white p-6 shadow-lg z-10`}>
                <div className="flex items-center justify-between">
                    {!isMinimized && (
                    <div>
                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {isNavigating && <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>}
                        {isNavigating ? 'Navigation Active' : 'Route Options'}
                        </h2>
                        <p className="text-blue-100 text-sm">
                        {isNavigating ? 'Follow the directions below' : 'Choose your preferred route'}
                        </p>
                    </div>
                    )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-all ml-auto"
            title={isMinimized ? "Expand panel" : "Minimize panel"}
          >
            {isMinimized ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <ChevronRight className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Route Cards */}
      {!isMinimized && (
        <div className="p-4 space-y-4">
          {routes.map((route, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl overflow-hidden transition-all duration-300 ${
                expandedRoute === index 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Route Summary */}
              <div
                onClick={() => setExpandedRoute(expandedRoute === index ? -1 : index)}
                className="p-4 cursor-pointer bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{route.name}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        <Navigation className="w-4 h-4" />
                        {route.distance}
                      </span>
                      <span className="flex items-center gap-1 text-green-600 font-semibold">
                        <Clock className="w-4 h-4" />
                        {route.time}
                      </span>
                      <span className="flex items-center gap-1 text-orange-600 font-semibold">
                        <Fuel className="w-4 h-4" />
                        {route.fuelCost}
                      </span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    {expandedRoute === index ? (
                      <ChevronUp className="w-6 h-6" />
                    ) : (
                      <ChevronDown className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Directions */}
              {expandedRoute === index && (
                <div className="border-t border-gray-200 bg-white">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      Turn-by-turn Directions
                    </div>
                    
                    {route.directions.map((step, stepIndex) => (
                      <div
                        key={stepIndex}
                        className="flex gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-lg">
                          {step.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 text-sm leading-relaxed">
                            {step.instruction}
                          </p>
                          <p className="text-blue-600 font-semibold text-xs mt-1">
                            {step.distance}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                      <Navigation className="w-5 h-5" />
                      Start Navigation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      {!isMinimized && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 m-4 rounded-xl">
          <p className="text-sm text-gray-600 text-center">
            💡 <span className="font-semibold">Tip:</span> Click on a route to see detailed directions
          </p>
        </div>
      )}
    </div>
  );
}