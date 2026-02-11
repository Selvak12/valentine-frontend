import React from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { login } from './store/slices/authSlice';
import type { LoginFormData } from './schemas/auth';
import { loginSchema } from './schemas/auth';
import type { RootState, AppDispatch } from './store/store';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/overview'); // Redirect to overview page after successful login
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data: LoginFormData) => {
        await dispatch(login(data));
    };

    return (
        <div className="h-screen bg-[#FFF8FA] dark:bg-slate-950 flex items-center justify-center p-4 font-plus-jakarta relative overflow-hidden transition-colors">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 dark:bg-rose-900/10 rounded-full blur-[120px] opacity-50 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-100 dark:bg-rose-900/10 rounded-full blur-[120px] opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-[32px] shadow-[0_20px_70px_rgba(255,77,109,0.08)] dark:shadow-none border border-rose-50/50 dark:border-slate-800 p-8 md:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-700 transition-colors">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex-1 text-center pb-3 border-b-2 border-[#FF4D6D]">
                        <span className="text-[#FF4D6D] font-black text-sm uppercase tracking-widest cursor-default">Login</span>
                    </div>
                    <Link to="/register" className="flex-1 text-center pb-3 border-b-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                        <span className="text-slate-400 dark:text-slate-500 font-bold text-sm uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Register</span>
                    </Link>
                </div>

                <div className="flex flex-col items-center mb-6 text-center">
                    <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight mb-1">Welcome Back</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-medium text-[11px] px-2">Sign in to manage your special Valentine invitations</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="email"
                                {...register('email')}
                                placeholder="name@example.com"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-4 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center pl-1">
                            <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Password</label>
                            <Link to="/forgot-password" className="text-[#FF4D6D] text-[11px] font-black hover:underline tracking-tight">Forgot Password?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#FF4D6D] transition-colors" size={18} />
                            <input
                                type="password"
                                {...register('password')}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] pl-12 pr-4 py-4 text-sm text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 pl-1">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-rose-100 dark:border-slate-700 bg-white dark:bg-slate-800 text-[#FF4D6D] focus:ring-[#FF4D6D]/20 cursor-pointer" />
                        <label htmlFor="remember" className="text-slate-500 dark:text-slate-400 text-xs font-bold cursor-pointer select-none">Remember Me</label>
                    </div>

                    {error && <p className="text-red-500 text-center text-xs">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-[#FF4D6D] text-white rounded-[16px] py-4 font-black text-base shadow-lg shadow-rose-200 dark:shadow-none hover:bg-[#ff3355] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        disabled={loading}
                    >
                        <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>


            </div>
        </div>
    );
};

export default Login;
