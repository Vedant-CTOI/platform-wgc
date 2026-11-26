import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, PageHeader, NoticeModal, useInViewOnce, RevealItem } from '../components/SharedUI';
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

const GoldHeroSwirls: React.FC<{ drift: number }> = ({ drift }) => {
  const renderStrands = (suffix: string) => (
    <>
      <defs>
        <linearGradient id={`goldMain${suffix}`} x1="-40" y1="430" x2="520" y2="-60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B87212" stopOpacity="0.82" />
          <stop offset="32%" stopColor="#F2BE42" stopOpacity="0.96" />
          <stop offset="54%" stopColor="#FFF5CC" stopOpacity="1" />
          <stop offset="76%" stopColor="#E6A92E" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#A9640E" stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={`goldSheen${suffix}`} x1="0" y1="410" x2="540" y2="-50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F2BE42" stopOpacity="0.45" />
          <stop offset="46%" stopColor="#FFF9E4" stopOpacity="0.98" />
          <stop offset="68%" stopColor="#F2BE42" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D6921F" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={`goldDeep${suffix}`} x1="-60" y1="450" x2="490" y2="-80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8F4F08" stopOpacity="0.7" />
          <stop offset="45%" stopColor="#DF9C26" stopOpacity="0.92" />
          <stop offset="75%" stopColor="#C47D14" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#8A4A06" stopOpacity="0.7" />
        </linearGradient>
        <filter id={`goldSoftGlow${suffix}`} x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      {/* Subtle warm metallic wash along the visible mid-arc */}
      <path
        className="bh-swirl-glow"
        d="M -110 430 C 125 365, 345 185, 495 -95"
        stroke="#F2BE42"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.09"
        filter={`url(#goldSoftGlow${suffix})`}
      />

      {/* 6 calligraphic parallel gold strands — every start (x < -90) and end (y < -85) lies strictly off-canvas */}
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s1"
        d="M -125 462 C 150 400, 385 205, 535 -105"
        stroke={`url(#goldDeep${suffix})`}
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s2"
        d="M -115 440 C 138 380, 362 192, 510 -98"
        stroke={`url(#goldMain${suffix})`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s3"
        d="M -108 420 C 126 360, 342 180, 488 -92"
        stroke={`url(#goldSheen${suffix})`}
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s4"
        d="M -100 398 C 110 342, 322 166, 464 -88"
        stroke={`url(#goldMain${suffix})`}
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s5"
        d="M -95 372 C 94 320, 298 150, 434 -88"
        stroke={`url(#goldSheen${suffix})`}
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s6"
        d="M -90 344 C 78 296, 272 132, 402 -90"
        stroke={`url(#goldDeep${suffix})`}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </>
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* Subtle silk-plum depth lighting behind the corner gold ribbons */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 90% at 50% 45%, rgba(92, 51, 118, 0.48) 0%, rgba(56, 31, 73, 0.92) 58%, rgba(36, 17, 50, 1) 100%)',
        }}
      />

      {/* Top-left corner sweep: enters off left edge, exits off top edge — only mid-arc visible */}
      <svg
        viewBox="0 0 640 480"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-[195px] h-[146px] sm:w-[295px] sm:h-[222px] lg:w-[460px] lg:h-[345px] xl:w-[600px] xl:h-[450px] opacity-80 sm:opacity-90 lg:opacity-95"
        style={{ transform: `translate3d(0, ${Math.round(drift * 0.22)}px, 0)` }}
      >
        {renderStrands('TL')}
      </svg>

      {/* Bottom-right corner sweep: enters off right edge, exits off bottom edge — only mid-arc visible */}
      <svg
        viewBox="0 0 640 480"
        fill="none"
        overflow="visible"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 right-0 w-[195px] h-[146px] sm:w-[295px] sm:h-[222px] lg:w-[460px] lg:h-[345px] xl:w-[600px] xl:h-[450px] opacity-80 sm:opacity-90 lg:opacity-95"
        style={{ transform: `translate3d(0, ${-Math.round(drift * 0.22)}px, 0) rotate(180deg)` }}
      >
        {renderStrands('BR')}
      </svg>
    </div>
  );
};

/* Single wider, shallower Top-Right 5-strand calligraphic ribbon for Features (distinct geometry from Hero) */
const GoldFeaturesRibbon: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    {/* Matching silk-plum ambient depth */}
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 85% at 50% 35%, rgba(92, 51, 118, 0.42) 0%, rgba(56, 31, 73, 0.94) 60%, rgba(36, 17, 50, 1) 100%)',
      }}
    />

    {/* Single top-right flowing wave-arc: enters strictly above top edge (y < -85), exits strictly past right edge (x > 840) */}
    <svg
      viewBox="0 0 760 440"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute top-0 right-0 w-[230px] h-[133px] sm:w-[340px] sm:h-[197px] lg:w-[540px] lg:h-[312px] xl:w-[680px] xl:h-[394px] opacity-75 sm:opacity-85 lg:opacity-90"
    >
      <defs>
        <linearGradient id="goldFeatMain" x1="120" y1="-60" x2="820" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#B87212" stopOpacity="0.8" />
          <stop offset="34%" stopColor="#F2BE42" stopOpacity="0.96" />
          <stop offset="56%" stopColor="#FFF5CC" stopOpacity="1" />
          <stop offset="80%" stopColor="#E2A428" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#A9640E" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="goldFeatSheen" x1="150" y1="-50" x2="830" y2="310" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F2BE42" stopOpacity="0.45" />
          <stop offset="48%" stopColor="#FFF9E4" stopOpacity="0.98" />
          <stop offset="74%" stopColor="#F2BE42" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#D6921F" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="goldFeatDeep" x1="90" y1="-70" x2="840" y2="370" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8F4F08" stopOpacity="0.7" />
          <stop offset="46%" stopColor="#DF9C26" stopOpacity="0.92" />
          <stop offset="78%" stopColor="#C47D14" stopOpacity="0.86" />
          <stop offset="100%" stopColor="#8A4A06" stopOpacity="0.7" />
        </linearGradient>
        <filter id="goldFeatGlow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <path
        className="bh-swirl-glow"
        d="M 120 -95 C 235 125, 495 205, 865 320"
        stroke="#F2BE42"
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0.08"
        filter="url(#goldFeatGlow)"
      />

      {/* 5 fanned calligraphic strands — slightly tighter over the crest, fanning gracefully outward toward the right border */}
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s1"
        d="M 85 -102 C 205 148, 480 232, 878 358"
        stroke="url(#goldFeatDeep)"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s2"
        d="M 118 -96 C 232 132, 502 212, 872 326"
        stroke="url(#goldFeatMain)"
        strokeWidth="3.0"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s3"
        d="M 148 -92 C 258 116, 520 194, 868 292"
        stroke="url(#goldFeatSheen)"
        strokeWidth="1.95"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s4"
        d="M 182 -90 C 288 100, 540 174, 864 256"
        stroke="url(#goldFeatMain)"
        strokeWidth="1.45"
        strokeLinecap="round"
      />
      <path
        pathLength={100}
        className="bh-swirl-strand bh-s5"
        d="M 222 -90 C 322 86, 565 152, 860 216"
        stroke="url(#goldFeatDeep)"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const LandingView: React.FC<AuthProps> = ({ onNavigate, user }) => {
  const hero = useInViewOnce<HTMLElement>(true);
  const about = useInViewOnce();
  const features = useInViewOnce<HTMLElement>();
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
      {/* Hero Section — Deep Plum 900 silk backdrop framed by dual calligraphic gold ribbon swirls */}
      <section
        ref={hero.ref}
        data-hero="true"
        className={`relative overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-[#381F49] ${hero.inView ? 'is-inview' : ''}`}
      >
        <GoldHeroSwirls drift={heroDrift} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-light text-white tracking-tight mb-6 leading-[1.12]">
            <span className="bh-line-mask">
              <span className="bh-line-inner">Lorem ipsum dolor sit amet</span>
            </span>
            <span className="bh-line-mask">
              <span className="bh-line-inner bh-d1 text-[#F2BE42] font-semibold">consectetur.</span>
            </span>
          </h1>
          <p className="bh-fade-up bh-d2 text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto">
            Choose a template, add your store details once, and generate professional marketing materials for all your social channels instantly.
          </p>
          <div className="bh-fade-up bh-d3 flex flex-col items-center space-y-4">
            <Button
              variant="gold-dark"
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
                  className="bh-link text-[#E5A9FF] font-semibold hover:text-[#F2BE42] text-sm transition-colors"
                >
                  Create Account
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={() => onNavigate('login')}
                  className="bh-link text-[#E5A9FF] font-semibold hover:text-[#F2BE42] text-sm transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Goldify — Clean editorial 2-column split */}
      <section
        ref={about.ref}
        className={`relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white ${about.inView ? 'is-inview' : ''}`}
      >
        <div aria-hidden="true" className="bh-border-draw absolute top-0 inset-x-0 h-px bg-[#E6E9ED]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="bh-fade-up text-xs font-bold uppercase tracking-[0.18em] text-[#704287] mb-3">
              Gold the Moment
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-black leading-tight">
              <span className="bh-line-mask">
                <span className="bh-line-inner bh-d1">About Goldify</span>
              </span>
            </h2>
            <div aria-hidden="true" className="bh-border-draw bh-d2 mt-5 h-px w-12 bg-[#F2BE42] origin-left" />
          </div>
          <div className="lg:col-span-7">
            <p className="bh-fade-up bh-d2 text-lg text-[#634B6F] leading-relaxed">
              Goldify is designed specifically for small and medium businesses to effortlessly create high-quality, branded promotional content. We bridge the gap between complex design tools and the fast-paced needs of retail marketing, allowing you to focus on what you do best: running your business.
            </p>
          </div>
        </div>
      </section>

      {/* Features — Plum 900 section, single top-right calligraphic gold ribbon, editorial white cards with Gold top wipe rule & Goldify 1, 2, 3 rings */}
      <section ref={features.ref} className="relative overflow-hidden py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#381F49]">
        <div className={features.inView ? 'is-inview' : ''}>
          <GoldFeaturesRibbon />

          <div className="relative z-10 max-w-7xl mx-auto text-center mb-14">
            <p className="bh-fade-up text-xs font-bold uppercase tracking-[0.18em] text-[#E5A9FF] mb-3">
              Why Goldify
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-white">
              <span className="bh-line-mask">
                <span className="bh-line-inner bh-d1">Features</span>
              </span>
            </h2>
            <div aria-hidden="true" className="bh-border-draw bh-d2 mx-auto mt-4 h-px w-14 bg-[#F2BE42]/75" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                num: '1',
                stagger: 'bh-card-d1',
                title: 'Lightning Fast',
                desc: 'Generate campaigns in seconds. No more waiting for designers or struggling with complex software.',
              },
              {
                num: '2',
                stagger: 'bh-card-d2',
                title: 'On-Brand Always',
                desc: 'Your logo, your address, your contact info—automatically applied to every template perfectly.',
              },
              {
                num: '3',
                stagger: 'bh-card-d3',
                title: 'Reliable & Secure',
                desc: 'Your data and assets are stored securely, ensuring your business information is always protected.',
              },
            ].map((item) => (
              <RevealItem key={item.num} rootMargin="0px 0px -22% 0px" className="flex">
                <div
                  className={`bh-fade-up bh-feature-card ${item.stagger} relative overflow-hidden w-full bg-white p-8 rounded-2xl shadow-lg border border-white/10 text-left flex flex-col items-start`}
                >
                  <span aria-hidden="true" className="bh-feature-top-rule" />
                  <div className={`bh-feature-ring ${item.stagger} relative w-[68px] h-[68px] mb-6 select-none`}>
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
                  <p className="text-[#634B6F] leading-relaxed">{item.desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs — Editorial 2-column split (sticky left heading + right interactive Lavender accordions) */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div ref={faqs.ref} className={`lg:col-span-5 lg:sticky lg:top-28 ${faqs.inView ? 'is-inview' : ''}`}>
            <p className="bh-fade-up text-xs font-bold uppercase tracking-[0.18em] text-[#704287] mb-3">
              FAQs
            </p>
            <h2 className="text-3xl sm:text-4xl font-light text-black leading-tight mb-6">
              <span className="bh-line-mask">
                <span className="bh-line-inner bh-d1">Frequently Asked</span>
              </span>
              <span className="bh-line-mask">
                <span className="bh-line-inner bh-d2">Questions</span>
              </span>
            </h2>
            <div className="bh-fade-up bh-d3">
              <Button variant="outline" onClick={() => onNavigate('faq')}>
                View All FAQs
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 text-left">
            {LANDING_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <RevealItem key={faq.q} rootMargin="0px 0px -18% 0px">
                  <div
                    className={`bh-fade-up bh-d1 bg-[#ECE9ED] rounded-2xl border transition-colors duration-300 ${isOpen ? 'border-[#704287]/45' : 'border-[#E6E9ED] hover:border-[#634B6F]/35'}`}
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
                </RevealItem>
              );
            })}
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
