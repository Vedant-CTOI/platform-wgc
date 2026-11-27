import React, { useReducer, useEffect, useState } from 'react';
import { AppState, Action, ViewState, UserProfile, Template, CampaignDraft } from './types';
import { TopNav, ShareBand, CookieBanner, useInViewOnce } from './components/SharedUI';
import { LandingView, RegisterView, LoginView, OTPView } from './views/AuthViews';
import { ProfileView } from './views/MainViews';
import { DashboardView, StoreManagementView } from './views/MainViews';
import { GalleryView, EditorView, GeneratingView, DownloadView } from './views/CampaignViews';
import { TermsView, PrivacyView, FaqView, LegalModal } from './views/MiscViews';
import { MOCK_TEMPLATES, ASPECT_RATIOS } from './constants';

const initialState: AppState = {
  currentView: 'landing',
  user: null,
  draft: null,
  savedCampaigns: [],
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      // Scroll to top on navigation
      window.scrollTo(0, 0);
      return { ...state, currentView: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'START_CAMPAIGN':
      // Use the first template's ratio as default, or fallback
      const firstTemplate = action.payload[0];
      const ratioId = firstTemplate?.ratioId || (firstTemplate ? (ASPECT_RATIOS.find(r => r.class === firstTemplate.ratioClass)?.id || '621x621') : '621x621');
      return { 
        ...state, 
        draft: {
          templateIds: action.payload.map(t => t.id),
          selectedSizes: [ratioId],
          artworksData: [],
          useSameDetails: true
        }
      };
    case 'UPDATE_DRAFT':
      return { ...state, draft: state.draft ? { ...state.draft, ...action.payload } : null };
    case 'LOGOUT':
      return { ...initialState };
    default:
      return state;
  }
}

/* Grounded Plum 900 Goldify Footer with a single quiet 4-strand bottom-right calligraphic gold ribbon */
const LandingFooter: React.FC<{ onNavigate: (view: ViewState) => void; onOpenLegal: () => void }> = ({ onNavigate, onOpenLegal }) => {
  const footerReveal = useInViewOnce<HTMLElement>(false, '0px 0px -6% 0px');

  return (
    <footer
      ref={footerReveal.ref}
      className={`relative overflow-hidden bg-[#381F49] border-t border-[#704287]/40 pt-12 pb-8 mt-auto ${footerReveal.inView ? 'is-inview' : ''}`}
    >
      {/* Subtle silk-plum depth + single quiet 4-strand bottom-right gold ribbon (strictly below nav links & right of copyright, 0 endpoints visible) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 110% at 35% 40%, rgba(92, 51, 118, 0.36) 0%, rgba(56, 31, 73, 0.94) 62%, rgba(36, 17, 50, 1) 100%)',
          }}
        />
        <svg
          viewBox="0 0 600 130"
          fill="none"
          overflow="visible"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 right-0 w-[180px] h-[52px] sm:w-[320px] sm:h-[82px] lg:w-[460px] lg:h-[104px] xl:w-[540px] xl:h-[114px] opacity-65 sm:opacity-75"
        >
          <defs>
            <linearGradient id="goldFootMain" x1="180" y1="180" x2="670" y2="25" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#B87212" stopOpacity="0.72" />
              <stop offset="38%" stopColor="#F2BE42" stopOpacity="0.94" />
              <stop offset="64%" stopColor="#FFF5CC" stopOpacity="1" />
              <stop offset="86%" stopColor="#DF9C26" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#A9640E" stopOpacity="0.72" />
            </linearGradient>
            <linearGradient id="goldFootSheen" x1="210" y1="180" x2="680" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F2BE42" stopOpacity="0.4" />
              <stop offset="52%" stopColor="#FFF9E4" stopOpacity="0.96" />
              <stop offset="78%" stopColor="#F2BE42" stopOpacity="0.76" />
              <stop offset="100%" stopColor="#D6921F" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="goldFootDeep" x1="150" y1="190" x2="670" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8F4F08" stopOpacity="0.65" />
              <stop offset="48%" stopColor="#DF9C26" stopOpacity="0.86" />
              <stop offset="82%" stopColor="#C47D14" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8A4A06" stopOpacity="0.65" />
            </linearGradient>
            <filter id="goldFootGlow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>

          <path
            className="bh-swirl-glow"
            d="M 190 192 C 350 142, 515 92, 685 18"
            stroke="#F2BE42"
            strokeWidth="9"
            strokeLinecap="round"
            opacity="0.07"
            filter="url(#goldFootGlow)"
          />

          {/* 4 sleek bottom-right strands — start strictly below bottom (y > 185), end strictly past right (x > 670), never touching links or copyright */}
          <path
            pathLength={100}
            className="bh-swirl-strand bh-s1"
            d="M 160 194 C 332 146, 502 94, 678 12"
            stroke="url(#goldFootDeep)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            pathLength={100}
            className="bh-swirl-strand bh-s2"
            d="M 205 192 C 366 146, 526 98, 684 34"
            stroke="url(#goldFootMain)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            pathLength={100}
            className="bh-swirl-strand bh-s3"
            d="M 250 192 C 398 148, 548 106, 688 56"
            stroke="url(#goldFootSheen)"
            strokeWidth="1.45"
            strokeLinecap="round"
          />
          <path
            pathLength={100}
            className="bh-swirl-strand bh-s4"
            d="M 298 192 C 432 152, 570 116, 692 80"
            stroke="url(#goldFootDeep)"
            strokeWidth="0.95"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2BE42] rounded-lg"
            aria-label="Goldify — Back to top"
          >
            <img
              src="/goldify-logo-full.png"
              alt="Goldify"
              className="h-14 w-auto object-contain select-none"
            />
          </button>
          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-medium" aria-label="Footer navigation">
            <button
              type="button"
              onClick={() => onNavigate('faq')}
              className="bh-link text-[#E5A9FF] hover:text-[#F2BE42] transition-colors"
            >
              FAQs
            </button>
            <button
              type="button"
              onClick={onOpenLegal}
              className="bh-link text-[#E5A9FF] hover:text-[#F2BE42] transition-colors"
            >
              Terms &amp; Privacy Policy
            </button>
          </nav>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-start">
          <p className="text-white/70 text-sm font-light">© 2024 Goldify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  // Helper functions to pass to views
  const navigate = (view: ViewState) => dispatch({ type: 'NAVIGATE', payload: view });
  const login = (user: UserProfile) => dispatch({ type: 'SET_USER', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });
  const startCampaign = (templates: Template[]) => dispatch({ type: 'START_CAMPAIGN', payload: templates });
  const updateDraft = (updates: Partial<CampaignDraft>) => dispatch({ type: 'UPDATE_DRAFT', payload: updates });
  const updateUser = (updates: Partial<UserProfile>) => dispatch({ type: 'UPDATE_USER', payload: updates });
  // 'new' = Create Account / new@demo.com (first-time user), 'returning' = Sign in (repeat user)
  const [authMode, setAuthMode] = useState<'new' | 'returning'>('returning');

  const editCampaign = (campaign: any) => {
    const template = MOCK_TEMPLATES.find(t => t.id === campaign.templateId);
    if (template) {
      dispatch({ type: 'START_CAMPAIGN', payload: [template] });
      navigate('editor'); // Go directly to editor
    }
  };

  // Get full template objects for current draft
  const getSelectedTemplates = () => {
    if (!state.draft || !state.draft.templateIds) return [];
    return state.draft.templateIds.map(id => MOCK_TEMPLATES.find(t => t.id === id)).filter(Boolean) as Template[];
  };

  const handleBackToHome = () => {
    navigate(state.user ? 'dashboard' : 'landing');
  };

  // Render the current view
  const renderView = () => {
    switch (state.currentView) {
      case 'landing':
        return <LandingView onNavigate={navigate} onLogin={login} user={state.user} />;
      case 'register':
        return <RegisterView onNavigate={navigate} onLogin={login} onSetAuthMode={setAuthMode} />;
      case 'login':
        return <LoginView onNavigate={navigate} onLogin={login} onSetAuthMode={setAuthMode} />;
      case 'otp':
        return <OTPView onNavigate={navigate} onLogin={login} authMode={authMode} />;
      case 'profile_setup':
        return state.user ? <ProfileView user={state.user} onNavigate={navigate} onUpdateUser={updateUser} /> : <LandingView onNavigate={navigate} onLogin={login} user={state.user} />;
      case 'dashboard':
        return state.user ? <DashboardView user={state.user} onNavigate={navigate} onEditCampaign={editCampaign} onSelectTemplate={startCampaign} /> : <LandingView onNavigate={navigate} onLogin={login} user={state.user} />;
      case 'store_management':
        return state.user ? <StoreManagementView user={state.user} onNavigate={navigate} onUpdateUser={updateUser} /> : <LandingView onNavigate={navigate} onLogin={login} user={state.user} />;
      case 'faq':
        return <FaqView onBack={handleBackToHome} />;
      case 'terms':
        return <TermsView onBack={handleBackToHome} />;
      case 'privacy':
        return <PrivacyView onBack={handleBackToHome} />;
      case 'gallery':
        return <GalleryView onNavigate={navigate} onSelectTemplate={startCampaign} />;
      case 'editor':
        return <EditorView 
          onNavigate={navigate} 
          selectedTemplates={getSelectedTemplates()} 
          draft={state.draft} 
          updateDraft={updateDraft}
          user={state.user}
          onUpdateUser={updateUser}
        />;
      case 'generating':
        return <GeneratingView onNavigate={navigate} />;
      case 'download':
        return <DownloadView 
          onNavigate={navigate} 
          draft={state.draft} 
          selectedTemplates={getSelectedTemplates()} 
          user={state.user}
        />;
      default:
        return <LandingView onNavigate={navigate} onLogin={login} user={state.user} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-black">
      <TopNav 
        isLoggedIn={!!state.user} 
        isLanding={state.currentView === 'landing'}
        accountLabel={state.user ? (state.user.isNewUser ? 'First-Time User' : 'Repeat User') : undefined}
        onNavigate={navigate} 
        onLogout={logout} 
      />
      <main className="flex-grow bg-white">
        {renderView()}
      </main>

      {/* Remarketing band — homepage for logged-out (landing) and logged-in (dashboard) users */}
      {(state.currentView === 'landing' || (state.currentView === 'dashboard' && state.user)) && <ShareBand />}
      
      {/* Grounded Plum 900 Goldify Brand Footer for Landing */}
      {state.currentView === 'landing' && (
        <LandingFooter onNavigate={navigate} onOpenLegal={() => setShowLegalModal(true)} />
      )}

      {showCookieBanner && (
        <CookieBanner
          onAccept={() => setShowCookieBanner(false)}
          onReject={() => setShowCookieBanner(false)}
          onOpenLegal={() => setShowLegalModal(true)}
        />
      )}

      {showLegalModal && <LegalModal onClose={() => setShowLegalModal(false)} />}
    </div>
  );
}
