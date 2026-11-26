import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, PageHeader, NoticeModal, useInViewOnce } from '../components/SharedUI';
import { ViewState, UserProfile, StoreInfo } from '../types';
import { RETURNING_USER_STORES, DEMO_ACCOUNTS, DEMO_OTP } from '../constants';
import { Store, Image as ImageIcon, MapPin, Phone, CheckCircle2, UploadCloud, AlertTriangle, X, Loader2, Plus, Trash2, Mail, Send, ArrowRight } from 'lucide-react';

interface AuthProps {
  onNavigate: (view: ViewState) => void;
  onLogin?: (user: UserProfile) => void;
  user?: UserProfile | null;
  authMode?: 'new' | 'returning';
  onSetAuthMode?: (mode: 'new' | 'returning') => void;
}

const LANDING_FAQS = [
  {
    q: 'How do I get started?',
    a: 'Simply click on "Choose a Template" or "Create Account" to begin your journey.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes, our basic templates are completely free to use for your business.',
  },
  {
    q: 'Can I add multiple stores?',
    a: 'Absolutely! You can manage multiple store locations and generate creatives for all of them at once.',
  },
];

export const LandingView: React.FC<AuthProps> = ({ onNavigate, user }) => {
  const hero = useInViewOnce(true);
  const about = useInViewOnce();
  const features = useInViewOnce();
  const faqs = useInViewOnce();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroDrift, setHeroDrift] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const onScroll = () => {
      setHeroDrift(Math.min(window.scrollY * 0.14, 56));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section — White bg, concentric gold/plum arcs, masked editorial rise, directional Gold CTA */}
      <section
        ref={hero.ref}
        data-hero="true"
        className={`relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-white ${hero.inView ? 'is-inview' : ''}`}
      >
        {/* Subtle counter-rotating concentric hairline arcs framing the hero copy */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ transform: `translate3d(0, ${heroDrift}px, 0)` }}
        >
          <span
            className="bh-arc-outer w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]"
            style={{ borderTopColor: 'rgba(216, 172, 77, 0.34)', borderRightColor: 'rgba(216, 172, 77, 0.34)' }}
          />
          <span
            className="bh-arc-inner w-[310px] h-[310px] sm:w-[440px] sm:h-[440px]"
            style={{ borderTopColor: 'rgba(112, 66, 135, 0.18)', borderRightColor: 'rgba(112, 66, 135, 0.18)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-light text-black tracking-tight mb-6 leading-[1.12]">
            <span className="bh-line-mask">
              <span className="bh-line-inner">Lorem ipsum dolor sit amet</span>
            </span>
            <span className="bh-line-mask">
              <span className="bh-line-inner bh-d1 text-[#704287] font-semibold">consectetur.</span>
            </span>
          </h1>
          <p className="bh-fade-up bh-d2 text-lg sm:text-xl text-[#634B6F] mb-10 max-w-2xl mx-auto">
            Choose a template, add your store details once, and generate professional marketing materials for all your social channels instantly.
          </p>
          <div className="bh-fade-up bh-d3 flex flex-col items-center space-y-4">
            <Button
              variant="gold"
              size="lg"
              onClick={() => onNavigate(user ? 'gallery' : 'login')}
              className="group w-full sm:w-auto px-8"
            >
              <span>Choose a Template</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </Button>
            {!user && (
              <div className="bh-fade-up bh-d4 flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('register')}
                  className="bh-link text-[#704287] font-semibold hover:text-[#381F49] text-sm transition-colors"
                >
                  Create Account
                </button>
                <span className="text-[#E6E9ED]">|</span>
                <button
                  onClick={() => onNavigate('login')}
                  className="bh-link text-[#704287] font-semibold hover:text-[#381F49] text-sm transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Goldify */}
      <section
        ref={about.ref}
        className={`relative py-20 px-4 sm:px-6 lg:px-8 bg-white ${about.inView ? 'is-inview' : ''}`}
      >
        <div aria-hidden="true" className="bh-border-draw absolute top-0 inset-x-0 h-px bg-[#E6E9ED]" />
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black mb-6">
            <span className="bh-line-mask">
              <span className="bh-line-inner">About Goldify</span>
            </span>
          </h2>
          <p className="bh-fade-up bh-d2 text-lg text-[#634B6F] max-w-3xl mx-auto leading-relaxed">
            Goldify is designed specifically for small and medium businesses to effortlessly create high-quality, branded promotional content. We bridge the gap between complex design tools and the fast-paced needs of retail marketing, allowing you to focus on what you do best: running your business.
          </p>
        </div>
      </section>

      {/* Features — Plum 900 section with concentric gold/lilac arcs & staggered Goldify ring 1, 2, 3 cards */}
      <section
        ref={features.ref}
        className={`relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 bg-[#381F49] ${features.inView ? 'is-inview' : ''}`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span
            className="bh-arc-outer w-[560px] h-[560px] sm:w-[820px] sm:h-[820px]"
            style={{ borderTopColor: 'rgba(242, 190, 66, 0.28)', borderRightColor: 'rgba(242, 190, 66, 0.28)' }}
          />
          <span
            className="bh-arc-inner w-[360px] h-[360px] sm:w-[500px] sm:h-[500px]"
            style={{ borderTopColor: 'rgba(229, 169, 255, 0.22)', borderRightColor: 'rgba(229, 169, 255, 0.22)' }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-white">
              <span className="bh-line-mask">
                <span className="bh-line-inner">Features</span>
              </span>
            </h2>
            <div aria-hidden="true" className="bh-border-draw bh-d1 mx-auto mt-4 h-px w-14 bg-[#F2BE42]/75" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                num: '1',
                delay: 'bh-d1',
                title: 'Lightning Fast',
                desc: 'Generate campaigns in seconds. No more waiting for designers or struggling with complex software.',
              },
              {
                num: '2',
                delay: 'bh-d2',
                title: 'On-Brand Always',
                desc: 'Your logo, your address, your contact info—automatically applied to every template perfectly.',
              },
              {
                num: '3',
                delay: 'bh-d3',
                title: 'Reliable & Secure',
                desc: 'Your data and assets are stored securely, ensuring your business information is always protected.',
              },
            ].map((item) => (
              <div
                key={item.num}
                className={`bh-fade-up bh-feature-card ${item.delay} bg-white p-8 rounded-2xl shadow-lg border border-white/10 text-center flex flex-col items-center`}
              >
                <div className={`bh-feature-ring ${item.delay} relative w-[68px] h-[68px] mb-6 select-none`}>
                  <img
                    src="/goldify-ring.png"
                    alt=""
                    aria-hidden="true"
                    className="bh-feature-ring-img w-full h-full object-contain"
                  />
                  <span className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-[#381F49] leading-none">
                    {item.num}
                  </span>
                </div>
                <h3 className="text-xl font-light text-black mb-3">{item.title}</h3>
                <p className="text-[#634B6F]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs — Interactive smooth accordions */}
      <section
        ref={faqs.ref}
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-white ${faqs.inView ? 'is-inview' : ''}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black mb-10">
            <span className="bh-line-mask">
              <span className="bh-line-inner">Frequently Asked Questions</span>
            </span>
          </h2>
          <div className="space-y-4 text-left">
            {LANDING_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              const delayCls = idx === 0 ? 'bh-d1' : idx === 1 ? 'bh-d2' : 'bh-d3';
              return (
                <div
                  key={faq.q}
                  className={`bh-fade-up ${delayCls} bg-[#ECE9ED] rounded-2xl border transition-colors duration-300 ${isOpen ? 'border-[#704287]/45' : 'border-[#E6E9ED] hover:border-[#634B6F]/35'}`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 flex items-center justify-between gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#704287] rounded-2xl"
                  >
                    <h3 className="font-semibold text-black">{faq.q}</h3>
                    <span
                      aria-hidden="true"
                      className={`flex-shrink-0 w-7 h-7 rounded-full border border-[#634B6F]/35 flex items-center justify-center text-[#381F49] transition-transform duration-400 ${isOpen ? 'rotate-45 bg-[#381F49] text-white border-[#381F49]' : 'bg-white/70'}`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <div className="bh-accordion-body" data-open={isOpen ? 'true' : 'false'}>
                    <div className="bh-accordion-inner">
                      <p className="text-[#634B6F] px-6 pb-6 -mt-1 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bh-fade-up bh-d4">
            <Button variant="outline" className="mt-10" onClick={() => onNavigate('faq')}>
              View All FAQs
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
};

export const RegisterView: React.FC<AuthProps> = ({ onNavigate, onSetAuthMode }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [gstStatus, setGstStatus] = useState<'idle' | 'verifying' | 'verified' | 'invalid'>('idle');
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [showGstPopup, setShowGstPopup] = useState(false);

  // Standard 15-character GSTIN format: 2-digit state code + PAN + entity no. + 'Z' + checksum
  const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const handleGstChange = (value: string) => {
    setGstNumber(value.toUpperCase().replace(/\s/g, ''));
    setGstStatus('idle');
    setAgreedTerms(false);
  };

  // Mock GSTIN verification — confirms the registrant is an actual business
  const handleGstVerify = () => {
    if (!GSTIN_PATTERN.test(gstNumber)) {
      setGstStatus('invalid');
      return;
    }
    setGstStatus('verifying');
    setTimeout(() => setGstStatus('verified'), 1500);
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && gstStatus !== 'verified') {
      setShowGstPopup(true);
      return;
    }
    setAgreedTerms(e.target.checked);
  };

  const handleGstPopupAction = () => {
    setShowGstPopup(false);
    if (gstNumber.length === 15 && gstStatus !== 'verifying' && gstStatus !== 'verified') {
      handleGstVerify();
    } else {
      setTimeout(() => {
        const el = document.getElementById('register-gst-input');
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  };

  const handleContinue = () => {
    if (!email || !firstName || !lastName || gstStatus !== 'verified' || !agreedTerms) return;
    onSetAuthMode?.('new');
    onNavigate('otp');
  };

  const isFormValid = email && firstName && lastName && gstStatus === 'verified';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-[#E6E9ED]">
        <div className="flex flex-col items-center">
          <div className="bg-[#381F49] px-6 py-4 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <img src="/goldify-logo-full.png" alt="Goldify" className="h-16 w-auto object-contain select-none" />
          </div>
          <h2 className="text-center text-2xl font-light text-black">Create your account</h2>
          <p className="mt-2 text-center text-sm text-[#634B6F]">
            to continue to Goldify
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name *"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name *"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Email ID *"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="border-t border-[#E6E9ED] pt-6 mt-4">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Input
                    id="register-gst-input"
                    label="GST Number *"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                    value={gstNumber}
                    maxLength={15}
                    onChange={(e) => handleGstChange(e.target.value)}
                    error={gstStatus === 'invalid' ? 'Please enter a valid 15-character GSTIN' : undefined}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className={gstStatus === 'invalid' ? 'mb-11' : 'mb-4'}
                  disabled={gstNumber.length !== 15 || gstStatus === 'verifying' || gstStatus === 'verified'}
                  onClick={handleGstVerify}
                >
                  {gstStatus === 'verifying' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                </Button>
              </div>
              <p className={`text-sm mt-1 flex items-center ${gstStatus === 'verified' ? 'text-[#00323C] font-semibold' : 'text-[#634B6F]'}`}>
                {gstStatus === 'verified' && <CheckCircle2 className="w-4 h-4 mr-1 text-[#00323C]" />}
                {gstStatus === 'verifying'
                  ? 'Verifying GSTIN...'
                  : gstStatus === 'verified'
                    ? 'GSTIN verified'
                    : 'We use your GSTIN to verify that you are a registered business.'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreedTerms}
              onChange={handleTermsChange}
              required
              className="h-4 w-4 text-[#381F49] focus:ring-[#704287] border-[#634B6F]/50 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-black">
              I agree to the <a href="#" className="bh-link text-[#704287] hover:text-[#381F49] font-semibold">Terms</a> and <a href="#" className="bh-link text-[#704287] hover:text-[#381F49] font-semibold">Privacy Policy</a>
            </label>
          </div>

          <p className="text-xs text-[#634B6F]">* Mandatory fields</p>

          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={!isFormValid}>
              Send Email OTP
            </Button>
            <button type="button" onClick={() => onNavigate('login')} className="bh-link text-[#704287] font-semibold hover:text-[#381F49] text-sm transition-colors">
              Sign in instead
            </button>
          </div>
        </form>
      </div>

      {showGstPopup && (
        <NoticeModal
          title="GST Verification Required"
          message="Please verify your GST Number before agreeing to the Terms and Privacy Policy."
          actionLabel="Verify GST"
          onAction={handleGstPopupAction}
          onClose={() => setShowGstPopup(false)}
        />
      )}
    </div>
  );
};

export const LoginView: React.FC<AuthProps> = ({ onNavigate, onSetAuthMode }) => {
  const [email, setEmail] = useState('');

  const handleLogin = () => {
    if (!email) return;
    // new@demo.com always signs in as a fresh first-time user; any other email is a repeat user
    onSetAuthMode?.(email.trim().toLowerCase() === DEMO_ACCOUNTS.new.email ? 'new' : 'returning');
    onNavigate('otp');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-[#E6E9ED]">
        <div className="flex flex-col items-center">
          <div className="bg-[#381F49] px-6 py-4 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <img src="/goldify-logo-full.png" alt="Goldify" className="h-16 w-auto object-contain select-none" />
          </div>
          <h2 className="text-center text-2xl font-light text-black">Sign in</h2>
          <p className="mt-2 text-center text-sm text-[#634B6F]">
            to continue to Goldify
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="pt-4 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={!email}>
              Send
            </Button>
            <button type="button" onClick={() => onNavigate('register')} className="bh-link text-[#704287] font-semibold hover:text-[#381F49] text-sm transition-colors">
              Create account
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export const OTPView: React.FC<AuthProps> = ({ onNavigate, onLogin, authMode = 'returning' }) => {
  // Demo OTP is pre-filled so the presenter only needs to press Verify
  const [otp, setOtp] = useState(DEMO_OTP.split(''));
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleVerify = () => {
    setIsLoading(true);
    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      // First-time users land on the dashboard with no stores — they add store details
      // while creating their first creative. Repeat users have their saved stores.
      const isNew = authMode === 'new';
      const mockUser: UserProfile = {
        name: 'John Doe',
        userId: 'john123',
        mobile: '',
        email: isNew ? DEMO_ACCOUNTS.new.email : DEMO_ACCOUNTS.returning.email,
        gst: '22AAAAA0000A1Z5',
        businessName: isNew ? '' : 'My Store',
        storeDetails: 'Retail store',
        stores: isNew ? [] : RETURNING_USER_STORES,
        isNewUser: isNew
      };
      onLogin(mockUser);
      onNavigate('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-md w-full space-y-8 bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-[#E6E9ED]">
        <div className="flex flex-col items-center">
          <div className="bg-[#381F49] px-6 py-4 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <img src="/goldify-logo-full.png" alt="Goldify" className="h-16 w-auto object-contain select-none" />
          </div>
          <h2 className="text-center text-2xl font-light text-black">Verify it's you</h2>
          <p className="mt-2 text-center text-sm text-[#634B6F]">
            We've sent a 4-digit code to your email.
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <div className="flex justify-center space-x-4">
            {otp.map((data, index) => (
              <input
                className="w-14 h-14 text-center text-2xl font-semibold text-black border border-[#634B6F]/40 rounded-xl focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none transition-all"
                type="text"
                name="otp"
                maxLength={1}
                key={index}
                value={data}
                onChange={e => handleChange(e.target, index)}
                onFocus={e => e.target.select()}
              />
            ))}
          </div>

          <div className="text-center text-sm">
            {timer > 0 ? (
              <span className="text-[#634B6F]">Resend code in 00:{timer.toString().padStart(2, '0')}</span>
            ) : (
              <button className="bh-link text-[#704287] font-semibold hover:text-[#381F49]">Resend OTP</button>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto px-8"
              onClick={handleVerify}
              disabled={otp.join('').length !== 4 || isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </Button>
            <button type="button" onClick={() => onNavigate(authMode === 'new' ? 'register' : 'login')} className="bh-link text-[#704287] font-semibold hover:text-[#381F49] text-sm transition-colors">
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileSetupView: React.FC<AuthProps> = ({ onNavigate, onLogin, user }) => {
  // This view is no longer used in the main flow as profile setup is part of registration
  return null;
};
