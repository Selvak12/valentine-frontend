import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useParams, useLocation, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  Send,
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
  User as UserIcon,
  Moon,
  LogOut,
  ChevronDown,
  ChevronDown as ArrowDown,
  ChevronLeft,
  ChevronRight,
  Music,
  Play,
  Sun
} from 'lucide-react';
import type { Recipient } from './types';
import { invitationService } from './services/api/invitationService';
import { trackingService } from './services/api/trackingService'; // Import trackingService
import SendInvitation from './Sendinvitation';
import Overview from './Overview';
import Recipiants from './Recipiants';
import Analytics from './Analytics';
import Login from './Login';
import Register from './Register'; // Import the new Register component
import ProfileView from './ProfileView';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import { logout } from './store/slices/authSlice'; // Import logout action
import type { RootState, AppDispatch } from './store/store';

const Sidebar: React.FC<{ darkMode: boolean; toggleDark: () => void }> = ({ darkMode, toggleDark }) => {
  const loc = useLocation();
  const navs = [
    { path: '/', label: 'Send Invitation', icon: Send, highlight: true }, // Changed to / for default landing
    { path: '/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/recipients', label: 'Recipients', icon: Users },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 }, // Corrected path to /analytics
  ];

  return (
    <aside className="w-64 bg-pink-600 dark:bg-slate-900 border-r border-pink-300 dark:border-slate-800 flex flex-col h-screen sticky top-0 font-plus-jakarta transition-colors">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 bg-[#FF4D6D] rounded-[14px] flex items-center justify-center text-white ">
          <Heart fill="white" size={20} />
        </div>
        <span className="font-bold text-xl text-white transition-colors">Val-Admin</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navs.map(n => (
          <Link
            key={n.path}
            to={n.path}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-[15px] ${n.highlight
              ? 'bg-white text-pink-600'
              : loc.pathname === n.path
                ? 'bg-pink-500 text-white'
                : 'text-pink-100 hover:bg-pink-500 hover:text-white'
              }`}
          >
            <n.icon size={20} strokeWidth={2} />
            <span>{n.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={toggleDark}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-medium text-sm ${darkMode
            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            : 'bg-white border-pink-200 text-pink-600 hover:bg-pink-50'
            }`}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
};

const Header: React.FC = () => {
  const loc = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const getHeaderInfo = () => {
    switch (loc.pathname) {
      case '/overview':
        return { title: 'DASHBOARD OVERVIEW', subtitle: 'Real-time engagement stats' };
      case '/recipients':
        return { title: 'RECIPIENTS', subtitle: 'Manage your special list' };
      case '/analytics': // Corrected path
        return { title: 'ANALYTICS', subtitle: 'Deep dive into performance' };
      case '/profile':
        return { title: 'MY PROFILE', subtitle: 'Manage your account settings' };
      case '/': // Default for Send Invitation
        return { title: 'New Invitation', subtitle: 'Send a personalized web experience to someone special' };
      default:
        return { title: 'Dashboard', subtitle: 'Welcome to your Val-Admin' };
    }
  };
  const { title, subtitle } = getHeaderInfo();

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <header className="px-8 py-5 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-gray-50/50 dark:border-slate-800 sticky top-0 z-50 w-full transition-colors">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 font-plus-jakarta tracking-tight">{title}</h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4 relative">
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF4D6D] rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
          >
            <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-400 overflow-hidden relative">
              <UserIcon size={18} />
              <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/100?u=valadmin')] bg-cover"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-[13px] font-black text-slate-800 dark:text-slate-100 leading-tight">{user?.name || user?.email || 'Admin User'}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">{user?.role || 'Premium'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 transition-transform duration-300" style={{ transform: showDropdown ? 'rotate(180deg)' : '' }} />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 dark:border-slate-700 py-3 z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                <div className="px-5 py-3 mb-2 border-b border-slate-50 dark:border-slate-700">
                  <p className="text-[11px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">Account</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-5 py-3 text-slate-600 dark:text-slate-300 hover:text-[#FF4D6D] hover:bg-rose-50 dark:hover:bg-slate-700 transition-all font-bold text-sm"
                >
                  <UserIcon size={18} />
                  My Profile
                </Link>
                <div className="h-px bg-slate-50 dark:bg-slate-700 my-2 mx-5"></div>
                <button
                  onClick={handleLogout} // Use the new handleLogout function
                  className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 dark:text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700 transition-all font-bold text-sm text-left"
                >
                  <LogOut size={18} />
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const ConfettiBurst: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
    {[...Array(60)].map((_, i) => (
      <div key={i} className="absolute animate-ping bg-rose-400 rounded-full" style={{
        width: Math.random() * 15 + 5 + 'px',
        height: Math.random() * 15 + 5 + 'px',
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        animationDuration: Math.random() * 3 + 1 + 's',
        opacity: Math.random(),
        backgroundColor: ['#f43f5e', '#ec4899', '#fb7185', '#d946ef'][Math.floor(Math.random() * 4)]
      }} />
    ))}
  </div>
);

const ExperienceView: React.FC = () => {
  const { id } = useParams();
  const [inv, setInv] = useState<Recipient | null>(null);
  const [stage, setStage] = useState<'envelope' | 'ask' | 'accepted' | 'surprise_ready' | 'surprise_reveal'>('envelope');
  const [typedMessage, setTypedMessage] = useState('');
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [noSize, setNoSize] = useState(1);
  const [noCount, setNoCount] = useState(0);
  const [showSurprisePrompt, setShowSurprisePrompt] = useState(false);
  const [loading, setLoading] = useState(true);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (id) {
      invitationService.getByShortCode(id).then(d => {
        if (d) {
          setInv(d as any);
          // Don't update status - invitation is already created
          if (d._id) {
            trackingService.recordPageView({ invitationId: d._id, shortCode: id }); // Record page view
          }
        }
        setLoading(false);
      }).catch(err => {
        console.error('Failed to load invitation:', err);
        setLoading(false);
      });
    }
  }, [id]);

  useEffect(() => {
    if (stage === 'ask' && inv?.message) {
      let i = 0;
      const timer = setInterval(() => {
        setTypedMessage(inv.message!.slice(0, i));
        i++;
        if (i > inv.message!.length) clearInterval(timer);
      }, 50);
      return () => clearInterval(timer);
    }
  }, [stage, inv]);

  useEffect(() => {
    if (stage === 'accepted') {
      const timer = setTimeout(() => {
        setShowSurprisePrompt(true);
      }, 10000); // 10 seconds delay
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'surprise_reveal' && inv?.images && inv.images.length > 2) {
      const carouselImages = inv.images.slice(2);
      const timer = setInterval(() => {
        setCarouselIndex((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [stage, inv]);

  useEffect(() => {
    if (stage === 'surprise_reveal') {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(e => console.log("Audio playback failed:", e));
    }
    return () => {
      if (stage === 'surprise_reveal' && audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [stage]);

  const handleNo = () => {
    setNoCount(prev => prev + 1);

    // Calculate random position within viewport
    const x = Math.random() * (window.innerWidth - 150);
    const y = Math.random() * (window.innerHeight - 100);

    setNoPos({ x, y });
    setNoSize(s => Math.max(0.6, s - 0.05));
  };

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure? 🤨",
      "Really sure? 🥺",
      "Think again! 😭",
      "Last chance! 💔",
      "Surely not? 😢",
      "You're breaking my heart 😭",
      "Please no 🥺",
      "Don't do this to me... 😔",
      "I'm gonna cry... 😭",
      "Okay, I'll stop... 😔",
      "Just kidding, say YES! ❤️"
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  if (loading) return <div className="min-h-screen bg-rose-50 flex items-center justify-center"><span className="animate-spin material-symbols-rounded text-rose-500 text-6xl">favorite</span></div>;
  if (!inv) return <div className="min-h-screen bg-rose-50 flex items-center justify-center p-10"><h2 className="text-3xl font-bold text-rose-300">Invitation not found.</h2></div>;

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center p-6 relative overflow-hidden font-quicksand">
      {/* Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-[10%] left-[15%] text-pink-200 opacity-40" size={48} />
        <Heart className="absolute top-[20%] right-[20%] text-pink-300 opacity-30" size={40} />
        <Heart className="absolute bottom-[15%] left-[10%] text-pink-200 opacity-35" size={44} />
        <Heart className="absolute bottom-[25%] right-[15%] text-pink-300 opacity-25" size={36} />
      </div>

      {stage === 'accepted' && <ConfettiBurst />}

      {stage === 'envelope' && (
        <div className="cursor-pointer group perspective-1000" onClick={() => setStage('ask')}>
          <div className="relative w-80 h-56 bg-white rounded-xl shadow-2xl transition-transform duration-700 group-hover:rotate-3 flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-100 rounded-xl"></div>
            <div className="text-7xl group-hover:scale-110 transition-transform">💌</div>
            <div className="absolute bottom-4 text-xs font-black text-rose-300 uppercase tracking-widest">Click to Open</div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-rose-500 rounded-xl -z-10 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        </div>
      )}

      {stage === 'ask' && (
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-[0_40px_100px_rgba(244,63,94,0.15)] text-center animate-in zoom-in-95 duration-1000 relative">
          {/* Cute Avatar with Heart Badge */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center shadow-lg">
                <div className="text-6xl">😺</div>
              </div>
              <div className="absolute -top-1 -right-1 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-lg">
                <Heart fill="white" color="white" size={20} />
              </div>
            </div>
          </div>

          {/* Main Question */}
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2 leading-tight">
            {inv.recipientName}, will you be my Valentine? 💖💞
          </h2>

          {/* Subtitle Message */}
          <p className="text-slate-400 text-xs mb-10 font-medium">
            Choose wisely. (The "No" button is... shy.)
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-4">
            <button
              onClick={() => {
                if (inv?._id) {
                  trackingService.recordAcceptance({ invitationId: inv._id, shortCode: id || '' });
                }
                setStage('accepted');
              }}
              style={{ transform: `scale(${1 + noCount * 0.1})` }}
              className="bg-[#E94D58] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all"
            >
              YES
            </button>

            <button
              onClick={handleNo}
              onMouseEnter={handleNo}
              style={{
                position: noPos.x !== 0 ? 'fixed' : 'relative',
                left: noPos.x !== 0 ? noPos.x : 'auto',
                top: noPos.y !== 0 ? noPos.y : 'auto',
                zIndex: 100,
                transition: 'all 0.2s ease-out'
              }}
              className="bg-slate-50 text-slate-400 px-6 py-2 rounded-xl font-medium text-sm border border-slate-100 shadow-sm transition-all"
            >
              {getNoButtonText()}
            </button>
          </div>
        </div>
      )}

      {stage === 'accepted' && (
        <div className="max-w-xl w-full bg-white rounded-[4rem] p-12 md:p-16 shadow-[0_60px_200px_rgba(244,63,94,0.2)] text-center animate-in zoom-in-50 duration-1000">
          {/* Heading */}
          <h2 className="text-5xl md:text-6xl font-black text-slate-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-rose-500">💖</span> YAY!!! <span className="text-rose-500">💖</span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-600 text-xl font-medium mb-10">
            Best decision ever 😋
          </p>

          {/* Couple Animation/Sticker */}
          <div className="flex justify-center mb-8">
            <div className="relative p-4 bg-white rounded-3xl shadow-lg border border-rose-50 overflow-hidden">
              <img
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmo4dWRtODU0eTRrdm96N3N2NWFyZzFnbG9qN2N6N3N2NWFyZzFnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/Y8S5mS6XfFp1S/giphy.gif"
                className="h-64 md:h-80 w-auto rounded-2xl mx-auto"
                alt="Cute Couple"
              />
            </div>
          </div>

          {/* Bottom Message */}
          <p className="text-slate-500 text-lg font-bold">
            I love you ❤️
          </p>

          {/* New Surprise Prompt (appears after 10s) */}
          {showSurprisePrompt && (
            <div className="mt-12 pt-8 border-t border-rose-50 animate-in slide-in-from-bottom-10 duration-[2000ms]">
              <h2 className="text-4xl font-black text-slate-800 mb-2">hey {inv.recipientName}</h2>
              <p className="text-2xl font-pacifico text-rose-500 mb-8">Another surprise for you...</p>
              <button
                onClick={() => {
                  setStage('surprise_reveal');
                  // Ensure music starts on interaction if needed, though the useEffect handles it
                }}
                className="h-20 w-20 bg-white shadow-2xl rounded-full flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all mx-auto border-4 border-rose-100"
              >
                <ArrowDown size={40} className="animate-bounce" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Removed separate surprise_ready stage as it's now integrated into accepted stage */}

      {stage === 'surprise_reveal' && (
        <div className="max-w-4xl w-full text-center animate-in slide-in-from-bottom-20 duration-1000">
          <h2 className="text-6xl font-pacifico text-rose-500 mb-12 drop-shadow-lg">Our Story So Far</h2>
          {inv.images && inv.images.length > 2 ? (
            <div className="relative group mx-auto max-w-2xl px-4">
              <div className="relative h-[500px] w-full group overflow-hidden rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-[12px] border-white">
                {inv.images.slice(2).map((img, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${idx === carouselIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                      }`}
                    style={{ backgroundImage: `url(${img})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>
                ))}

                {/* Navigation Arrows */}
                {inv.images.slice(2).length > 1 && (
                  <>
                    <button
                      onClick={() => setCarouselIndex((prev) => (prev - 1 + (inv.images!.length - 2)) % (inv.images!.length - 2))}
                      className="absolute left-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={() => setCarouselIndex((prev) => (prev + 1) % (inv.images!.length - 2))}
                      className="absolute right-6 top-1/2 -translate-y-1/2 h-12 w-12 bg-white/30 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/50"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div className="absolute bottom-8 left-10 text-white text-left">
                  <p className="text-3xl font-pacifico">Cherishing every moment...</p>
                </div>
              </div>

              {/* Music Player Indicator */}
              <div className="mt-12 flex items-center justify-center gap-6">
                <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-full shadow-xl flex items-center gap-4 border border-rose-50">
                  <div className="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-slate-600 tracking-tight">Playing: {inv.name}'s Favorite Song.mp3</span>
                  <Music size={18} className="text-rose-400 animate-spin-slow" />
                </div>
                <button
                  onClick={() => {
                    if (audioRef.current?.paused) audioRef.current.play();
                    else audioRef.current?.pause();
                  }}
                  className="h-14 w-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center hover:bg-rose-100 transition-all border-2 border-white shadow-lg"
                >
                  <Play fill="currentColor" size={24} />
                </button>
              </div>

              {/* Indicators */}
              <div className="mt-12 flex justify-center gap-3">
                {inv.images.slice(2).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${i === carouselIndex ? 'bg-rose-500 w-10' : 'bg-rose-200 w-2 hover:bg-rose-300'
                      }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-slate-400 italic">Add more photos to see our story...</div>
          )}
        </div>
      )}
    </div>
  );
};

// New AdminLayout component to reduce duplication
const AdminLayout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="flex min-h-screen bg-[#FFF8FA] dark:bg-slate-950 font-plus-jakarta transition-colors">
        <Sidebar darkMode={darkMode} toggleDark={() => setDarkMode(!darkMode)} />
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto bg-[#FFF8FA] dark:bg-slate-950 transition-colors">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* New Register Route */}
        <Route path="/invite/:id" element={<ExperienceView />} />

        {/* Protected Admin Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<SendInvitation />} /> {/* Default route after login */}
            <Route path="/overview" element={<Overview />} />
            <Route path="/recipients" element={<Recipiants />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<ProfileView />} />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
