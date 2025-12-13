import { BarChart3 } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-50 border-t border-zinc-200 py-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center gap-2 mb-4 md:mb-0">
                        <div className="w-6 h-6 bg-zinc-900 rounded-md flex items-center justify-center">
                            <BarChart3 className="text-white w-3 h-3" />
                        </div>
                        <span className="font-semibold text-zinc-900">CashFlow Pro</span>
                    </div>
                    <div className="flex gap-6 text-sm text-zinc-500">
                        <a href="#" className="hover:text-zinc-900">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-900">Terms of Service</a>
                        <a href="#" className="hover:text-zinc-900">Contact</a>
                    </div>
                </div>
                <div className="mt-8 text-center md:text-left text-xs text-zinc-400">
                    &copy; 2025 CashFlow Pro Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
