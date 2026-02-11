import React from 'react';
import { Mail, Lock, ArrowRight, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerUser } from './store/slices/authSlice'; // Renamed to avoid conflict with react-hook-form register
import type { RegisterFormData } from './schemas/auth';
import { registerSchema } from './schemas/auth';
import type { RootState, AppDispatch } from './store/store';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/overview'); // Redirect to overview page after successful registration
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: RegisterFormData) => {
        await dispatch(registerUser(data));
    };

    return (
        <div className="h-screen bg-[#FFF8FA] dark:bg-slate-950 flex items-center justify-center p-4 font-plus-jakarta relative overflow-hidden transition-colors">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 dark:bg-rose-900/10 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100 dark:bg-rose-900/10 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_70px_rgba(255,77,109,0.08)] dark:shadow-none border border-rose-50/50 dark:border-slate-800 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-700 transition-colors">

                <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800">
                    <Link to="/login" className="flex-1 text-center pb-3 border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Login</span>
                    </Link>
                    <div className="flex-1 text-center pb-3 border-b-2 border-[#FF4D6D]">
                        <span className="text-[#FF4D6D] font-black text-sm uppercase tracking-widest cursor-default">Register</span>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-6 text-center">
                    <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">Create Account</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-medium text-[11px] px-2">Get started with your special Valentine invitations</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Name (Optional)</label>
                        <div className="relative group">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="text"
                                {...register('name')}
                                placeholder="John Doe"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.name && <p className="text-red-500 text-xs italic mt-0.5">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs italic mt-0.5">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs italic mt-0.5">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Confirm Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="password"
                                {...register('confirmPassword')}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-xs italic mt-0.5">{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <p className="text-red-500 text-center text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#FF4D6D] text-white rounded-[16px] py-4 font-black text-base shadow-lg shadow-rose-200 dark:shadow-none hover:bg-[#ff3355] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group mt-2"
                        disabled={loading}
                    >
                        <span>{loading ? 'Registering...' : 'Create Account'}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>


            </div>
        </div>
    );
};

export default Register;