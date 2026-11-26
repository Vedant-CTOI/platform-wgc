import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, ChevronLeft, CheckCircle2, AlertCircle, X, Home, Globe, Check, Link2, Mail, MessageCircle } from 'lucide-react';
import { ADDRESS_LIMITS } from '../constants';

// --- Play-once viewport reveal hook (Barber Hauler style) ---
// Waits until an element genuinely enters the user's sightline (default 30% up from viewport bottom),
// with a bottom-of-page fallback so elements near the footer always reveal cleanly.
export const useInViewOnce = (immediate = false, rootMargin = '0px 0px -30% 0px') => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }
    if (immediate) {
      const timer = window.setTimeout(() => setInView(true), 40);
      return () => window.clearTimeout(timer);
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight * 0.65 && initialRect.bottom > 0) {
      const timer = window.setTimeout(() => setInView(true), 40);
      return () => window.clearTimeout(timer);
    }
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setInView(true);
      obs.disconnect();
      window.removeEventListener('scroll', checkNearBottom);
    };
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reveal();
      },
      { threshold: 0.01, rootMargin }
    );
    const checkNearBottom = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
      if (!atBottom) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal();
    };
    obs.observe(el);
    window.addEventListener('scroll', checkNearBottom, { passive: true });
    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', checkNearBottom);
    };
  }, [immediate, rootMargin]);

  return { ref, inView };
};

export const RevealItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  rootMargin?: string;
}> = ({ children, className = '', rootMargin = '0px 0px -22% 0px' }) => {
  const { ref, inView } = useInViewOnce(false, rootMargin);
  return (
    <div ref={ref} className={`${inView ? 'is-inview' : ''} ${className}`}>
      {children}
    </div>
  );
};

// --- Buttons ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'gold-dark';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', fullWidth, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bh-btn-wipe bh-btn-primary bg-[#381F49] text-white focus:ring-[#704287] shadow-sm",
    secondary: "bg-[#ECE9ED] text-[#381F49] hover:bg-[#e1dce5] focus:ring-[#704287]",
    outline: "bh-btn-wipe bh-btn-outline border border-[#634B6F] bg-white text-[#381F49] focus:ring-[#704287]",
    ghost: "bg-transparent text-[#634B6F] hover:bg-[#ECE9ED] hover:text-[#381F49] focus:ring-[#704287]",
    gold: "bh-btn-wipe bh-btn-gold bg-[#F2BE42] text-black focus:ring-[#F2BE42] shadow-sm",
    'gold-dark': "bh-btn-wipe bh-btn-gold-dark bg-[#F2BE42] text-black focus:ring-[#F2BE42] focus:ring-offset-[#381F49] shadow-md"
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
      {label && <label className="block text-sm font-semibold text-black mb-1">{label}</label>}
      <input 
        className={`block w-full rounded-lg border ${error ? 'border-red-500 focus:ring-red-500' : 'border-[#634B6F]/40 focus:ring-[#704287] focus:border-[#704287]'} bg-white px-4 py-2.5 min-h-[44px] text-black placeholder:text-[#634B6F]/60 shadow-sm focus:outline-none sm:text-sm transition-colors ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1"/>{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-[#634B6F]">{helperText}</p>}
    </div>
  );
};

// --- In-app Notice Modal (replaces browser alerts) ---
export const NoticeModal: React.FC<{ title: string; message: string; onClose: () => void; actionLabel?: string; onAction?: () => void }> = ({ title, message, onClose, actionLabel = 'OK', onAction }) => (
  <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
      <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
        <h3 className="font-semibold text-[#381F49] flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-[#704287]" /> {title}</h3>
        <button onClick={onClose} className="p-1 text-[#634B6F] hover:text-[#381F49] rounded-full hover:bg-black/5 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 text-center">
        <p className="text-black mb-6">{message}</p>
        <Button fullWidth onClick={onAction || onClose}>{actionLabel}</Button>
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
        className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-semibold text-white hover:bg-[#704287] rounded-md transition-colors"
        title="Language"
      >
        <Globe className="w-5 h-5" />
        <span>{lang}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 ring-1 ring-[#381F49]/15 z-50">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="flex items-center justify-between w-full text-left px-4 py-2.5 text-sm text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors"
              >
                <span>{l.name}</span>
                {lang === l.code && <Check className="w-4 h-4 text-[#704287]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Remarketing "Tell a friend" band (homepage, logged-in + logged-out) ---
export const ShareBand: React.FC = () => {
  const band = useInViewOnce(false, '0px 0px -8% 0px');
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.origin + '/' : '';
  const shareText = 'Create professional marketing creatives for your store in minutes.';

  const handleShare = async () => {
    // Phones: native share sheet. Desktop (or if unsupported/cancelled oddly): in-app options.
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch && navigator.share) {
      try { await navigator.share({ title: 'Goldify', text: shareText, url: shareUrl }); return; }
      catch (e: any) { if (e?.name === 'AbortError') return; }
    }
    setShowOptions(true);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(shareUrl); }
    catch {
      const t = document.createElement('textarea'); t.value = shareUrl; document.body.appendChild(t); t.select();
      document.execCommand('copy'); document.body.removeChild(t);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const enc = encodeURIComponent;
  const optionClass = "flex items-center w-full px-4 py-3 rounded-lg border border-[#E6E9ED] text-sm font-semibold text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors";

  return (
    <section ref={band.ref} className={`relative bg-[#ECE9ED] ${band.inView ? 'is-inview' : ''}`}>
      <div aria-hidden="true" className="bh-border-draw absolute top-0 inset-x-0 h-px bg-[#634B6F]/25" />
      <div aria-hidden="true" className="bh-border-draw bh-d1 absolute bottom-0 inset-x-0 h-px bg-[#634B6F]/25" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-lg sm:text-xl font-semibold text-black text-center sm:text-left">
          <span className="bh-line-mask">
            <span className="bh-line-inner">Loving the experience? Tell a friend</span>
          </span>
        </p>
        <div className="bh-fade-up bh-d2 w-full sm:w-auto">
          <Button size="lg" onClick={handleShare} className="w-full sm:w-auto px-8">Share Now</Button>
        </div>
      </div>

      {showOptions && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowOptions(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
              <h3 className="font-semibold text-[#381F49]">Share Goldify</h3>
              <button onClick={() => setShowOptions(false)} className="p-1 text-[#634B6F] hover:text-[#381F49] rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <button onClick={copyLink} className={optionClass}>
                {copied ? <Check className="w-5 h-5 mr-3 text-[#00323C]" /> : <Link2 className="w-5 h-5 mr-3 text-[#704287]" />}
                {copied ? 'Link copied' : 'Copy link'}
              </button>
              <a href={`https://wa.me/?text=${enc(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className={optionClass}>
                <MessageCircle className="w-5 h-5 mr-3 text-[#704287]" /> WhatsApp
              </a>
              <a href={`mailto:?subject=${enc('Check out Goldify')}&body=${enc(shareText + '\n\n' + shareUrl)}`} className={optionClass}>
                <Mail className="w-5 h-5 mr-3 text-[#704287]" /> Email
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// --- Layout Components ---
export const TopNav: React.FC<{ 
  isLoggedIn: boolean; 
  isLanding?: boolean;
  onNavigate: (view: any) => void;
  onLogout: () => void;
  accountLabel?: string;
}> = ({ isLoggedIn, isLanding = false, onNavigate, onLogout, accountLabel }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (view: string) => {
    setIsMenuOpen(false);
    onNavigate(view);
  };

  return (
    <>
      <header className="bg-[#381F49] border-b border-[#704287]/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center relative">
            
            {/* Left: Logo on Homepage, or Home Icon (if logged in) on inner pages */}
            {isLanding ? (
              <div 
                className="flex items-center cursor-pointer" 
                onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
              >
                <img
                  src="/goldify-logo-nav.png"
                  alt="Goldify"
                  className="h-11 w-auto object-contain select-none"
                />
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center">
                  {isLoggedIn && (
                    <button 
                      onClick={() => onNavigate('dashboard')}
                      className="p-2 text-white hover:bg-[#704287] rounded-md transition-colors"
                      title="Home"
                    >
                      <Home className="w-6 h-6" />
                    </button>
                  )}
                </div>

                {/* Center: Goldify Logo (gold on plum) on all non-homepage views */}
                <div 
                  className="flex items-center justify-center cursor-pointer flex-1" 
                  onClick={() => onNavigate(isLoggedIn ? 'dashboard' : 'landing')}
                >
                  <img
                    src="/goldify-logo-nav.png"
                    alt="Goldify"
                    className="h-11 w-auto object-contain select-none"
                  />
                </div>
              </>
            )}
            
            {/* Right: Language + Hamburger Menu */}
            <div className={`${isLanding ? '' : 'flex-1 '}flex justify-end items-center gap-1`}>
              <LanguageSelector />
              {isLoggedIn && (
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-white hover:bg-[#704287] rounded-md transition-colors"
                    aria-label="Menu"
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 ring-1 ring-[#381F49]/15 z-50">
                      {accountLabel && (
                        <>
                          <div className="px-4 py-2.5">
                            <span className="block text-xs text-[#634B6F]">Signed in as</span>
                            <span className="block text-sm font-semibold text-[#381F49]">{accountLabel}</span>
                          </div>
                          <div className="border-t border-[#E6E9ED] my-1"></div>
                        </>
                      )}
                      <button onClick={() => handleNav('profile_setup')} className="block w-full text-left px-4 py-2.5 text-sm text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors">My Account</button>
                      <button onClick={() => handleNav('faq')} className="block w-full text-left px-4 py-2.5 text-sm text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors">FAQs</button>
                      
                      <div className="border-t border-[#E6E9ED] my-1"></div>
                      
                      <button onClick={() => handleNav('terms')} className="block w-full text-left px-4 py-2.5 text-sm text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors">Terms & Conditions</button>
                      <button onClick={() => handleNav('privacy')} className="block w-full text-left px-4 py-2.5 text-sm text-black hover:bg-[#ECE9ED] hover:text-[#381F49] transition-colors">Privacy Policy</button>
                      
                      <div className="border-t border-[#E6E9ED] my-1"></div>
                      <button onClick={() => { setIsMenuOpen(false); onLogout(); }} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold">Sign out</button>
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
        <button onClick={onBack} className="mr-4 p-2 -ml-2 text-[#634B6F] hover:text-[#381F49] hover:bg-[#ECE9ED] rounded-full transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <h1 className="text-2xl font-semibold text-black">{title}</h1>
    </div>
    {action && <div>{action}</div>}
  </div>
);
