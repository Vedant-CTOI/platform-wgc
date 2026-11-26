import React, { useReducer, useEffect, useState } from 'react';
import { AppState, Action, ViewState, UserProfile, Template, CampaignDraft } from './types';
import { TopNav, ShareBand } from './components/SharedUI';
import { LandingView, RegisterView, LoginView, OTPView } from './views/AuthViews';
import { ProfileView } from './views/MainViews';
import { DashboardView, StoreManagementView } from './views/MainViews';
import { GalleryView, EditorView, GeneratingView, DownloadView } from './views/CampaignViews';
import { TermsView, PrivacyView, FaqView } from './views/MiscViews';
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

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
        accountLabel={state.user ? (state.user.isNewUser ? 'First-time user' : 'Repeat user') : undefined}
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
        <footer className="bg-[#381F49] border-t border-[#704287]/40 pt-12 pb-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8">
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2BE42] rounded-lg"
                aria-label="Goldify — Back to top"
              >
                <img
                  src="/goldify-logo-full.png"
                  alt="Goldify — Gold the moment"
                  className="h-14 w-auto object-contain select-none"
                />
              </button>
              <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold" aria-label="Footer navigation">
                <button
                  type="button"
                  onClick={() => navigate('faq')}
                  className="bh-link text-[#E5A9FF] hover:text-[#F2BE42] transition-colors"
                >
                  FAQs
                </button>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('terms'); }}
                  className="bh-link text-[#E5A9FF] hover:text-[#F2BE42] transition-colors"
                >
                  Terms
                </a>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate('privacy'); }}
                  className="bh-link text-[#E5A9FF] hover:text-[#F2BE42] transition-colors"
                >
                  Privacy
                </a>
              </nav>
            </div>
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-white/70 text-sm">© 2024 Goldify. All rights reserved.</p>
              <p className="text-[#F2BE42]/85 text-xs font-bold uppercase tracking-[0.2em]">Gold the moment.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
