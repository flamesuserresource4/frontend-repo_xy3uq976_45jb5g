export default function DashboardSummary({ summary }) {
  const { total_projects = 0, total_testcases = 0, pass_rate = 0, fail_rate = 0, pass_count = 0, fail_count = 0, pending_count = 0 } = summary || {}

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard title="Projects" value={total_projects} accent="from-cyan-500 to-blue-600" />
      <StatCard title="Test Cases" value={total_testcases} accent="from-purple-500 to-pink-600" />
      <StatCard title="Pass" value={`${pass_count} (${pass_rate}%)`} accent="from-emerald-500 to-teal-600" />
      <StatCard title="Fail" value={`${fail_count} (${fail_rate}%)`} accent="from-red-500 to-rose-600" />
      <StatCard title="Pending" value={pending_count} accent="from-amber-500 to-orange-600" />
    </section>
  )
}

function StatCard({ title, value, accent }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-4">
      <p className="text-xs text-neutral-400 mb-2">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-xl font-semibold text-white">{value}</h3>
        <span className={`h-6 w-6 rounded bg-gradient-to-br ${accent}`} />
      </div>
    </div>
  )
}
