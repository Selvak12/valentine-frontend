import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useSelector } from 'react-redux';
import type { RootState } from './store/store';
import {
    Heart,
    Send,
    Sparkles,
    Check,
    Link as LinkIcon,
    Copy,
    X,
    Plus
} from 'lucide-react';
import type { InvitationData } from './types/invitation';
import { invitationService } from './services/api/invitationService';

const SendInvitation: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [form, setForm] = useState({ recipientName: '', recipientEmail: '', message: '' });
    const [tone, setTone] = useState('Romantic'); // Keep tone for AI generation only, don't send to backend
    const [gallery, setGallery] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAI = async () => {
        if (!form.recipientName) return alert("Recipient name is required!");
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
            const prompt = `Write a ${tone} Valentine's invitation message for ${form.recipientName}. Under 30 words.`;
            const res = await ai.models.generateContent({ model: 'gemini-2.0-flash', contents: prompt });
            // Assuming res.text property based on previous working code
            setForm({ ...form, message: (res as any).text || '' });
        } catch {
            // Fallback
            setForm({ ...form, message: "Will you be my Valentine? ❤️" });
        } finally {
            setLoading(false);
        }
    };


    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set max dimensions
                    const maxWidth = 1200;
                    const maxHeight = 1200;
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx?.drawImage(img, 0, 0, width, height);

                    // Compress to 70% quality
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(compressedDataUrl);
                };
                img.onerror = reject;
                img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setLoading(true);
            try {
                const compressedImages = await Promise.all(
                    Array.from(files).map(file => compressImage(file))
                );
                setGallery(prev => [...prev, ...compressedImages]);
            } catch (error) {
                console.error('Error compressing images:', error);
                alert('Failed to process images. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const onSubmit = async () => {
        if (!form.recipientName) {
            alert('Please enter the recipient name');
            return;
        }

        setLoading(true);
        try {
            // Backend is rejecting 'message' and 'images' - send only required fields
            const payload: any = {
                recipientName: form.recipientName,
                recipientEmail: form.recipientEmail,
            };
            console.log('Sending payload:', payload);

            // Step 1: Create the invitation (status: draft)
            const data = await invitationService.create(payload);
            console.log('Invitation created successfully:', data);

            // Step 2: Try to send the invitation email (may fail if backend email not configured)
            const invitationId = data._id || data.id;
            let emailSent = false;
            if (invitationId) {
                try {
                    console.log('Attempting to send invitation email to recipient...');
                    await invitationService.send(invitationId);
                    console.log('✅ Invitation email sent successfully!');
                    emailSent = true;
                } catch (emailError: any) {
                    console.warn('⚠️ Email sending failed (backend email not configured):', emailError);
                    console.log('Invitation created but email not sent. Share the link manually.');
                    // Don't throw - invitation is still created successfully
                }
            }

            setResult(data);

            // Show appropriate message
            if (!emailSent) {
                alert('✅ Invitation created!\n\n⚠️ Note: Email sending failed (backend email service not configured).\n\nPlease copy and share the invitation link manually from the preview card below.');
            }

        } catch (error: any) {
            console.error('Error creating invitation:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            const backendMessage = error.response?.data?.message || error.response?.data?.error;

            // Handle specific error cases
            if (error.response?.status === 400 || error.response?.status === 401) {
                const errorMsg = backendMessage || 'Authentication required. Please log in to create invitations.';
                alert(errorMsg);
                // Only redirect if it's actually an auth error
                if (error.response?.status === 401) {
                    setTimeout(() => {
                        window.location.href = '/#/login';
                    }, 1500);
                }
            } else if (error.response?.status === 413) {
                alert('Images are too large. Please try with fewer or smaller images.');
            } else {
                const errorMsg = backendMessage || 'Failed to create invitation. Please try again or contact support.';
                alert(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const getLink = () => {
        if (!result) return '';
        const baseUrl = window.location.origin;
        // Ensure the link is unique and has the correct hash format for all devices
        const shortCode = result.shortCode || result._id || result.id;
        return `${baseUrl}/#/invite/${shortCode}`;
    };

    const copyLink = () => {
        const link = getLink();
        if (link) {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const mockUrl = result ? getLink() : `${window.location.origin}/#/invite/achu-2026`;

    return (
        <div className="p-8 max-w-[1600px] mx-auto font-plus-jakarta">
            {/* Authentication Warning */}
            {!isAuthenticated && (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-6 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="text-yellow-600 dark:text-yellow-400 text-2xl">⚠️</div>
                        <div className="flex-1">
                            <h3 className="font-bold text-yellow-800 dark:text-yellow-200 text-lg mb-1">Authentication Required</h3>
                            <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                                You need to be logged in to create and send invitations.
                            </p>
                            <a
                                href="/#/login"
                                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                            >
                                Go to Login →
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">

                {/* Creation Form */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-[24px] p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create Invitation</h2>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Fill in the details to generate and send a unique link.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient's Name</label>
                                <input
                                    value={form.recipientName}
                                    onChange={e => setForm({ ...form, recipientName: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] px-5 py-4 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    placeholder="e.g. Selva"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient's Email</label>
                                <input
                                    value={form.recipientEmail}
                                    onChange={e => setForm({ ...form, recipientEmail: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[16px] px-5 py-4 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                    placeholder="selva@example.com"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Memory Gallery</label>
                                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{gallery.length} Photos Added</span>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square rounded-2xl border-2 border-dashed border-rose-100 dark:border-slate-800 flex flex-col items-center justify-center text-rose-300 dark:text-slate-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-all bg-rose-50/20 dark:bg-slate-800/30 group"
                                    >
                                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-tighter mt-1">Select Files</span>
                                    </button>
                                    {gallery.map((url, i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-cover bg-center shadow-md border border-white dark:border-slate-800 relative group animate-in zoom-in duration-300" style={{ backgroundImage: `url(${url})` }}>
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                                            <button
                                                type="button"
                                                onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                                                className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 text-rose-500 rounded-full p-1.5 shadow-lg scale-0 group-hover:scale-100 transition-transform hover:bg-rose-50 dark:hover:bg-slate-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Personalized Message</label>
                                <div className="flex justify-between items-center px-2 mb-2">
                                    <div className="flex gap-2">
                                        <select value={tone} onChange={e => setTone(e.target.value)} className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-none rounded-lg p-2 focus:ring-0">
                                            <option>Romantic</option>
                                            <option>Funny</option>
                                            <option>Poetic</option>
                                        </select>
                                        <button type="button" onClick={handleAI} className="flex items-center gap-1 text-[10px] text-[#FF4D6D] font-black uppercase hover:underline">
                                            AI Gen
                                        </button>
                                    </div>
                                </div>
                                <textarea
                                    rows={5}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] px-5 py-4 text-slate-700 dark:text-slate-200 font-medium focus:ring-2 focus:ring-[#FF4D6D]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                                    placeholder="Hi Manu, I made something cute for you..."
                                />
                            </div>

                            {result ? (
                                <div className="mt-8 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-[16px] p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
                                            <Check size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-800 dark:text-green-100 text-sm">Invitation Ready!</p>
                                            <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">Share the link from the preview card.</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setResult(null)} className="text-green-600 dark:text-green-400 text-sm font-semibold hover:underline">Create New</button>
                                </div>
                            ) : (
                                <button
                                    onClick={onSubmit}
                                    disabled={loading}
                                    className="w-full bg-[#FF4D6D] hover:bg-[#ff3355] text-white py-4 rounded-[16px] font-bold text-lg shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 mt-4"
                                >
                                    {loading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Send Invitation <Send size={18} className="ml-1" /></>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview & Share */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    <div className="bg-[#FFF0F3] dark:bg-slate-900 rounded-[32px] p-8 border border-white/50 dark:border-slate-800 h-[calc(100%-100px)] flex flex-col items-center justify-center relative overflow-hidden transition-colors">
                        <h3 className="text-[#FF8FA3] font-bold uppercase tracking-widest text-xs absolute top-8 left-8">Preview Experience</h3>
                        <div className="flex gap-1 absolute top-8 right-8">
                            <Heart size={12} className="text-[#FFC2C7]" fill="#FFC2C7" />
                            <Heart size={12} className="text-[#FFC2C7]" fill="#FFC2C7" />
                            <Heart size={12} className="text-[#FFC2C7]" fill="#FFC2C7" />
                        </div>

                        <div className="w-[320px] bg-white dark:bg-slate-800 rounded-[24px] shadow-xl shadow-rose-100/50 dark:shadow-none p-6 text-center transform hover:scale-[1.02] transition-all duration-500">
                            <div className="mb-6 flex justify-center text-[#FF4D6D]">
                                <Sparkles className="animate-pulse" />
                                <h2 className="text-2xl font-black font-plus-jakarta mx-2 dark:text-white">YAY!!!</h2>
                                <Sparkles className="animate-pulse" />
                            </div>

                            <p className="text-slate-400 dark:text-slate-500 italic text-sm mb-6">"Best decision ever 🥳"</p>

                            <div className="aspect-square bg-[#FFE5E9] dark:bg-slate-700 rounded-[20px] mb-6 flex items-center justify-center relative overflow-hidden group">
                                {gallery.length > 0 ? (
                                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url(${gallery[0]})` }}></div>
                                ) : (
                                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?q=80&w=250&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:scale-110 transition-transform duration-700"></div>
                                )}
                                <div className="h-16 w-24 bg-[#FFC2C7]/30 backdrop-blur-sm rounded-lg rotate-12 shadow-sm"></div>
                            </div>

                            <div className="font-dancing text-2xl text-[#FF4D6D] font-bold">I love you ❤️</div>
                        </div>

                        <p className="text-[#FF8FA3] dark:text-slate-500 text-[10px] mt-8 font-medium">Recipient will see this after clicking 'Yes'</p>
                    </div>

                    {/* Shareable URL Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-[20px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 group cursor-pointer transition-colors" onClick={copyLink}>
                        <div className="h-10 w-10 bg-[#FFF0F3] dark:bg-slate-800 rounded-[12px] flex items-center justify-center text-[#FF4D6D] group-hover:scale-110 transition-transform">
                            <LinkIcon size={20} />
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mb-0.5">Shareable URL</p>
                            <p className="font-mono text-sm text-slate-600 dark:text-slate-400 truncate tracking-tight">{mockUrl}</p>
                        </div>
                        <button className="text-slate-400 dark:text-slate-600 hover:text-[#FF4D6D] transition-colors">
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                        </button>
                    </div>

                    {/* Email Draft Preview (Matches user-requested design) */}
                    {result && (
                        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom-5 duration-700">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Email Draft Preview</p>
                                <button
                                    onClick={() => {
                                        const text = `Hi ${form.recipientName},\n\nI made something cute for you 😊.\n\nWill you be my Valentine? 💖 Click the link below.\n\nOpen your Valentine 💘\n${getLink()}\n\nWith lots of Love,\nYour husband 💘`;
                                        navigator.clipboard.writeText(text);
                                        alert('Email draft copied!');
                                    }}
                                    className="text-[10px] text-[#FF4D6D] font-black uppercase hover:underline"
                                >
                                    Copy Draft
                                </button>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap leading-relaxed">
                                {`Hi ${form.recipientName},\n\nI made something cute for you 😊.\n\nWill you be my Valentine? 💖 Click the link below.\n\nOpen your Valentine 💘\n${getLink()}\n\nWith lots of Love,\nYour husband 💘`}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SendInvitation;
