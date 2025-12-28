
export interface Guardian {
  name: string;
  phone: string;
  phoneCode: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  problem: string;
  response: ProblemResponse;
}

export interface UserProfile {
  name: string;
  dob: string;
  gender: string;
  profileImage?: string;
  phone: string;
  phoneCode: string;
  email: string;
  address: string;
  guardianNumbers: Guardian[];
  customSosMessage: string;
  allowPolice: boolean;
  allowGoogleMessages: boolean;
  preferredLanguage: string;
  latitude?: number;
  longitude?: number;
  history: HistoryItem[];
}

export interface ProblemResponse {
  isLegal: string;
  legalityExplanation: string;
  solutions: string[];
  mentalSupportMessage: string;
}

export enum SafetyStatus {
  SAFE = 'SAFE',
  PENDING = 'PENDING',
  DANGER = 'DANGER'
}

export const TRANSLATIONS: Record<string, any> = {
  en: {
    welcome: "How can I help you today?",
    subWelcome: "I'm here to provide legal guidance and safety support.",
    placeholder: "Tell the problem...",
    getHelp: "Get Help",
    analyzing: "Analyzing...",
    safeBtn: "I AM SAFE",
    emergency: "EMERGENCY ACTIVE",
    disclaimer: "Disclaimer: AI safety assistant. Not professional legal advice.",
    status: "Status Assessment",
    solutions: "Next Steps",
    profileTitle: "Safety Profile",
    guardians: "Guardians",
    sosMessage: "SOS Message",
    history: "Safety History",
    about: "About App",
    personalInfo: "Personal Information",
    save: "Save Changes",
    edit: "Edit Profile"
  },
  hi: {
    welcome: "आज मैं आपकी कैसे मदद कर सकता हूँ?",
    subWelcome: "मैं यहाँ कानूनी मार्गदर्शन और सुरक्षा सहायता प्रदान करने के लिए हूँ।",
    placeholder: "अपनी समस्या बताएं...",
    getHelp: "मदद लें",
    analyzing: "विश्लेषण कर रहा है...",
    safeBtn: "मैं सुरक्षित हूँ",
    emergency: "आपातकाल सक्रिय",
    disclaimer: "अस्वीकरण: एआई सुरक्षा सहायक। पेशेवर कानूनी सलाह नहीं।",
    status: "स्थिति मूल्यांकन",
    solutions: "अगले कदम",
    profileTitle: "सुरक्षा प्रोफ़ाइल",
    guardians: "अभिभावक",
    sosMessage: "आपातकालीन संदेश",
    history: "सुरक्षा इतिहास",
    about: "ऐप के बारे में",
    personalInfo: "व्यक्तिगत जानकारी",
    save: "परिवर्तन सहेजें",
    edit: "प्रोफ़ाइल संपादित करें"
  }
};
