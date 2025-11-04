import { ShieldCheck, Settings } from 'lucide-react'

export default function AppHeader({ plan, onUpgrade }) {
  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-neutral-900/80 backdrop-blur border-b border-neutral-800">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center text-white font-bold">
          QATM
        </div>
        <div>
          <h1 className="text-white font-semibold leading-tight">QA Task Manager</h1>
          <p className="text-xs text-neutral-400">SQA-focused test management</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs px-2 py-1 rounded border border-neutral-700 text-neutral-300">
          Plan: <span className={"font-medium " + (plan === 'pro' ? 'text-emerald-400' : 'text-neutral-200')}>{plan?.toUpperCase()}</span>
        </span>
        {plan !== 'pro' && (
          <button
            onClick={onUpgrade}
            className="inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:opacity-90"
          >
            <ShieldCheck size={16} /> Upgrade to Pro
          </button>
        )}
        <button className="p-2 rounded hover:bg-neutral-800 text-neutral-300">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}
