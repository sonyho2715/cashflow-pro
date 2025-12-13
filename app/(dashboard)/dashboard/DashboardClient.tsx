'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  Menu,
  X,
  Plus,
  Search,
  Bell,
  LayoutDashboard,
  Briefcase,
  TrendingUp,
  MoreHorizontal,
  Settings,
  LogOut,
  FileBarChart,
  Save,
  Check,
  MessageSquare
} from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createBusiness } from '@/app/actions/business';
import AreaChart from '@/components/dashboard/AreaChart';

interface Activity {
  id: string;
  industry: string;
  companyName?: string | null;
  revenue: string;
  date: string;
  status: string;
}

interface DashboardClientProps {
  user: {
    name?: string;
    email: string;
    plan: string;
  };
  initialStats: {
    activeAnalyses: number;
    reportsGenerated: number;
    totalRevenue: string;
  };
  initialActivities: Activity[];
}

function formatRevenue(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '$0';
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(0)}M`;
  }
  return `$${num.toLocaleString()}`;
}

function getStatusType(status: string): 'success' | 'info' | 'default' {
  switch (status) {
    case 'ANALYZED':
      return 'success';
    case 'REPORTED':
      return 'info';
    default:
      return 'default';
  }
}

function formatStatus(status: string): string {
  return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ');
}

export default function DashboardClient({
  user,
  initialStats,
  initialActivities,
}: DashboardClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [stats, setStats] = useState(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newBiz, setNewBiz] = useState({ industry: '', annualRevenue: '', companyName: '' });
  const [saving, setSaving] = useState(false);

  const handleSaveBusiness = async () => {
    if (!newBiz.industry || !newBiz.annualRevenue) return;

    setSaving(true);
    const formData = new FormData();
    formData.append('industry', newBiz.industry);
    formData.append('annualRevenue', newBiz.annualRevenue);
    if (newBiz.companyName) {
      formData.append('companyName', newBiz.companyName);
    }

    const result = await createBusiness(formData);

    if (result.success && result.data) {
      const newActivity: Activity = {
        id: result.data.id,
        industry: result.data.industry,
        companyName: result.data.companyName,
        revenue: `$${Number(result.data.annualRevenue).toLocaleString()}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        status: 'DRAFT',
      };

      setActivities([newActivity, ...activities]);
      setStats({
        ...stats,
        activeAnalyses: stats.activeAnalyses + 1,
      });
    }

    setNewBiz({ industry: '', annualRevenue: '', companyName: '' });
    setIsModalOpen(false);
    setSaving(false);

    startTransition(() => {
      router.refresh();
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        absolute md:static top-0 left-0 bottom-0 w-64 border-r border-white/5 bg-zinc-900/95 md:bg-zinc-900/50 backdrop-blur-xl flex flex-col z-40 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <BarChart3 className="text-black w-5 h-5" />
            </div>
            <span className="font-semibold tracking-tight text-lg">CashFlow Pro</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { icon: LayoutDashboard, label: 'Dashboard', active: true },
            { icon: Briefcase, label: 'Businesses', active: false },
            { icon: FileBarChart, label: 'Analysis', active: false },
            { icon: Settings, label: 'Settings', active: false }
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                item.active
                ? 'bg-zinc-800 text-white shadow-inner shadow-white/5'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
              <p className="text-xs text-zinc-500">{user.plan}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-black relative w-full">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-8 py-6 bg-black/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-zinc-400">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-full text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 transition-all focus:w-72"
              />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`relative w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center hover:bg-zinc-800 transition-colors ${isNotificationsOpen ? 'bg-zinc-800 ring-2 ring-blue-500/30' : ''}`}
              >
                <Bell className="w-4 h-4 text-zinc-400" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-zinc-900"></span>
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center">
                    <span className="font-semibold text-sm">Notifications</span>
                    <span className="text-xs text-blue-400 cursor-pointer">Mark all read</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { icon: Check, bg: 'bg-green-500/10', color: 'text-green-500', text: 'Analysis completed for Tech Corp', time: '2m ago' },
                      { icon: Briefcase, bg: 'bg-blue-500/10', color: 'text-blue-500', text: 'New business added', time: '1h ago' },
                      { icon: MessageSquare, bg: 'bg-purple-500/10', color: 'text-purple-500', text: 'Comment from CFO', time: '3h ago' },
                    ].map((notif, i) => (
                      <div key={i} className="px-4 py-3 hover:bg-white/5 flex gap-3 cursor-pointer border-b border-white/5 last:border-0">
                        <div className={`w-8 h-8 rounded-full ${notif.bg} ${notif.color} flex items-center justify-center flex-shrink-0`}>
                          <notif.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-200">{notif.text}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">New Business</span>
            </button>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Active Analyses', value: stats.activeAnalyses.toString(), trend: '+5%', trendColor: 'text-green-500' },
              { label: 'Reports Generated', value: stats.reportsGenerated.toString(), trend: '+8%', trendColor: 'text-green-500' },
              { label: 'Revenue Analyzed', value: formatRevenue(stats.totalRevenue), trend: null, trendColor: '' }
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:bg-zinc-900 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-sm text-zinc-400 font-medium">{stat.label}</div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <TrendingUp className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-3xl font-bold tracking-tight text-white">{stat.value}</div>
                  {stat.trend && (
                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 ${stat.trendColor}`}>
                      {stat.trend}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold">Revenue Trend</h2>
                <p className="text-sm text-zinc-500">Total processed volume over time</p>
              </div>
              <div className="flex gap-2">
                {['1W', '1M', '3M', '1Y'].map((t, i) => (
                  <button key={i} className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${i === 1 ? 'bg-white text-black' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <AreaChart />
          </div>

          {/* Recent Activity Table */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="font-semibold">Recent Activity</h2>
              <button className="text-sm text-blue-500 hover:text-blue-400 transition-colors">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 font-medium text-zinc-500">Business</th>
                    <th className="px-6 py-4 font-medium text-zinc-500">Revenue</th>
                    <th className="px-6 py-4 font-medium text-zinc-500">Last Updated</th>
                    <th className="px-6 py-4 font-medium text-zinc-500">Status</th>
                    <th className="px-6 py-4 font-medium text-zinc-500"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                        No businesses yet. Click &quot;New Business&quot; to add your first one.
                      </td>
                    </tr>
                  ) : (
                    activities.map((row) => (
                      <tr key={row.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                        <td className="px-6 py-4 font-medium text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div>
                              <p>{row.companyName || row.industry}</p>
                              {row.companyName && (
                                <p className="text-xs text-zinc-500">{row.industry}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-400">{row.revenue}</td>
                        <td className="px-6 py-4 text-zinc-400">{row.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                            getStatusType(row.status) === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            getStatusType(row.status) === 'info' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                          }`}>
                            {formatStatus(row.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-zinc-600 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* New Business Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            <div className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">New Business Analysis</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    value={newBiz.companyName}
                    onChange={(e) => setNewBiz({ ...newBiz, companyName: e.target.value })}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-zinc-600"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Industry *</label>
                  <input
                    type="text"
                    value={newBiz.industry}
                    onChange={(e) => setNewBiz({ ...newBiz, industry: e.target.value })}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-zinc-600"
                    placeholder="e.g. Manufacturing"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Annual Revenue *</label>
                  <input
                    type="text"
                    value={newBiz.annualRevenue}
                    onChange={(e) => setNewBiz({ ...newBiz, annualRevenue: e.target.value })}
                    className="w-full bg-zinc-800/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-zinc-600"
                    placeholder="e.g. $5,000,000"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 font-medium hover:bg-white/5 transition-colors text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBusiness}
                  disabled={saving || !newBiz.industry || !newBiz.annualRevenue}
                  className="flex-1 py-2.5 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Business'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
