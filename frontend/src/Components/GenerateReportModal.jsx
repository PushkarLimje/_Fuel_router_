// src/components/GenerateReportModal.jsx
import { useState } from "react";
import { X, Fuel, MapPin, CreditCard, DollarSign } from "lucide-react";

export default function GenerateReportModal({ isOpen, onClose, onSubmit, route }) {
  const [formData, setFormData] = useState({
    // Fuel Station
    stationName: "HP Fuel Centre",
    stationBrand: "HP",
    stationAddress: "Baner Road, Pune",
    stationLat: 18.559,
    stationLng: 73.789,
    
    // Transaction
    fuelType: "Petrol",
    pricePerLiter: 104.3,
    quantity: 20,
    paymentMode: "UPI",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requestData = {
      fuelPricePerLiter: parseFloat(formData.pricePerLiter),
      quantity: parseFloat(formData.quantity),
      fuelStation: {
        name: formData.stationName,
        brand: formData.stationBrand,
        address: formData.stationAddress,
        location: {
          lat: parseFloat(formData.stationLat),
          lng: parseFloat(formData.stationLng)
        }
      },
      transaction: {
        fuelType: formData.fuelType,
        paymentMode: formData.paymentMode,
        paymentStatus: "Paid"
      }
    };
    
    onSubmit(requestData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Generate Fuel Receipt</h2>
              <p className="text-blue-100 text-sm mt-1">
                {route?.source} → {route?.destination}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fuel Station Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Fuel Station Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Station Name
                </label>
                <input
                  type="text"
                  name="stationName"
                  value={formData.stationName}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <select
                  name="stationBrand"
                  value={formData.stationBrand}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="HP">HP</option>
                  <option value="BPCL">BPCL</option>
                  <option value="IOCL">Indian Oil</option>
                  <option value="Shell">Shell</option>
                  <option value="Essar">Essar</option>
                  <option value="Reliance">Reliance</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="stationAddress"
                  value={formData.stationAddress}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Transaction Section */}
          <div>
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Fuel className="w-5 h-5 text-blue-500" />
              Transaction Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Liter (₹)
                </label>
                <input
                  type="number"
                  name="pricePerLiter"
                  value={formData.pricePerLiter}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (Liters)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Mode
                </label>
                <select
                  name="paymentMode"
                  value={formData.paymentMode}
                  onChange={handleChange}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Wallet">Wallet</option>
                </select>
              </div>
            </div>
          </div>

          {/* Cost Preview */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Cost Preview</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">
                  ₹{(formData.pricePerLiter * formData.quantity).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST (5%):</span>
                <span className="font-semibold">
                  ₹{(formData.pricePerLiter * formData.quantity * 0.05).toFixed(2)}
                </span>
              </div>
              <div className="border-t-2 border-blue-300 pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Grand Total:</span>
                <span className="font-bold text-blue-600 text-lg">
                  ₹{(formData.pricePerLiter * formData.quantity * 1.05).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold shadow-lg"
            >
              Generate Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}