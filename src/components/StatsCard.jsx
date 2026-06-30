function StatsCard({ title, value }) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl shadow-md">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

export default StatsCard;
