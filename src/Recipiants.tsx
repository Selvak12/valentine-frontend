import React, { useState } from 'react';
import {
    Search,
    Download,
    Plus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

const RecipientRow: React.FC<{
    name: string;
    email: string;
    status: 'Accepted' | 'Opened' | 'Sent';
    dateSent: string;
    initials: string;
    color: string;
}> = ({ name, email, status, dateSent, initials, color }) => {
    const statusStyles = {
        Accepted: 'bg-[#ECFDF5] dark:bg-green-500/10 text-[#10B981]',
        Opened: 'bg-[#EFF6FF] dark:bg-blue-500/10 text-[#3B82F6]',
        Sent: 'bg-[#F1F5F9] dark:bg-slate-500/10 text-[#64748B]',
    };

    return (
        <div className="grid grid-cols-12 items-center py-5 px-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-rose-50/50 dark:border-slate-800 last:border-0">
            <div className="col-span-4 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${color}`}>
                    {initials}
                </div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{name}</span>
            </div>
            <div className="col-span-3 text-slate-500 dark:text-slate-400 text-sm font-medium">
                {email}
            </div>
            <div className="col-span-2">
                <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center w-fit gap-1.5 ${statusStyles[status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {status}
                </span>
            </div>
            <div className="col-span-2 text-slate-400 dark:text-slate-500 text-sm italic font-medium">
                {dateSent}
            </div>
            <div className="col-span-1 flex justify-end">
                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                    <MoreVertical size={20} />
                </button>
            </div>
        </div>
    );
};

const Recipiants: React.FC = () => {
    const [search, setSearch] = useState('');

    const data = [
        { name: 'Manu', email: 'manu@example.com', status: 'Accepted' as const, dateSent: 'Feb 10, 2024', initials: 'M', color: 'bg-rose-50 text-rose-400' },
        { name: 'Jessica Chen', email: 'jess.chen@web.com', status: 'Opened' as const, dateSent: 'Feb 12, 2024', initials: 'J', color: 'bg-blue-50 text-blue-400' },
        { name: 'Alex River', email: 'alex.river@mail.com', status: 'Sent' as const, dateSent: 'Feb 13, 2024', initials: 'A', color: 'bg-amber-50 text-amber-400' },
        { name: 'Sarah Smith', email: 'sarah@domain.org', status: 'Accepted' as const, dateSent: 'Feb 09, 2024', initials: 'S', color: 'bg-rose-50 text-rose-400' },
    ];

    return (
        <div className="p-10 max-w-[1400px] mx-auto font-plus-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search recipients..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[18px] pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none shadow-sm transition-all text-slate-800 dark:text-slate-100"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[18px] text-slate-600 dark:text-slate-400 font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#FF4D6D] text-white rounded-[18px] font-bold text-sm shadow-lg shadow-rose-200 hover:bg-[#ff3355] transition-all">
                        <Plus size={18} />
                        Add New
                    </button>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden mb-6">
                <div className="bg-rose-50/20 dark:bg-slate-800/50 grid grid-cols-12 py-5 px-8 border-b border-rose-50/50 dark:border-slate-800">
                    <div className="col-span-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recipient</div>
                    <div className="col-span-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Email Address</div>
                    <div className="col-span-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</div>
                    <div className="col-span-2 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date Sent</div>
                    <div className="col-span-1 text-right text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actions</div>
                </div>

                <div className="divide-y divide-rose-50/30">
                    {data.map((row, i) => (
                        <RecipientRow key={i} {...row} />
                    ))}
                </div>

                {/* Footer/Pagination Info */}
                <div className="p-8 flex flex-col md:flex-row items-center justify-between border-t border-rose-50/30 dark:border-slate-800 gap-4">
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Showing 1-4 of 24 recipients</p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><ChevronLeft size={18} /></button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FF4D6D] text-white font-bold text-sm shadow-md shadow-rose-100 transition-all">1</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">3</button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recipiants;
