import { Zap, Shield, Users, FileText, Check } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section id="features" className="py-32 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl font-semibold text-zinc-900 tracking-tight mb-6">
            Pro tools. <br/>
            <span className="text-zinc-400">For pro agents.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Large Card */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 overflow-hidden relative group hover:shadow-lg transition-shadow duration-300">
            <div className="relative z-10 max-w-md">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Real-Time Calculations</h3>
              <p className="text-zinc-500 leading-relaxed">
                Watch your analysis update instantly as you enter financial data. No loading bars, no waiting.
              </p>
            </div>
            {/* Abstract Graphic */}
            <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-blue-50/50 to-transparent">
              <div className="absolute bottom-8 right-8 space-y-3">
                 <div className="w-48 h-12 bg-white rounded-xl shadow-lg flex items-center px-4 gap-3 animate-pulse">
                    <div className="w-6 h-6 rounded-full bg-green-100"></div>
                    <div className="h-2 w-20 bg-zinc-100 rounded"></div>
                 </div>
                 <div className="w-48 h-12 bg-white rounded-xl shadow-lg flex items-center px-4 gap-3 ml-8">
                    <div className="w-6 h-6 rounded-full bg-blue-100"></div>
                    <div className="h-2 w-24 bg-zinc-100 rounded"></div>
                 </div>
              </div>
            </div>
          </div>

          {/* Tall Card */}
          <div className="md:row-span-2 bg-zinc-900 rounded-3xl p-8 shadow-sm overflow-hidden relative group text-white">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-white">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Enterprise Security</h3>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Bank-grade encryption for your client&apos;s most sensitive financial data.
              </p>
              <ul className="space-y-4">
                 {['SOC2 Compliant', 'End-to-end Encryption', 'Access Logs'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
                        <Check className="w-4 h-4 text-emerald-400" /> {item}
                    </li>
                 ))}
              </ul>
            </div>
          </div>

          {/* Medium Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
             <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">Collaboration</h3>
              <p className="text-zinc-500 leading-relaxed">
                Invite CFOs to input data directly via secure tokens.
              </p>
          </div>

          {/* Medium Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100 hover:shadow-lg transition-shadow duration-300">
             <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">PDF Reports</h3>
              <p className="text-zinc-500 leading-relaxed">
                Generate board-ready presentations in one click.
              </p>
          </div>
        </div>
      </div>
    </section>
  );
}
