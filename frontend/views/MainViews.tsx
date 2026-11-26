import React, { useState, useRef } from 'react';
import { Button, PageHeader, Input, AddressFields, NoticeModal } from '../components/SharedUI';
import { ViewState, UserProfile, StoreInfo, Template } from '../types';
import { Plus, Image as ImageIcon, Clock, MoreVertical, Download, Heart, Trash2, Edit2, UploadCloud, AlertTriangle, CheckCircle2, X, Loader2, Check, Eye, Sparkles, ChevronDown, ArrowRight } from 'lucide-react';
import { ASPECT_RATIOS, MAX_CREATIVES_PER_SESSION, CATEGORIES, MEDIA_GROUPS, getRatioDisplayLabel } from '../constants';
import { GalleryView } from './CampaignViews';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
  onEditCampaign: (campaign: any) => void;
  onSelectTemplate: (templates: Template[]) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({ user, onNavigate, onEditCampaign, onSelectTemplate }) => {
  // Mock saved campaigns with official Base Creatives (first-time users start with none)
  const [savedCampaigns, setSavedCampaigns] = useState(user.isNewUser ? [] : [
    { id: 'c1', name: 'Diwali Special', date: 'Oct 24, 2023', thumbnail: '/creatives/full-page-diwali.jpg', category: 'Festive', templateId: 't1', ratioId: '610x794', ratioClass: 'aspect-[610/794]' },
    { id: 'c2', name: 'Wedding Collection', date: 'Oct 22, 2023', thumbnail: '/creatives/half-page-wedding.jpg', category: 'Wedding', templateId: 't2', ratioId: '936x709', ratioClass: 'aspect-[936/709]' },
    { id: 'c3', name: 'Concert Tickets', date: 'Oct 15, 2023', thumbnail: '/creatives/social-media-concert.jpg', category: 'Everyday', templateId: 't3', ratioId: '621x621', ratioClass: 'aspect-square' },
    { id: 'c4', name: 'Office Supplies', date: 'Oct 10, 2023', thumbnail: '/creatives/poster-office.jpg', category: 'Minimalist', templateId: 't4', ratioId: '610x794', ratioClass: 'aspect-[610/794]' },
    { id: 'c5', name: 'Diwali Gifts', date: 'Oct 05, 2023', thumbnail: '/creatives/social-media-diwali.jpg', category: 'Festive', templateId: 't5', ratioId: '621x621', ratioClass: 'aspect-square' },
    { id: 'c6', name: 'Wedding Decor', date: 'Oct 01, 2023', thumbnail: '/creatives/half-page-wedding.jpg', category: 'Wedding', templateId: 't6', ratioId: '936x709', ratioClass: 'aspect-[936/709]' },
    { id: 'c7', name: 'Music Festival', date: 'Sep 28, 2023', thumbnail: '/creatives/full-page-concert.jpg', category: 'Everyday', templateId: 't7', ratioId: '610x794', ratioClass: 'aspect-[610/794]' },
    { id: 'c8', name: 'Corporate Event', date: 'Sep 25, 2023', thumbnail: '/creatives/half-page-office.jpg', category: 'Minimalist', templateId: 't8', ratioId: '936x709', ratioClass: 'aspect-[936/709]' },
  ]);
  const hasNoCreatives = savedCampaigns.length === 0;
  const [showSelectLimit, setShowSelectLimit] = useState(false);
  // Repeat users open directly on the Templates gallery tab, with Your Recent campaigns one click away
  const [activeTab, setActiveTab] = useState<'templates' | 'campaigns'>('templates');

  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Multi-select state
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'digital' | 'print'>('digital');
  const [previewCampaign, setPreviewCampaign] = useState<any | null>(null);

  const toggleFilter = (category: string) => {
    setActiveFilter(prev => prev === category ? null : category);
  };

  const [sizeFilter, setSizeFilter] = useState<string>('All');
  const filteredCampaigns = savedCampaigns.filter(c =>
    (!activeFilter || c.category === activeFilter) && (sizeFilter === 'All' || c.ratioId === sizeFilter)
  );
  const sizeFilterName = sizeFilter === 'All' ? undefined : getRatioDisplayLabel(sizeFilter);
  const filterLabel = [activeFilter, sizeFilterName].filter(Boolean).join(' · ');

  const handleDownload = (e: React.MouseEvent, campaignName: string) => {
    e.stopPropagation();
    alert(`Downloading ${campaignName} as a ZIP file...`);
  };

  const handleDelete = (id: string) => {
    setSavedCampaigns(prev => prev.filter(c => c.id !== id));
    setOpenMenuId(null);
  };


  const toggleSelectMode = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedCampaignIds([]);
    setOpenMenuId(null);
  };

  const handleCardClick = (campaign: any) => {
    if (isSelectMode) {
      if (!selectedCampaignIds.includes(campaign.id) && selectedCampaignIds.length >= 3) {
        setShowSelectLimit(true);
        return;
      }
      setSelectedCampaignIds(prev =>
        prev.includes(campaign.id)
          ? prev.filter(id => id !== campaign.id)
          : [...prev, campaign.id]
      );
    } else {
      setPreviewCampaign(campaign);
    }
  };

  const confirmBulkDownload = () => {
    alert(`Downloading ${selectedCampaignIds.length} campaigns as a ${downloadFormat.toUpperCase()} ZIP file...`);
    setShowDownloadModal(false);
    setIsSelectMode(false);
    setSelectedCampaignIds([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white" onClick={() => setOpenMenuId(null)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-black">{user.isNewUser ? 'Welcome' : `Welcome back, ${user.businessName}`}</h1>
          <p className="text-[#634B6F] mt-1">Ready to create your next promotion?</p>
        </div>
        {(user.isNewUser || activeTab === 'campaigns') && (
          <Button
            variant="gold"
            size="lg"
            onClick={() => user.isNewUser ? onNavigate('gallery') : setActiveTab('templates')}
            className="group w-full sm:w-auto px-7 shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>Create New Campaign</span>
          </Button>
        )}
      </div>

      {/* Repeat user top tabs: Templates (Gallery, default on login) & Your Recent campaigns */}
      {!user.isNewUser && (
        <div className="border-b border-[#E6E9ED] mb-6">
          <nav className="flex space-x-8" aria-label="Dashboard tabs">
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`pb-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-[#704287] text-[#381F49]'
                  : 'border-transparent text-[#634B6F] hover:text-[#381F49] hover:border-[#634B6F]/40'
              }`}
            >
              Templates
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('campaigns')}
              className={`pb-3.5 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'campaigns'
                  ? 'border-[#704287] text-[#381F49]'
                  : 'border-transparent text-[#634B6F] hover:text-[#381F49] hover:border-[#634B6F]/40'
              }`}
            >
              Your Recent campaigns ({savedCampaigns.length})
            </button>
          </nav>
        </div>
      )}

      {!user.isNewUser && activeTab === 'templates' ? (
        <GalleryView embedded onNavigate={onNavigate} onSelectTemplate={onSelectTemplate} />
      ) : (
        <>
          {/* Occasion + Size filters (shown to all users) */}
          <div className="mb-8 flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <select
                value={activeFilter || 'All'}
                onChange={(e) => setActiveFilter(e.target.value === 'All' ? null : e.target.value)}
                className="appearance-none w-full pl-4 pr-11 py-3 min-h-[46px] border border-[#634B6F]/40 rounded-lg focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none text-sm font-medium text-black bg-white cursor-pointer hover:border-[#704287]/70 transition-colors"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Occasions' : cat}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#634B6F] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <div className="relative w-full sm:w-64">
              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="appearance-none w-full pl-4 pr-11 py-3 min-h-[46px] border border-[#634B6F]/40 rounded-lg focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none text-sm font-medium text-black bg-white cursor-pointer hover:border-[#704287]/70 transition-colors"
              >
                <option value="All">All Sizes</option>
                {MEDIA_GROUPS.map(group => (
                  <optgroup key={group} label={group}>
                    {ASPECT_RATIOS.filter(r => r.group === group).map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#634B6F] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">
                Your Recent campaigns {filterLabel && <span className="text-[#704287] font-semibold text-lg ml-2">({filterLabel})</span>}
              </h2>
              <div className="flex items-center gap-3">
                {filterLabel && (
                  <button onClick={() => { setActiveFilter(null); setSizeFilter('All'); }} className="bh-link text-sm font-semibold text-[#704287] hover:text-[#381F49]">
                    Clear filter
                  </button>
                )}
                {filteredCampaigns.length > 0 && (
                  <Button variant={isSelectMode ? "secondary" : "outline"} size="sm" onClick={toggleSelectMode}>
                    {isSelectMode ? 'Cancel Selection' : 'Select'}
                  </Button>
                )}
              </div>
            </div>

            {hasNoCreatives ? (
              /* Central CTA for users who haven't created any creatives yet */
              <div className="bg-[#ECE9ED]/50 rounded-2xl border border-[#E6E9ED] shadow-sm px-6 py-16 sm:py-24 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-[#381F49] text-[#F2BE42] rounded-full flex items-center justify-center mb-5 shadow-sm">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-light text-black mb-2">Create your first creative</h3>
                <p className="text-[#634B6F] max-w-md mx-auto mb-8">
                  Pick a template, add your store details and generate ready-to-use creatives in minutes.
                </p>
                <Button variant="gold" size="lg" onClick={() => onNavigate('gallery')} className="px-8 shadow-md">
                  <Plus className="w-5 h-5 mr-2" /> Create New Campaign
                </Button>
              </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
                {filteredCampaigns.map((campaign) => {
                  const isSelected = selectedCampaignIds.includes(campaign.id);
                  return (
                    <div
                      key={campaign.id}
                      className={`break-inside-avoid mb-6 bg-white rounded-xl border shadow-sm overflow-hidden group transition-all cursor-pointer flex flex-col ${isSelectMode && isSelected ? 'border-[#704287] ring-2 ring-[#704287]' : 'border-[#E6E9ED] hover:shadow-md hover:border-[#634B6F]/40'}`}
                      onClick={() => handleCardClick(campaign)}
                    >
                      <div className={`${campaign.ratioClass} bg-[#F6F3F8] relative overflow-hidden flex items-center justify-center`}>
                        <img src={campaign.thumbnail} alt={campaign.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />

                        {/* Selection Checkmark */}
                        {isSelectMode && (
                          <div className="absolute top-3 left-3 z-20">
                            {isSelected ? (
                              <div className="w-6 h-6 bg-[#381F49] rounded-full flex items-center justify-center shadow-sm">
                                <Check className="w-4 h-4 text-[#F2BE42]" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-white/80 border-2 border-[#634B6F]/50 rounded-full shadow-sm backdrop-blur-sm" />
                            )}
                          </div>
                        )}

                        {/* Hover Actions - Only show if NOT in select mode */}
                        {!isSelectMode && (
                          <div className="absolute inset-0 bg-[#381F49]/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              className="p-2 bg-white text-[#381F49] rounded-full hover:bg-[#ECE9ED] transition-colors"
                              title="Preview"
                              onClick={(e) => { e.stopPropagation(); setPreviewCampaign(campaign); }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 bg-[#381F49] text-[#F2BE42] rounded-full hover:bg-[#704287] transition-colors"
                              title="Download"
                              onClick={(e) => handleDownload(e, campaign.name)}
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex justify-between items-center relative mt-auto border-t border-[#E6E9ED] bg-white">
                        <div>
                          <h3 className="font-semibold text-black text-sm">{campaign.name}</h3>
                          <p className="text-xs text-[#634B6F] mt-0.5">{getRatioDisplayLabel(campaign.ratioId, campaign.ratioClass)}</p>
                          <p className="text-xs text-[#634B6F]/70 mt-0.5">By {user.name || 'User'} • {campaign.date}</p>
                        </div>

                        {!isSelectMode && (
                          <button
                            className="text-[#634B6F] hover:text-[#381F49] p-1 rounded-md hover:bg-[#ECE9ED]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === campaign.id ? null : campaign.id);
                            }}
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        )}

                        {/* Dropdown Menu */}
                        {openMenuId === campaign.id && !isSelectMode && (
                          <div className="absolute right-4 bottom-12 w-48 bg-white rounded-lg shadow-xl border border-[#E6E9ED] py-1 z-10" onClick={e => e.stopPropagation()}>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                              onClick={() => handleDelete(campaign.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete campaign
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#ECE9ED]/50 rounded-2xl border border-dashed border-[#634B6F]/40 p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-[#E6E9ED]">
                  <Clock className="w-8 h-8 text-[#704287]" />
                </div>
                <h3 className="text-lg font-semibold text-black mb-2">No campaigns found</h3>
                <p className="text-[#634B6F] max-w-sm mx-auto mb-6">
                  {filterLabel ? `You haven't created any ${filterLabel} campaigns yet.` : "You haven't created any promotional materials yet."}
                </p>
                <Button onClick={() => user.isNewUser ? onNavigate('gallery') : setActiveTab('templates')}>Browse Templates</Button>
              </div>
            )}
          </div>
        </>
      )}

      {showSelectLimit && (
        <NoticeModal
          title="Selection Limit"
          message={`Only ${MAX_CREATIVES_PER_SESSION} can be selected. Please deselect to add more.`}
          onClose={() => setShowSelectLimit(false)}
        />
      )}

      {/* Floating Action Bar for Bulk Download — Plum 900 bar + homepage Gold-on-Plum standout CTA */}
      {(user.isNewUser || activeTab === 'campaigns') && isSelectMode && selectedCampaignIds.length > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-[#381F49] text-white px-6 py-3.5 rounded-full shadow-2xl border border-[#704287]/60 flex items-center gap-6 z-50">
          <span className="font-semibold text-sm whitespace-nowrap">{selectedCampaignIds.length} selected</span>
          <Button
            variant="gold-dark"
            size="sm"
            onClick={() => setShowDownloadModal(true)}
            className="whitespace-nowrap px-5"
          >
            <Download className="w-4 h-4 mr-2" /> Download Selected
          </Button>
        </div>
      )}

      {/* Bulk Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
              <h3 className="font-semibold text-[#381F49]">Download Campaigns</h3>
              <button onClick={() => setShowDownloadModal(false)} className="p-1 text-[#634B6F] hover:text-[#381F49] rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-[#634B6F] mb-6 text-sm">Choose your preferred format for the {selectedCampaignIds.length} selected campaigns.</p>

              <div className="space-y-3 mb-8">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${downloadFormat === 'digital' ? 'border-[#704287] bg-[#ECE9ED]/70' : 'border-[#E6E9ED] hover:bg-[#ECE9ED]/40'}`}>
                  <input type="radio" name="bulkFormat" checked={downloadFormat === 'digital'} onChange={() => setDownloadFormat('digital')} className="text-[#381F49] focus:ring-[#704287] h-4 w-4" />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-black">Digital Use (PNG)</span>
                    <span className="block text-xs text-[#634B6F] mt-0.5">Best for social media and web</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${downloadFormat === 'print' ? 'border-[#704287] bg-[#ECE9ED]/70' : 'border-[#E6E9ED] hover:bg-[#ECE9ED]/40'}`}>
                  <input type="radio" name="bulkFormat" checked={downloadFormat === 'print'} onChange={() => setDownloadFormat('print')} className="text-[#381F49] focus:ring-[#704287] h-4 w-4" />
                  <div className="ml-3">
                    <span className="block text-sm font-semibold text-black">Print Ready (PDF)</span>
                    <span className="block text-xs text-[#634B6F] mt-0.5">High resolution for physical printing</span>
                  </div>
                </label>
              </div>

              <Button fullWidth size="lg" onClick={confirmBulkDownload}>
                <Download className="w-4 h-4 mr-2" /> Download ZIP
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewCampaign && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewCampaign(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewCampaign(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl">
              <div className={`${previewCampaign.ratioClass} relative`}>
                <img src={previewCampaign.thumbnail} alt={previewCampaign.name} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
            <div className="mt-6 flex space-x-4">
              <Button variant="outline" onClick={() => setPreviewCampaign(null)}>Close</Button>
              <Button variant="gold" onClick={(e) => { handleDownload(e, previewCampaign.name); setPreviewCampaign(null); }}><Download className="w-4 h-4 mr-2" /> Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StoreManagementProps {
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const StoreManagementView: React.FC<StoreManagementProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [stores, setStores] = useState<StoreInfo[]>(user.stores || []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [profanityResult, setProfanityResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [activeLogoStoreId, setActiveLogoStoreId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStore = () => {
    setStores([...stores, { id: `s${Date.now()}`, name: '', address: '', contactNumber: '', logoUrl: '' }]);
  };

  const handleRemoveStore = (idToRemove: string) => {
    if (stores.length > 1) {
      setStores(stores.filter(s => s.id !== idToRemove));
    }
  };

  const handleStoreChange = (id: string, field: keyof StoreInfo, value: string) => {
    setStores(stores.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    onUpdateUser({ stores });
    onNavigate('dashboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImage(url);
      setProfanityResult('idle');
      setIsChecking(true);

      // Simulate AI Profanity / Content Check
      setTimeout(() => {
        setIsChecking(false);
        // Mock logic: fail if filename contains 'bad' or 'nsfw', otherwise pass
        if (file.name.toLowerCase().includes('bad') || file.name.toLowerCase().includes('nsfw')) {
          setProfanityResult('failed');
        } else {
          setProfanityResult('passed');
        }
      }, 2000);
    }
  };

  const confirmUpload = () => {
    if (profanityResult === 'passed' && tempImage && activeLogoStoreId) {
      handleStoreChange(activeLogoStoreId, 'logoUrl', tempImage);
      setIsModalOpen(false);
      setTempImage(null);
      setProfanityResult('idle');
      setActiveLogoStoreId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
    setProfanityResult('idle');
    setActiveLogoStoreId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <PageHeader title="Store Management" onBack={() => onNavigate('dashboard')} />

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E6E9ED]">
        <p className="text-[#634B6F] mb-6">Manage the store details that will be available to auto-fill in your campaigns.</p>

        <div className="space-y-6">
          {stores.length === 0 && (
            <div className="p-6 bg-[#ECE9ED]/55 rounded-lg border border-[#E6E9ED] text-center text-sm text-[#634B6F]">
              No saved stores yet. Stores you save while creating a creative will appear here.
            </div>
          )}
          {stores.map((store, index) => (
            <div key={store.id} className="p-4 bg-[#ECE9ED]/55 rounded-lg border border-[#E6E9ED] relative">
              {stores.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveStore(store.id)}
                  className="absolute top-2 right-2 p-1 text-[#634B6F] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <h4 className="text-xs font-bold text-[#704287] uppercase tracking-wider mb-3">Store {index + 1}</h4>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-black mb-2">Store Logo</label>
                <div className="flex items-center gap-4">
                  {store.logoUrl ? (
                    <img src={store.logoUrl} alt="Store Logo" className="h-16 w-16 object-cover rounded-full shadow-sm border border-[#E6E9ED]" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-white border border-[#E6E9ED] flex items-center justify-center shadow-sm">
                      <ImageIcon className="w-6 h-6 text-[#634B6F]" />
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={() => { setActiveLogoStoreId(store.id); setIsModalOpen(true); }}>
                    {store.logoUrl ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                </div>
              </div>

              <Input
                label="Store Name"
                placeholder="e.g. Sharma Electronics"
                value={store.name}
                onChange={(e) => handleStoreChange(store.id, 'name', e.target.value)}
                required
              />
              <AddressFields
                line1={store.address}
                landmark={store.landmark}
                city={store.city}
                onChange={(f, v) => handleStoreChange(store.id, f === 'line1' ? 'address' : f, v)}
              />
              <Input
                label="Store Contact Number"
                placeholder="e.g. 98765 43210"
                value={store.contactNumber}
                onChange={(e) => handleStoreChange(store.id, 'contactNumber', e.target.value)}
                required
              />
              <Input
                label="Retailer URL (Optional)"
                placeholder="e.g. www.yourstore.com"
                value={store.retailerUrl || ''}
                onChange={(e) => handleStoreChange(store.id, 'retailerUrl', e.target.value)}
                maxLength={40}
              />
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          fullWidth
          className="mt-6 border-dashed"
          onClick={handleAddStore}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Another Store
        </Button>

        {stores.length > 0 && (
          <p className="text-xs text-[#634B6F] mt-4">* Mandatory fields</p>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Upload & Profanity Check Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
              <h3 className="font-semibold text-[#381F49]">Upload Store Logo</h3>
              <button onClick={closeModal} className="p-1 text-[#634B6F] hover:text-[#381F49] rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              {!tempImage ? (
                <>
                  <div className="w-20 h-20 bg-[#ECE9ED] text-[#381F49] rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-center text-[#634B6F] mb-6">Select an image from your device gallery to use as your store logo.</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} fullWidth>
                    Choose from Gallery
                  </Button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-6">
                    <img src={tempImage} alt="Preview" className="w-full h-full object-cover rounded-full shadow-md border-4 border-white" />
                    {isChecking && (
                      <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-[#381F49] animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Status Area */}
                  <div className="w-full min-h-[80px] flex flex-col items-center justify-center text-center mb-4">
                    {isChecking && (
                      <div className="text-[#381F49] flex flex-col items-center">
                        <p className="font-semibold">Analyzing image...</p>
                        <p className="text-xs text-[#634B6F] mt-1">Checking for inappropriate content</p>
                      </div>
                    )}

                    {profanityResult === 'passed' && (
                      <div className="text-[#00323C] flex flex-col items-center bg-[#40DDB1]/20 w-full p-3 rounded-lg border border-[#40DDB1]/50">
                        <CheckCircle2 className="w-6 h-6 mb-1" />
                        <p className="font-semibold text-sm">Image approved!</p>
                        <p className="text-xs text-[#00323C]/90 mt-0.5">Looks great and meets our guidelines.</p>
                      </div>
                    )}

                    {profanityResult === 'failed' && (
                      <div className="text-red-600 flex flex-col items-center bg-red-50 w-full p-3 rounded-lg border border-red-100">
                        <AlertTriangle className="w-6 h-6 mb-1" />
                        <p className="font-semibold text-sm">Image rejected</p>
                        <p className="text-xs text-red-700 mt-0.5">This image violates our content guidelines. Please choose another.</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => {
                      setTempImage(null);
                      setProfanityResult('idle');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      Try Another
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={profanityResult !== 'passed'}
                      onClick={confirmUpload}
                    >
                      Use Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- My Account (Profile) View ---
interface ProfileProps {
  user: UserProfile;
  onNavigate: (view: ViewState) => void;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileProps> = ({ user, onNavigate, onUpdateUser }) => {
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [mobile, setMobile] = useState(user.mobile || '');
  const [gst, setGst] = useState(user.gst || '');
  const [businessName, setBusinessName] = useState(user.businessName || '');
  const [stores, setStores] = useState<StoreInfo[]>(user.stores || []);

  // Logo upload state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [profanityResult, setProfanityResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [activeLogoStoreId, setActiveLogoStoreId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddStore = () => {
    setStores([...stores, { id: `s${Date.now()}`, name: '', address: '', contactNumber: '', logoUrl: '' }]);
  };

  const handleRemoveStore = (idToRemove: string) => {
    if (stores.length > 1) {
      setStores(stores.filter(s => s.id !== idToRemove));
    }
  };

  const handleStoreChange = (id: string, field: keyof StoreInfo, value: string) => {
    setStores(stores.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    onUpdateUser({ name, email, mobile, gst, businessName, stores });
    onNavigate('dashboard');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImage(url);
      setProfanityResult('idle');
      setIsChecking(true);
      setTimeout(() => {
        setIsChecking(false);
        if (file.name.toLowerCase().includes('bad') || file.name.toLowerCase().includes('nsfw')) {
          setProfanityResult('failed');
        } else {
          setProfanityResult('passed');
        }
      }, 2000);
    }
  };

  const confirmUpload = () => {
    if (profanityResult === 'passed' && tempImage && activeLogoStoreId) {
      handleStoreChange(activeLogoStoreId, 'logoUrl', tempImage);
      setIsModalOpen(false);
      setTempImage(null);
      setProfanityResult('idle');
      setActiveLogoStoreId(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
    setProfanityResult('idle');
    setActiveLogoStoreId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white">
      <PageHeader title="My Account" onBack={() => onNavigate('dashboard')} />

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E6E9ED]">
        <h3 className="text-xs font-bold text-[#381F49] uppercase tracking-wider mb-4">Your Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="GST Number" value={gst} onChange={(e) => setGst(e.target.value)} />
          <Input label="Business Name" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
        </div>

        <div className="border-t border-[#E6E9ED] pt-6 mt-6">
          <h3 className="text-xs font-bold text-[#381F49] uppercase tracking-wider mb-4">Store Details</h3>
          <div className="space-y-6">
            {stores.length === 0 && (
              <div className="p-6 bg-[#ECE9ED]/55 rounded-xl border border-[#E6E9ED] text-center text-sm text-[#634B6F]">
                No saved stores yet. Stores you save while creating a creative will appear here.
              </div>
            )}
            {stores.map((store, index) => (
              <div key={store.id} className="p-5 bg-[#ECE9ED]/55 rounded-xl border border-[#E6E9ED] relative">
                {stores.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStore(store.id)}
                    className="absolute top-3 right-3 p-1.5 text-[#634B6F] hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <h4 className="text-xs font-bold text-[#704287] uppercase tracking-wider mb-4">Store {index + 1}</h4>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-black mb-2">Store Logo</label>
                  <div className="flex items-center gap-4">
                    {store.logoUrl ? (
                      <img src={store.logoUrl} alt="Store Logo" className="h-16 w-16 object-cover rounded-full shadow-sm border border-[#E6E9ED]" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-white border border-[#E6E9ED] flex items-center justify-center shadow-sm">
                        <ImageIcon className="w-6 h-6 text-[#634B6F]" />
                      </div>
                    )}
                    <Button variant="outline" size="sm" onClick={() => { setActiveLogoStoreId(store.id); setIsModalOpen(true); }}>
                      {store.logoUrl ? 'Change Logo' : 'Upload Logo'}
                    </Button>
                  </div>
                </div>

                <Input
                  label="Store Name"
                  placeholder="e.g. Sharma Electronics"
                  value={store.name}
                  onChange={(e) => handleStoreChange(store.id, 'name', e.target.value)}
                />
                <AddressFields
                  line1={store.address}
                  landmark={store.landmark}
                  city={store.city}
                  onChange={(f, v) => handleStoreChange(store.id, f === 'line1' ? 'address' : f, v)}
                />
                <Input
                  label="Store Contact Number"
                  placeholder="e.g. 98765 43210"
                  value={store.contactNumber}
                  onChange={(e) => handleStoreChange(store.id, 'contactNumber', e.target.value)}
                />
                <Input
                  label="Retailer URL (Optional)"
                  placeholder="e.g. www.yourstore.com"
                  value={store.retailerUrl || ''}
                  onChange={(e) => handleStoreChange(store.id, 'retailerUrl', e.target.value)}
                  maxLength={40}
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            fullWidth
            className="mt-6 border-dashed"
            onClick={handleAddStore}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Another Store
          </Button>
        </div>

        {stores.length > 0 && (
          <p className="text-xs text-[#634B6F] mt-4">* Mandatory fields</p>
        )}

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>

      {/* Upload & Content Check Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
              <h3 className="font-semibold text-[#381F49]">Upload Store Logo</h3>
              <button onClick={closeModal} className="p-1 text-[#634B6F] hover:text-[#381F49] rounded-full hover:bg-black/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col items-center">
              {!tempImage ? (
                <>
                  <div className="w-20 h-20 bg-[#ECE9ED] text-[#381F49] rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-center text-[#634B6F] mb-6">Select an image from your device gallery to use as your store logo.</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} fullWidth>
                    Choose from Gallery
                  </Button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-6">
                    <img src={tempImage} alt="Preview" className="w-full h-full object-cover rounded-full shadow-md border-4 border-white" />
                    {isChecking && (
                      <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-[#381F49] animate-spin" />
                      </div>
                    )}
                  </div>
                  {isChecking ? (
                    <p className="text-xs text-[#634B6F] mt-1">Checking image content...</p>
                  ) : profanityResult === 'passed' ? (
                    <div className="flex items-center text-[#00323C] mb-4">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <p className="text-sm font-semibold">Image looks good</p>
                    </div>
                  ) : (
                    <div className="flex items-start text-red-600 mb-4 max-w-xs">
                      <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold">This image was flagged by our content check. Please choose a different image.</p>
                    </div>
                  )}
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" fullWidth onClick={() => { setTempImage(null); setProfanityResult('idle'); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                      Choose Different
                    </Button>
                    <Button fullWidth onClick={confirmUpload} disabled={profanityResult !== 'passed'}>
                      Use This Logo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
