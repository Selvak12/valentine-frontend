import React from 'react';
import {
    Mail,
    Heart,
    Eye,
    Clock,
    CheckCircle2,
    Send,
    Music,
    Monitor,
    Smartphone,
    Tablet,
} from 'lucide-react';
import { invitationService } from './services/api/invitationService';


const StatCard: React.FC<{
    title: string;
    value: string;
    trend: string;
    trendValue: string;
    icon: React.ElementType;
    color: string;
}> = ({ title, value, trend, trendValue, icon: Icon, color }) => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-50 dark:border-slate-800 relative flex flex-col items-center text-center group hover:scale-[1.02] transition-all duration-300">
        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
            <Icon size={20} className="text-white" />
        </div>
        <div className={`absolute top-6 right-6 font-bold text-[11px] ${trend === 'up' ? 'text-[#22C55E]' : trend === 'down' ? 'text-[#F43F5E]' : 'text-slate-400'}`}>
            {trendValue}
        </div>
        <p className="text-slate-400 dark:text-slate-500 font-medium text-[13px] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{value}</h3>
    </div>
);

const ActivityBar: React.FC<{ sent: number; accepted: number; label: string }> = ({ sent, accepted, label }) => (
    <div className="flex flex-col items-center flex-1 h-full pt-10 relative">
        <div className="flex items-end gap-1.5 h-full w-full justify-center">
            <div
                className="w-4 bg-rose-100/50 rounded-t-lg transition-all duration-500 hover:bg-rose-100"
                style={{ height: `${sent}%` }}
            />
            <div
                className="w-4 bg-[#FF4D6D] rounded-t-lg transition-all duration-500 hover:bg-[#ff3355]"
                style={{ height: `${accepted}%` }}
            />
        </div>
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-4">{label}</p>
    </div>
);

const MusicItem: React.FC<{ title: string; artist: string; plays: number }> = ({ title, artist, plays }) => (
    <div className="flex items-center justify-between py-4 border-b border-rose-50/30 dark:border-slate-800 last:border-0 group cursor-pointer">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                <Music size={18} />
            </div>
            <div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{title}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">{artist}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="font-black text-slate-800 dark:text-slate-200 text-sm">{plays}</p>
            <p className="text-slate-300 dark:text-slate-600 text-[10px] font-bold uppercase tracking-widest">Plays</p>
        </div>
    </div>
);

const LiveFeedItem: React.FC<{ type: 'accepted' | 'sent' | 'opened'; content: React.ReactNode; time: string }> = ({ type, content, time }) => {
    const configs = {
        accepted: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-500/10' },
        sent: { icon: Send, color: 'text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10' },
        opened: { icon: Eye, color: 'text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' }
    };
    const { icon: Icon, color, bg } = configs[type];

    return (
        <div className="flex gap-4 relative pb-8 last:pb-0">
            <div className="absolute left-[18px] top-10 bottom-0 w-[2px] bg-slate-50 last:hidden"></div>
            <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 z-10 ${bg} ${color}`}>
                <Icon size={16} />
            </div>
            <div>
                <div className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                    {content}
                </div>
                <p className="text-[11px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest mt-1.5">{time}</p>
            </div>
        </div>
    );
};

const Analytics: React.FC = () => {
    const [stats, setStats] = React.useState<any>(null);
    const [activities, setActivities] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, recentData] = await Promise.all([
                    invitationService.getStats(),
                    invitationService.getAll(undefined, 1, 5)
                ]);

                setStats(statsData);
                setActivities(recentData.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-10 flex flex-col items-center justify-center min-h-[600px]">
                <div className="h-12 w-12 border-4 border-[#FF4D6D]/20 border-t-[#FF4D6D] rounded-full animate-spin mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Live Analytics...</p>
            </div>
        );
    }

    // Fallback/Default stats if backend returns empty or different structure
    const displayStats = {
        totalInvitations: stats?.totalInvitations || 0,
        accepted: stats?.accepted || 0,
        openRate: stats?.openRate || 0,
        acceptanceRate: stats?.acceptanceRate || 0
    };

    return (
        <div className="p-10 max-w-[1400px] mx-auto font-plus-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Top Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <StatCard title="Invitations Sent" value={displayStats.totalInvitations.toLocaleString()} trend="up" trendValue="+12%" icon={Mail} color="bg-[#FF4D6D]" />
                <StatCard title="Total &quot;Yes&quot; Hits" value={displayStats.accepted.toLocaleString()} trend="up" trendValue="+8.4%" icon={Heart} color="bg-[#FF8FA3]" />
                <StatCard title="Open Rate" value={`${displayStats.openRate}%`} trend="none" trendValue="0%" icon={Eye} color="bg-[#FFB3C1]" />
                <StatCard title="Acceptance Rate" value={`${displayStats.acceptanceRate}%`} trend="none" trendValue="0%" icon={Clock} color="bg-[#FFC4D1]" />
            </div>

            <div className="grid grid-cols-12 gap-8 mb-10">
                {/* Main Chart */}
                <div className="col-span-12 lg:col-span-8 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 h-[500px] flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Invitations Activity</h2>
                            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Sent vs. Accepted over the last 7 days</p>
                        </div>
                        <div className="flex gap-6 items-center">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-rose-100"></div>
                                <span className="text-xs font-bold text-slate-400">Sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#FF4D6D]"></div>
                                <span className="text-xs font-bold text-slate-400">Accepted</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex gap-2 items-end justify-between px-4 pb-4">
                        <ActivityBar sent={70} accepted={45} label="Mon" />
                        <ActivityBar sent={85} accepted={55} label="Tue" />
                        <ActivityBar sent={60} accepted={35} label="Wed" />
                        <ActivityBar sent={95} accepted={80} label="Thu" />
                        <ActivityBar sent={80} accepted={50} label="Fri" />
                        <ActivityBar sent={55} accepted={25} label="Sat" />
                        <ActivityBar sent={65} accepted={30} label="Sun" />
                    </div>
                </div>

                {/* Donut Chart Side Card */}
                <div className="col-span-12 lg:col-span-4 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8">Device Breakdown</h2>
                    <div className="flex-1 flex flex-col items-center justify-center relative">
                        <div className="relative h-48 w-48 mb-10">
                            <svg className="h-full w-full rotate-[-90deg]">
                                <circle cx="96" cy="96" r="80" fill="none" stroke="#F1F5F9" className="dark:stroke-slate-800" strokeWidth="16" />
                                <circle
                                    cx="96" cy="96" r="80"
                                    fill="none"
                                    stroke="#FF4D6D"
                                    strokeWidth="16"
                                    strokeDasharray="502"
                                    strokeDashoffset="125"
                                    strokeLinecap="round"
                                />
                                <circle
                                    cx="96" cy="96" r="80"
                                    fill="none"
                                    stroke="#FFC4D1"
                                    strokeWidth="16"
                                    strokeDasharray="502"
                                    strokeDashoffset="420"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                <span className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">100%</span>
                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">Total Traffic</span>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            {[
                                { label: 'Mobile', value: '65%', color: 'bg-[#FF4D6D]', icon: Smartphone },
                                { label: 'Desktop', value: '25%', color: 'bg-[#FFC4D1]', icon: Monitor },
                                { label: 'Tablet', value: '10%', color: 'bg-[#F1F5F9]', icon: Tablet }
                            ].map(d => (
                                <div key={d.label} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-2 w-2 rounded-full ${d.color}`}></div>
                                        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-100 transition-colors uppercase tracking-tight">{d.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">{d.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Top Music List */}
                <div className="col-span-12 lg:col-span-7 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Top Carousel Music</h2>
                        <span className="px-3 py-1 bg-rose-50 dark:bg-slate-800 text-[#FF4D6D] rounded-lg text-[10px] font-black uppercase tracking-widest">Most Played</span>
                    </div>
                    <div className="space-y-2">
                        <MusicItem title="L-O-V-E" artist="Nat King Cole" plays={452} />
                        <MusicItem title="Perfect" artist="Ed Sheeran" plays={318} />
                        <MusicItem title="Can't Help Falling in Love" artist="Elvis Presley" plays={287} />
                    </div>
                    <button className="w-full mt-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        View Ranking
                    </button>
                </div>

                {/* Live Feed Feed */}
                <div className="col-span-12 lg:col-span-5 bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8">Live Feed</h2>
                    <div className="space-y-2">
                        {activities.length > 0 ? (
                            activities.map((act) => {
                                const time = new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                let type: 'accepted' | 'sent' | 'opened' = 'sent';
                                if (act.status === 'accepted') type = 'accepted';
                                else if (act.status === 'opened') type = 'opened';

                                return (
                                    <LiveFeedItem
                                        key={act._id}
                                        type={type}
                                        content={
                                            <span>
                                                <span className="font-bold text-slate-800 dark:text-slate-100">{act.recipientName}</span>
                                                {act.status === 'accepted' ? ' accepted your invitation! 💖' :
                                                    act.status === 'opened' ? ' opened the link.' :
                                                        ` invitation was sent to ${act.recipientEmail}`}
                                            </span>
                                        }
                                        time={time}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm">No recent activity yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
