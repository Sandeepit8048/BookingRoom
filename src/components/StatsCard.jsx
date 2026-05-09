export default function StatsCard({ title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-md">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}