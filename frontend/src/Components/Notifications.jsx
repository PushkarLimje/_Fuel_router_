import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast Component
export function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6 text-green-500" />,
    error: <XCircle className="w-6 h-6 text-red-500" />,
    warning: <AlertCircle className="w-6 h-6 text-yellow-500" />,
    info: <Info className="w-6 h-6 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full ${bgColors[type]} border-2 rounded-xl shadow-lg transform transition-all duration-300 animate-slide-in`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
        <div className="flex-1">
          <p className={`font-semibold ${textColors[type]}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${textColors[type]} hover:opacity-70 transition-opacity`}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      {duration && (
        <div className="h-1 bg-gray-200 rounded-b-xl overflow-hidden">
          <div
            className={`h-full ${
              type === 'success'
                ? 'bg-green-500'
                : type === 'error'
                ? 'bg-red-500'
                : type === 'warning'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            } animate-progress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

// Toast Container Hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer };
}

// Success Modal Component
export function SuccessModal({ title, message, onClose, autoClose = true }) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// Error Modal Component
export function ErrorModal({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-scale-in">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-shake">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// Route Success Modal Component
export function RouteSuccessModal({ route, onClose, onViewRoute }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all animate-scale-in">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mb-4 animate-bounce-in">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Route Found! 🎉</h3>
            <p className="text-gray-600">Your optimal route has been calculated</p>
          </div>

          {route && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Distance</span>
                <span className="text-xl font-bold text-blue-600">{route.distance} km</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Estimated Time</span>
                <span className="text-xl font-bold text-indigo-600">{route.duration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Fuel Cost</span>
                <span className="text-xl font-bold text-green-600">₹{route.fuelCost}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onViewRoute}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              View Route
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Demo Component showing all notification types
export default function NotificationDemo() {
  const { showToast, ToastContainer } = useToast();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);

  const mockRoute = {
    distance: 245,
    duration: '3h 45min',
    fuelCost: 1850,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Custom Notifications
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Beautiful, animated notifications for better user experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Toast Notifications */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Toast Notifications</h2>
            <div className="space-y-3">
              <button
                onClick={() => showToast('Login successful! Welcome back.', 'success')}
                className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-all"
              >
                Show Success Toast
              </button>
              <button
                onClick={() => showToast('Something went wrong. Please try again.', 'error')}
                className="w-full bg-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-all"
              >
                Show Error Toast
              </button>
              <button
                onClick={() => showToast('Please check your internet connection.', 'warning')}
                className="w-full bg-yellow-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-yellow-600 transition-all"
              >
                Show Warning Toast
              </button>
              <button
                onClick={() => showToast('New features are now available!', 'info')}
                className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-all"
              >
                Show Info Toast
              </button>
            </div>
          </div>

          {/* Modal Notifications */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Modal Notifications</h2>
            <div className="space-y-3">
              <button
                onClick={() => setShowSuccessModal(true)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Show Success Modal
              </button>
              <button
                onClick={() => setShowErrorModal(true)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Show Error Modal
              </button>
              <button
                onClick={() => setShowRouteModal(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Show Route Success Modal
              </button>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Usage Examples</h2>
          <div className="bg-gray-50 rounded-xl p-4 font-mono text-sm">
            <div className="text-gray-700 mb-2">// Toast Notification</div>
            <div className="text-blue-600">showToast('Message', 'success')</div>
            
            <div className="text-gray-700 mt-4 mb-2">// Success Modal</div>
            <div className="text-blue-600">setShowSuccessModal(true)</div>
            
            <div className="text-gray-700 mt-4 mb-2">// Route Success</div>
            <div className="text-blue-600">setShowRouteModal(true)</div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Modals */}
      {showSuccessModal && (
        <SuccessModal
          title="Login Successful!"
          message="Welcome back! You've been successfully logged in."
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {showErrorModal && (
        <ErrorModal
          title="Login Failed"
          message="Invalid credentials. Please check your email and password."
          onClose={() => setShowErrorModal(false)}
        />
      )}

      {showRouteModal && (
        <RouteSuccessModal
          route={mockRoute}
          onClose={() => setShowRouteModal(false)}
          onViewRoute={() => {
            setShowRouteModal(false);
            alert('Navigating to route view...');
          }}
        />
      )}

      {/* Add custom animations to your global CSS */}
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .animate-progress {
          animation: progress linear;
        }
      `}</style>
    </div>
  );
}