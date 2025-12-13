export default function StatsSection() {
  return (
    <section className="py-24 bg-white border-y border-zinc-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          {[
            { label: 'Conservative', value: '50%', sub: 'Risk Tolerance' },
            { label: 'Moderate', value: '75%', sub: 'Standard Benchmark' },
            { label: 'Aggressive', value: '100%', sub: 'Maximum Leverage' },
          ].map((stat, idx) => (
            <div key={idx} className="py-8 md:py-0 md:px-8 text-center group cursor-default">
              <div className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 group-hover:text-blue-600 transition-colors">
                {stat.label}
              </div>
              <div className="text-6xl md:text-7xl font-bold text-zinc-900 tracking-tighter mb-2 group-hover:scale-110 transition-transform duration-500">
                {stat.value}
              </div>
              <p className="text-zinc-500 font-medium">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
