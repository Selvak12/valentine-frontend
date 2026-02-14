import React from 'react';
import {
    Search,
    Download,
    Plus,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { invitationService } from './services/api/invitationService';

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
    const [search, setSearch] = React.useState('');
    const [data, setData] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [pagination, setPagination] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchRecipients = async () => {
            setLoading(true);
            try {
                const res = await invitationService.getAll({ searchQuery: search });
                setData(res.data);
                setPagination(res.pagination);
            } catch (error) {
                console.error("Failed to fetch recipients:", error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(fetchRecipients, 500);
        return () => clearTimeout(debounce);
    }, [search]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRandomColor = (name: string) => {
        const colors = [
            'bg-rose-50 text-rose-400',
            'bg-blue-50 text-blue-400',
            'bg-amber-50 text-amber-400',
            'bg-green-50 text-green-400',
            'bg-purple-50 text-purple-400'
        ];
        // Simple deterministic color based on name
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div className="p-10 max-w-[1400px] mx-auto font-plus-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between">
                <div className="relative w-full md:w-[400px]">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[18px] pl-12 pr-5 py-4 text-sm focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none shadow-sm transition-all text-slate-800 dark:text-slate-100"
                    />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[18px] text-slate-600 dark:text-slate-400 font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button onClick={() => window.location.href = '/#/'} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-[#FF4D6D] text-white rounded-[18px] font-bold text-sm shadow-lg shadow-rose-200 hover:bg-[#ff3355] transition-all">
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
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <div className="h-8 w-8 border-2 border-[#FF4D6D]/20 border-t-[#FF4D6D] rounded-full animate-spin"></div>
                        </div>
                    ) : data.length > 0 ? (
                        data.map((row) => (
                            <RecipientRow
                                key={row._id}
                                name={row.recipientName}
                                email={row.recipientEmail}
                                status={(row.status.charAt(0).toUpperCase() + row.status.slice(1)) as 'Accepted' | 'Opened' | 'Sent'}

                                dateSent={new Date(row.createdAt).toLocaleDateString()}
                                initials={getInitials(row.recipientName)}
                                color={getRandomColor(row.recipientName)}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-slate-400">
                            No recipients found.
                        </div>
                    )}
                </div>

                {/* Footer/Pagination Info */}
                <div className="p-8 flex flex-col md:flex-row items-center justify-between border-t border-rose-50/30 dark:border-slate-800 gap-4">
                    <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                        Showing {data.length} of {pagination?.total || data.length} recipients
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><ChevronLeft size={18} /></button>
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FF4D6D] text-white font-bold text-sm shadow-md shadow-rose-100 transition-all">1</button>
                        {pagination?.totalPages > 1 && (
                            <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">2</button>
                        )}
                        <button className="h-10 w-10 flex items-center justify-center rounded-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"><ChevronRight size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Recipiants;
