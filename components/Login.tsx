
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { MessageSquare, Globe, Shield, User, Calendar, Users } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { id: 'mr', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { id: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
];

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
];

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say'];

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    phone: '',
    phoneCode: '+91',
    email: '',
    address: '',
    guardianName: '',
    guardianPhone: '',
    guardianPhoneCode: '+91',
    allowPolice: false,
    allowGoogleMessages: true,
    preferredLanguage: 'en'
  });

  const handlePhoneChange = (val: string, field: 'phone' | 'guardianPhone') => {
    const cleaned = val.replace(/\D/g, '').slice(0, 10);
    setFormData(prev => ({ ...prev, [field]: cleaned }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10 || formData.guardianPhone.length !== 10) {
      alert("Phone numbers must be 10 digits.");
      return;
    }

    if (!formData.name || !formData.dob) {
      alert("Name and Date of Birth are required.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLogin({
          ...formData,
          guardianNumbers: [{ 
            name: formData.guardianName || 'Primary Guardian', 
            phone: formData.guardianPhone, 
            phoneCode: formData.guardianPhoneCode 
          }],
          customSosMessage: `EMERGENCY: I am ${formData.name}. I am in danger and haven't checked in. Please track my location.`,
          history: [],
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
      },
      () => {
        onLogin({
          ...formData,
          guardianNumbers: [{ 
            name: formData.guardianName || 'Primary Guardian', 
            phone: formData.guardianPhone, 
            phoneCode: formData.guardianPhoneCode 
          }],
          customSosMessage: `EMERGENCY: I am ${formData.name}. I am in danger and haven't checked in. Please track my location.`,
          history: [],
        });
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 overflow-y-auto">
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative my-12">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-600 p-4 rounded-3xl shadow-xl border-4 border-slate-950">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <div className="text-center mb-8 mt-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">GuardianLink</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Infrastructure for Personal Safety</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" required
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" required
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.dob}
                  onChange={e => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Gender</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                >
                  {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Language</label>
            <select 
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.preferredLanguage}
              onChange={e => setFormData({...formData, preferredLanguage: e.target.value})}
            >
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.flag} {l.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Your Number (10 Digits)</label>
            <div className="flex gap-2">
              <select className="bg-slate-50 border border-slate-100 rounded-2xl px-3 text-sm font-bold" value={formData.phoneCode} onChange={e => setFormData({...formData, phoneCode: e.target.value})}>
                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
              <input 
                type="tel" required
                className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000 00000"
                value={formData.phone}
                onChange={e => handlePhoneChange(e.target.value, 'phone')}
              />
            </div>
          </div>

          <div className="bg-red-50 p-5 rounded-[2rem] border border-red-100 space-y-3">
             <label className="text-[10px] font-black text-red-400 uppercase tracking-wider">Primary Guardian</label>
             <input 
               type="text" required
               className="w-full bg-white border border-red-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
               placeholder="Guardian Name"
               value={formData.guardianName}
               onChange={e => setFormData({...formData, guardianName: e.target.value})}
             />
             <div className="flex gap-2">
              <select className="bg-white border border-red-100 rounded-xl px-2 text-sm font-bold" value={formData.guardianPhoneCode} onChange={e => setFormData({...formData, guardianPhoneCode: e.target.value})}>
                {COUNTRY_CODES.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </select>
              <input 
                type="tel" required
                className="flex-1 bg-white border border-red-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none"
                placeholder="10 Digits"
                value={formData.guardianPhone}
                onChange={e => handlePhoneChange(e.target.value, 'guardianPhone')}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95 text-sm uppercase tracking-widest"
          >
            Initialize Safety Protocol
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
