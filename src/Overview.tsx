import React from 'react';
import {
    Mail,
    Eye,
    Heart,
    MoreVertical,
    ArrowUpRight
} from 'lucide-react';

const StatCard: React.FC<{
    title: string;
    value: string;
    trend: string;
    icon: React.ElementType;
    color: string;
    chartPath: string;
}> = ({ title, value, trend, icon: Icon, color, chartPath }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col relative transition-all hover:scale-[1.02] duration-300">
        <div className="flex justify-between items-start mb-6">
            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div className="flex items-center gap-1 text-[#22C55E] font-bold text-sm bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} />
                {trend}
            </div>
        </div>
        <p className="text-slate-400 dark:text-slate-500 font-medium text-sm mb-2">{title}</p>
        <h3 className="text-4xl font-black text-slate-800 dark:text-slate-100 mb-6">{value}</h3>

        <div className="mt-auto pt-4">
            <svg className="w-full h-12 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <path
                    d={chartPath}
                    fill="none"
                    stroke={color.replace('bg-[', '').replace(']', '')}
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="opacity-40"
                />
            </svg>
        </div>
    </div>
);

const ActivityRow: React.FC<{
    name: string;
    email: string;
    status: string;
    statusColor: string;
    time: string;
    initials: string;
    initialColor: string;
}> = ({ name, email, status, statusColor, time, initials, initialColor }) => (
    <div className="grid grid-cols-12 items-center py-5 px-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors border-b border-rose-50/50 dark:border-slate-800 last:border-0">
        <div className="col-span-4 flex items-center gap-4">
            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold shadow-sm ${initialColor}`}>
                {initials}
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-[15px]">{name}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs">{email}</p>
            </div>
        </div>
        <div className="col-span-3">
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold flex items-center w-fit gap-1.5 ${statusColor}`}>
                <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                {status}
            </span>
        </div>
        <div className="col-span-4 text-slate-400 text-sm font-medium">
            {time}
        </div>
        <div className="col-span-1 flex justify-end">
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
                <MoreVertical size={20} />
            </button>
        </div>
    </div>
);

const Overview: React.FC = () => {
    const activities = [
        { name: 'Sarah Miller', email: 'sarah.m@example.com', status: 'Opened Link', statusColor: 'bg-[#ECFDF5] text-[#10B981]', time: '2 minutes ago', initials: 'SM', initialColor: 'bg-rose-50 text-rose-400' },
        { name: 'James Doe', email: 'james.doe@webmail.com', status: 'Accepted Proposal 💖', statusColor: 'bg-[#FFF1F2] text-[#F43F5E]', time: '15 minutes ago', initials: 'JD', initialColor: 'bg-rose-100/50 text-rose-500' },
        { name: 'Anna Lee', email: 'anna.lee@domain.com', status: 'Opened Link', statusColor: 'bg-[#ECFDF5] text-[#10B981]', time: '42 minutes ago', initials: 'AL', initialColor: 'bg-rose-50 text-rose-400' },
        { name: 'Mike Kole', email: 'mk@kole.io', status: 'Sent', statusColor: 'bg-[#F1F5F9] text-[#64748B]', time: '1 hour ago', initials: 'MK', initialColor: 'bg-rose-50 text-rose-300' },
    ];

    return (
        <div className="p-10 max-w-[1400px] mx-auto font-plus-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard
                    title="Total Invitations Sent"
                    value="1,284"
                    trend="+12%"
                    icon={Mail}
                    color="bg-[#FF4D6D]"
                    chartPath="M0 15 Q 15 5, 25 10 T 40 8 T 60 12 T 80 5 T 100 10"
                />
                <StatCard
                    title="Average Open Rate"
                    value="84.5%"
                    trend="+5.2%"
                    icon={Eye}
                    color="bg-[#FF8FA3]"
                    chartPath="M0 10 Q 20 0, 40 15 T 60 5 T 80 18 T 100 8"
                />
                <StatCard
                    title="Accepted Proposals"
                    value="412"
                    trend="+24%"
                    icon={Heart}
                    color="bg-[#FFB3C1]"
                    chartPath="M0 18 Q 20 18, 40 8 T 60 15 T 80 5 T 100 10"
                />
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-50 dark:border-slate-800 overflow-hidden">
                <div className="p-8 border-b border-rose-50/50 dark:border-slate-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Recent Activity</h2>
                        <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Track how your recipients interact with their links</p>
                    </div>
                    <button className="text-[#FF4D6D] font-bold text-sm hover:underline">View All</button>
                </div>

                <div className="bg-rose-50/20 dark:bg-slate-800/50 grid grid-cols-12 py-4 px-8 border-b border-rose-50/50 dark:border-slate-800">
                    <div className="col-span-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recipient</div>
                    <div className="col-span-3 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</div>
                    <div className="col-span-4 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Time</div>
                    <div className="col-span-1 text-right text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Action</div>
                </div>

                <div className="divide-y divide-rose-50/30">
                    {activities.map((act, i) => (
                        <ActivityRow key={i} {...act} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
