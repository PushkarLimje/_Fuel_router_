import { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ReportsChart = ({ userId }) => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get(`/api/dashboard/reports/${userId}`).then((res) => {
      setReports(res.data);
    });
  }, [userId]);

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow text-white">
      <h2 className="text-lg font-semibold mb-4">Fuel Usage Report</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={reports}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="fuelUsed" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportsChart;
