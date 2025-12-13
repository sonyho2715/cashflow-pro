import Link from 'next/link';
import { BarChart3 } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-zinc-900 tracking-tight mb-4">Simple pricing.</h2>
            <p className="text-xl text-zinc-500">Start free. Upgrade when you need more power.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl border border-zinc-200 bg-zinc-50/50 hover:bg-white transition-colors duration-300">
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-zinc-900">Professional</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-zinc-900">$49</span>
                        <span className="text-zinc-500">/mo</span>
                    </div>
                    <p className="mt-4 text-zinc-500 text-sm">Perfect for independent agents.</p>
                </div>
                <ul className="space-y-4 mb-8">
                    {['25 cases per month', 'All analysis scenarios', 'Standard PDF reports', 'Email support'].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-zinc-700">
                            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">&#10003;</div>
                            {feat}
                        </li>
                    ))}
                </ul>
                <Link
                    href="/register"
                    className="block w-full py-4 rounded-xl border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-100 transition-colors text-center"
                >
                    Start 14-day trial
                </Link>
            </div>

            {/* Card 2 - Dark Mode / Featured */}
            <div className="p-8 rounded-3xl bg-zinc-900 text-white relative overflow-hidden shadow-2xl ring-1 ring-zinc-900/5">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold">Enterprise</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                            <span className="text-4xl font-bold">$99</span>
                            <span className="text-zinc-400">/mo</span>
                        </div>
                        <p className="mt-4 text-zinc-400 text-sm">For agencies and heavy users.</p>
                    </div>
                    <ul className="space-y-4 mb-8">
                        {['Unlimited cases', 'White-label reports', 'Team collaboration', 'Priority support', 'API Access'].map((feat, i) => (
                            <li key={i} className="flex items-center gap-3 text-zinc-300">
                                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs">&#10003;</div>
                                {feat}
                            </li>
                        ))}
                    </ul>
                    <Link
                        href="/register"
                        className="block w-full py-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20 text-center"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
