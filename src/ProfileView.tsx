import React, { useState } from 'react';
import { User, Mail, Camera, Save, X, LogOut } from 'lucide-react';

interface UserProfile {
    name: string;
    email: string;
    bio: string;
    avatarUrl: string;
    role: string;
}

const ProfileView: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({
        name: 'Admin User',
        email: 'admin@valadmin.com',
        bio: 'Professional spreading love and happiness through digital invitations. ❤️',
        avatarUrl: 'https://i.pravatar.cc/150?u=valadmin',
        role: 'Premium Plan'
    });

    const [tempProfile, setTempProfile] = useState<UserProfile>(profile);

    const handleSave = () => {
        setProfile(tempProfile);
        setIsEditing(false);
        // In a real app, you would call an API here
        console.log('Profile updated:', tempProfile);
    };

    const handleCancel = () => {
        setTempProfile(profile);
        setIsEditing(false);
    };

    return (
        <div className="p-10 max-w-[1000px] mx-auto font-plus-jakarta animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">MY PROFILE</h1>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your account settings</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#FF4D6D] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-[#ff3355] transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Profile Card */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col items-center text-center transition-colors">
                        <div className="relative mb-6 group">
                            <div className="h-32 w-32 rounded-[40px] overflow-hidden border-4 border-rose-50 dark:border-slate-800 ring-4 ring-white dark:ring-slate-900 shadow-xl relative transition-all">
                                <img src={tempProfile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <Camera className="text-white" size={24} />
                                    </div>
                                )}
                            </div>
                            {isEditing && (
                                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 h-10 w-10 rounded-full shadow-lg flex items-center justify-center text-[#FF4D6D] border border-rose-50 dark:border-slate-700">
                                    <Camera size={18} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{profile.name}</h2>
                        <span className="px-3 py-1 bg-rose-50 dark:bg-slate-800 text-[#FF4D6D] rounded-lg text-[10px] font-black uppercase tracking-widest mt-2">
                            {profile.role}
                        </span>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mt-4 leading-relaxed font-medium">{profile.bio}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 shadow-sm border border-slate-50 dark:border-slate-800 transition-colors">
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">Account Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-medium">Joined Date</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">Feb 14, 2024</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 dark:text-slate-500 font-medium">Invites Sent</span>
                                <span className="text-slate-800 dark:text-slate-200 font-bold">1,284</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="col-span-12 lg:col-span-8">
                    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 shadow-sm border border-slate-50 dark:border-slate-800 h-full transition-colors">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-[#FF4D6D]"></div>
                            Personal Information
                        </h3>

                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#FF4D6D]' : 'text-slate-300'}`} size={18} />
                                        <input
                                            type="text"
                                            disabled={!isEditing}
                                            value={tempProfile.name}
                                            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all disabled:opacity-70 dark:disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#FF4D6D]' : 'text-slate-300'}`} size={18} />
                                        <input
                                            type="email"
                                            disabled={!isEditing}
                                            value={tempProfile.email}
                                            onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl pl-14 pr-6 py-4 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all disabled:opacity-70 dark:disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Bio</label>
                                <textarea
                                    disabled={!isEditing}
                                    value={tempProfile.bio}
                                    onChange={(e) => setTempProfile({ ...tempProfile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl px-6 py-4 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all disabled:opacity-70 dark:disabled:opacity-50 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Avatar URL</label>
                                <input
                                    type="text"
                                    disabled={!isEditing}
                                    value={tempProfile.avatarUrl}
                                    onChange={(e) => setTempProfile({ ...tempProfile, avatarUrl: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all disabled:opacity-70 dark:disabled:opacity-50"
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-4 pt-6 animate-in slide-in-from-top-2 duration-300">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 bg-[#FF4D6D] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-rose-200 hover:bg-[#ff3355] transition-all"
                                    >
                                        <Save size={20} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                    >
                                        <X size={20} />
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800">
                                <button className="flex items-center gap-3 text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors font-bold text-sm uppercase tracking-tight">
                                    <LogOut size={18} />
                                    Sign out from this device
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
