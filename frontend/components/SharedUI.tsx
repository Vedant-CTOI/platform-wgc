import React, { useState } from 'react';
import { Menu, Bell, User, ChevronLeft, CheckCircle2, AlertCircle, X, Home, Globe, Check } from 'lucide-react';
import { ADDRESS_LIMITS } from '../constants';

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-primary-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2.5 text-sm min-h-[44px]",
    lg: "px-6 py-3 text-base min-h-[48px]"
  };

  const classes = `${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// --- Inputs ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input 
        className={`block w-full rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'} px-4 py-2.5 min-h-[44px] text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none sm:text-sm transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

// --- In-app Notice Modal (replaces browser alerts) ---
export const NoticeModal: React.FC<{ title: string; message: string; onClose: () => void; actionLabel?: string }> = ({ title, message, onClose, actionLabel = 'OK' }) => (
  <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-900 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-gray-700" /> {title}</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 text-center">
        <p className="text-gray-700 mb-6">{message}</p>
        <Button fullWidth onClick={onClose}>{actionLabel}</Button>
      </div>
    </div>
  </div>
);

// --- Structured address fields (Line 1 mandatory; Landmark / City optional) with limit modal ---
export const CHAR_LIMIT_MESSAGE = 'Maximum character limit reached. Please shorten your address.';

export const AddressFields: React.FC<{
  line1: string;
  landmark?: string;
  city?: string;
  onChange: (field: 'line1' | 'landmark' | 'city', value: string) => void;
}> = ({ line1, landmark = '', city = '', onChange }) => {
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handle = (field: 'line1' | 'landmark' | 'city', limit: number, value: string) => {
    if (value.length > limit) {
      onChange(field, value.slice(0, limit));
      setShowLimitModal(true);
      return;
    }
    onChange(field, value);
  };

  return (
    <>
      <Input
        label="Address Line 1 *"
        placeholder="e.g. 12 MG Road"
        value={line1}
        onChange={(e) => handle('line1', ADDRESS_LIMITS.line1, e.target.value)}
        helperText={`${line1.length}/${ADDRESS_LIMITS.line1} characters`}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <Input
          label="Landmark (Optional)"
          placeholder="e.g. Near City Mall"
          value={landmark}
          onChange={(e) => handle('landmark', ADDRESS_LIMITS.landmark, e.target.value)}
        />
        <Input
          label="City (Optional)"
          placeholder="e.g. Mumbai"
          value={city}
          onChange={(e) => handle('city', ADDRESS_LIMITS.city, e.target.value)}
        />
      </div>
      {showLimitModal && (
        <NoticeModal title="Character Limit" message={CHAR_LIMIT_MESSAGE} onClose={() => setShowLimitModal(false)} />
      )}
    </>
  );
};

// --- Language selector (English default; Hindi as 2nd language — label only until translated copy is supplied) ---
const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'हिन्दी (Hindi)' },
];

const LanguageSelector: React.FC = () => {
  const [lang, setLang] = useState('EN');
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
        title="Language"
      >
        <Globe className="w-5 h-5" />
        <span>{lang}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 z-50">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <span>{l.name}</span>
                {lang === l.code && <Check className="w-4 h-4 text-gray-900" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Layout Components ---
export const TopNav: React.FC<{ 
  isLoggedIn: boolean; 
  onNavigate: (view: any) => void;
  onLogout: () => void;
  accountLabel?: string;
}> = ({ isLoggedIn, onNavigate, onLogout, accountLabel }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center relative">
            
            {/* Left: Home Icon (if logged in) */}
            <div className="flex-1 flex items-center">
              {isLoggedIn && (
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="p-2 text-gray-600 hover:text-primary-600 rounded-md hover:bg-gray-100 transition-colors"
                  title="Home"
                >
                  <Home className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Center: Logo */}
            <div 
              className="flex items-center justify-center cursor-pointer flex-1" 
              onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
            >
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl leading-none">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Platform</span>
            </div>
            
            {/* Right: Language + Hamburger Menu */}
            <div className="flex-1 flex justify-end items-center gap-1">
              <LanguageSelector />
              {isLoggedIn && (
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 ring-1 ring-black ring-opacity-5 z-50">
                      {accountLabel && (
                        <>
                          <div className="px-4 py-2.5">
                            <span className="block text-xs text-gray-500">Signed in as</span>
                            <span className="block text-sm font-semibold text-gray-900">{accountLabel}</span>
                          </div>
                          <div className="border-t border-gray-100 my-1"></div>
                        </>
                      )}
                      <button onClick={() => handleNav('profile_setup')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">My Account</button>
                      <button onClick={() => handleNav('faq')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors">FAQs</button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button onClick={() => handleNav('terms')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Terms & Conditions</button>
                      <button onClick={() => handleNav('privacy')} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">Privacy Policy</button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      <button onClick={() => { setIsMenuOpen(false); onLogout(); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium">Sign out</button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export const PageHeader: React.FC<{ title: string; onBack?: () => void; action?: React.ReactNode }> = ({ title, onBack, action }) => (
  <div className="flex items-center justify-between mb-6 sm:mb-8">
    <div className="flex items-center">
      {onBack && (
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    </div>
    {action && <div>{action}</div>}
  </div>
);
