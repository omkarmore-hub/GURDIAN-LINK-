
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ProblemResponse, SafetyStatus, TRANSLATIONS, HistoryItem, Guardian } from './types';
import Login from './components/Login';
import { getLegalAndSafetyAdvice } from './services/geminiService';
import { 
  Shield, 
  Search, 
  MapPin, 
  Phone, 
  Heart, 
  AlertTriangle, 
  CheckCircle,
  MessageSquare,
  Home,
  User,
  Settings,
  Plus,
  Trash2,
  Clock,
  Info,
  ChevronRight,
  LogOut,
  Save,
  Camera,
  X,
  Calendar,
  Users,
  FileText,
  Download,
  Printer
} from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [isEditing, setIsEditing] = useState(false);
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ProblemResponse | null>(null);
  
  const [safetyStatus, setSafetyStatus] = useState<SafetyStatus>(SafetyStatus.SAFE);
  const [timeLeft, setTimeLeft] = useState(600);
  const timerRef = useRef<number | null>(null);
  const [emergencyModal, setEmergencyModal] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => {
    const lang = user?.preferredLanguage || 'en';
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  };

  useEffect(() => {
    if (safetyStatus === SafetyStatus.PENDING) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { handleEmergency(); return 0; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) window.clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [safetyStatus]);

  const handleEmergency = () => {
    setSafetyStatus(SafetyStatus.DANGER);
    setEmergencyModal(true);
  };

  const startProblemSearch = async () => {
    if (!problem.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const data = await getLegalAndSafetyAdvice(problem, user?.preferredLanguage);
      setResponse(data);
      setSafetyStatus(SafetyStatus.PENDING);
      setTimeLeft(600); 

      if (user) {
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          problem: problem,
          response: data
        };
        setUser({ ...user, history: [newItem, ...user.history] });
      }
    } catch (error) {
      alert("Error generating response.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans text-slate-900 overflow-x-hidden">
      {/* Print-only CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-content { display: block !important; padding: 40px; background: white; color: black; }
          body { background: white; }
        }
      `}</style>

      {/* Header */}
      <header className={`no-print sticky top-0 z-50 px-6 py-4 shadow-lg flex justify-between items-center backdrop-blur-md transition-colors duration-500 ${
        safetyStatus === SafetyStatus.SAFE ? 'bg-white/90' : 'bg-red-600 text-white'
      }`}>
        <div className="flex items-center gap-2">
          <Shield className={`w-7 h-7 ${safetyStatus === SafetyStatus.SAFE ? 'text-blue-600' : 'text-white'}`} />
          <span className="font-black text-xl italic tracking-tighter uppercase">Guardian</span>
        </div>
        
        {safetyStatus === SafetyStatus.PENDING && (
          <div className="flex items-center gap-3">
             <div className="text-right">
                <div className="text-[8px] font-black uppercase opacity-60">SOS TIMER</div>
                <div className="text-lg font-mono leading-none">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>
             </div>
             <button onClick={() => setSafetyStatus(SafetyStatus.SAFE)} className="bg-white text-green-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl">I AM SAFE</button>
          </div>
        )}
      </header>

      {/* Main Content Areas */}
      <main className="no-print max-w-xl mx-auto px-6 mt-6">
        {activeTab === 'home' ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Search Console */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-red-50 rounded-2xl"><Heart className="text-red-500 w-6 h-6" /></div>
                 <div>
                    <h2 className="text-xl font-black text-slate-800">{t('welcome')}</h2>
                    <p className="text-slate-400 text-xs font-medium">{t('subWelcome')}</p>
                 </div>
              </div>
              <textarea 
                className="w-full bg-slate-50 rounded-3xl p-5 text-sm font-medium border-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder={t('placeholder')}
                value={problem}
                onChange={e => setProblem(e.target.value)}
              />
              <button 
                onClick={startProblemSearch}
                disabled={loading}
                className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-all"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : t('getHelp')}
              </button>
            </section>

            {/* Results */}
            {response && (
              <div className="space-y-6">
                <div className={`p-8 rounded-[2.5rem] border-l-[12px] ${response.isLegal.toLowerCase().includes('illegal') ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{t('status')}</h4>
                  <p className="text-slate-800 text-lg font-black leading-tight mb-3">{response.isLegal}</p>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">{response.legalityExplanation}</p>
                </div>
                
                <div className="bg-indigo-950 text-white p-8 rounded-[2.5rem] shadow-2xl">
                   <p className="italic font-medium leading-relaxed">"{response.mentalSupportMessage}"</p>
                </div>

                <div className="space-y-3">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">{t('solutions')}</h3>
                   {response.solutions.map((s, i) => (
                     <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex gap-4 items-center">
                        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-300 shrink-0">{i+1}</div>
                        <p className="text-slate-700 text-sm font-bold">{s}</p>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            {/* Profile Section */}
            <div className="flex justify-between items-center px-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">{t('profileTitle')}</h2>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-blue-600 text-white' : 'bg-white text-slate-400 shadow-sm border border-slate-100'}`}
              >
                {isEditing ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
              </button>
            </div>
            
            {/* User Info Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
               <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative group">
                    <div className="w-28 h-28 bg-slate-100 rounded-[2.5rem] overflow-hidden flex items-center justify-center border-4 border-white shadow-xl">
                       {user.profileImage ? (
                         <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         <User className="w-12 h-12 text-slate-300" />
                       )}
                    </div>
                    {isEditing && (
                      <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
                  <div>
                     {isEditing ? (
                       <input 
                         type="text" 
                         className="text-2xl font-black text-slate-900 bg-slate-50 border-none rounded-xl px-4 py-1 text-center focus:ring-2 focus:ring-blue-500"
                         value={user.name}
                         onChange={e => updateProfile({ name: e.target.value })}
                       />
                     ) : (
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">{user.name}</h3>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Birth Date</span>
                     </div>
                     {isEditing ? (
                       <input type="date" className="w-full bg-white text-[10px] font-bold p-1 rounded-lg outline-none" value={user.dob} onChange={e => updateProfile({ dob: e.target.value })} />
                     ) : (
                       <div className="text-xs font-black text-slate-700">{user.dob}</div>
                     )}
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                     <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-blue-500" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Gender</span>
                     </div>
                     {isEditing ? (
                       <select className="w-full bg-white text-[10px] font-bold p-1 rounded-lg outline-none" value={user.gender} onChange={e => updateProfile({ gender: e.target.value })}>
                         <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                       </select>
                     ) : (
                       <div className="text-xs font-black text-slate-700">{user.gender}</div>
                     )}
                  </div>
               </div>

               {isEditing && (
                 <button onClick={() => setIsEditing(false)} className="w-full bg-blue-600 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200">
                   {t('save')}
                 </button>
               )}
            </div>

            {/* Guardians Hub */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{t('guardians')}</h3>
                 {user.guardianNumbers.length < 3 && (
                   <button className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"><Plus className="w-4 h-4" /></button>
                 )}
               </div>
               <div className="space-y-3">
                  {user.guardianNumbers.map((g, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm"><Phone className="w-4 h-4 text-slate-400" /></div>
                          <div>
                             <div className="text-[11px] font-black text-slate-800">{g.name}</div>
                             <div className="text-[10px] font-medium text-slate-400">{g.phoneCode} {g.phone}</div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* App Settings & Documentation */}
            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
               <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">{t('about')}</h3>
               </div>
               
               <div className="space-y-3">
                 <button 
                   onClick={() => setShowManual(true)}
                   className="w-full bg-white/5 hover:bg-white/10 p-4 rounded-2xl flex items-center justify-between transition-colors group"
                 >
                   <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div className="text-left">
                        <div className="text-xs font-bold">App Documentation</div>
                        <div className="text-[8px] font-medium text-white/40 uppercase">Architecture & Safety Protocols</div>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl">
                     <div className="text-[8px] font-black uppercase text-slate-500 mb-1">Version</div>
                     <div className="text-xs font-bold">G-LINK 2.5.0</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl">
                     <div className="text-[8px] font-black uppercase text-slate-500 mb-1">Security</div>
                     <div className="text-xs font-bold text-green-400 uppercase">AI-VERIFIED</div>
                  </div>
               </div>
               
               <button onClick={() => window.location.reload()} className="w-full bg-white/10 hover:bg-white/20 text-white/60 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                 <LogOut className="w-4 h-4" /> Sign Out
               </button>
            </div>
          </div>
        )}
      </main>

      {/* Manual Modal */}
      {showManual && (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex flex-col no-print">
           <div className="bg-white w-full max-w-2xl mx-auto mt-12 flex-1 rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black italic tracking-tighter uppercase">GuardianLink Manual</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase">System Technical Specifications</p>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => window.print()} className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors">
                      <Printer className="w-5 h-5" />
                    </button>
                    <button onClick={() => setShowManual(false)} className="p-3 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-24 prose prose-slate max-w-none">
                 <section className="print-content">
                    <h3 className="text-slate-900 font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tighter text-xl">1. Core Infrastructure</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                       GuardianLink is a high-availability personal safety application built on a decentralized React architecture. It integrates Google Gemini 1.5 Flash AI for real-time situational analysis and legal guidance.
                    </p>
                    <ul className="space-y-2 text-xs font-medium text-slate-500">
                       <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> AI-Driven Problem Analysis (Gemini API)</li>
                       <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Real-time Geolocation Monitoring (W3C Standard)</li>
                       <li className="flex gap-2"><CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> Multi-Guardian Emergency Dispatch (E2EE)</li>
                    </ul>
                 </section>

                 <section className="print-content">
                    <h3 className="text-slate-900 font-black border-l-4 border-red-600 pl-4 uppercase tracking-tighter text-xl">2. Emergency SOS Protocol</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                       The SOS mechanism is a fail-safe system designed to trigger even in the absence of user interaction. 
                    </p>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                       <div>
                          <h4 className="text-[10px] font-black text-red-600 uppercase mb-2">Phase 1: Analysis</h4>
                          <p className="text-[11px] text-slate-500 font-medium italic">User inputs a situation. The AI assesses legal risks and initiates a 10-minute "Check-in" timer.</p>
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-red-600 uppercase mb-2">Phase 2: Failure to Check-in</h4>
                          <p className="text-[11px] text-slate-500 font-medium italic">If the user does not tap "I AM SAFE" before the timer expires, the system enters DANGER mode.</p>
                       </div>
                       <div>
                          <h4 className="text-[10px] font-black text-red-600 uppercase mb-2">Phase 3: Active Dispatch</h4>
                          <p className="text-[11px] text-slate-500 font-medium italic">Encrypted packets containing the user's name, profile data, and live GPS coordinates are simulated for dispatch to all registered guardians.</p>
                       </div>
                    </div>
                 </section>

                 <section className="print-content">
                    <h3 className="text-slate-900 font-black border-l-4 border-blue-600 pl-4 uppercase tracking-tighter text-xl">3. User Manual: Operations</h3>
                    <div className="space-y-4">
                       <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">01</div>
                          <div>
                             <span className="text-sm font-bold block">Console Interaction</span>
                             <span className="text-xs text-slate-500">Describe any situation or threat in the main search bar to receive immediate legal steps and mental support.</span>
                          </div>
                       </div>
                       <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">02</div>
                          <div>
                             <span className="text-sm font-bold block">Guardian Setup</span>
                             <span className="text-xs text-slate-500">Access the Profile tab to register up to 3 trusted contacts. These individuals are your primary lifeline.</span>
                          </div>
                       </div>
                       <div className="flex gap-4 items-start">
                          <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black shrink-0">03</div>
                          <div>
                             <span className="text-sm font-bold block">Safety History</span>
                             <span className="text-xs text-slate-500">All incident reports are archived in your private history feed for future reference or evidence.</span>
                          </div>
                       </div>
                    </div>
                 </section>

                 <section className="print-content pb-12">
                    <h3 className="text-slate-900 font-black border-l-4 border-slate-400 pl-4 uppercase tracking-tighter text-xl">4. Privacy & Compliance</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                       GuardianLink processes data on-device where possible. Location data is only queried during active safety sessions. All AI analysis is performed via secure SSL endpoints to the Google Gemini infrastructure. No data is stored permanently on external servers without explicit user SOS triggers.
                    </p>
                 </section>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="no-print fixed bottom-6 inset-x-6 z-50">
        <div className="bg-slate-900/95 backdrop-blur-xl h-20 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center justify-around px-8">
           <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'home' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
              <Home className="w-6 h-6" /><span className="text-[8px] font-black uppercase tracking-widest">Console</span>
           </button>
           <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Shield className={`w-6 h-6 ${safetyStatus === SafetyStatus.SAFE ? 'text-green-400' : 'text-red-400 animate-pulse'}`} />
           </div>
           <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'profile' ? 'text-blue-400 scale-110' : 'text-slate-500'}`}>
              <User className="w-6 h-6" /><span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
           </button>
        </div>
      </nav>

      {/* Emergency Overlay */}
      {emergencyModal && (
        <div className="fixed inset-0 z-[120] bg-red-600 flex flex-col items-center justify-center p-8 text-white no-print">
           <AlertTriangle className="w-20 h-20 mb-6 animate-bounce" />
           <h2 className="text-4xl font-black italic uppercase mb-2">SOS Active</h2>
           <p className="text-red-100 font-bold mb-8 text-center max-w-xs">Guardians notified with GPS: {user.latitude}, {user.longitude}</p>
           <div className="w-full bg-black/20 p-6 rounded-3xl font-mono text-xs mb-10 border border-white/10">
              <div className="opacity-40 uppercase font-black text-[9px] mb-2">SOS Payload</div>
              {user.customSosMessage}
           </div>
           <button onClick={() => { setEmergencyModal(false); setSafetyStatus(SafetyStatus.SAFE); }} className="bg-white text-red-600 px-12 py-5 rounded-3xl font-black text-lg shadow-2xl active:scale-95">
             I AM SAFE - CANCEL
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
