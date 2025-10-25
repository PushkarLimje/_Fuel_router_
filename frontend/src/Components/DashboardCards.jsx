const DashboardCards = ({ data }) => {
  const cards = [
    { title: "Planned Routes", value: data.totalRoutes },
    { title: "Reports Generated", value: data.totalReports },
    { title: "Fuel Stations", value: data.totalStations },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-gray-800 text-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="text-3xl font-bold mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
};
export default DashboardCards;
