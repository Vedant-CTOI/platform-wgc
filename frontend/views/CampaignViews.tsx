import React, { useState, useEffect, useRef } from 'react';
import { Button, PageHeader, Input, AddressFields, NoticeModal } from '../components/SharedUI';
import { ViewState, Template, CampaignDraft, UserProfile, StoreInfo, PreviewData } from '../types';
import { MOCK_TEMPLATES, CATEGORIES, CATEGORY_BADGE_STYLES, ASPECT_RATIOS, MEDIA_GROUPS, MAX_CREATIVES_PER_SESSION, formatAddress, getRatioDisplayLabel } from '../constants';
import { Search, Filter, Download, Share2, Copy, Check, Loader2, Image as ImageIcon, MapPin, Phone, Globe, X, ChevronLeft, ChevronRight, ChevronDown, ArrowRight, UploadCloud, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

interface FlowProps {
  onNavigate: (view: ViewState) => void;
  onSelectTemplate?: (t: Template[]) => void;
  selectedTemplates?: Template[];
  selectedTemplate?: Template | null;
  draft?: CampaignDraft | null;
  updateDraft?: (updates: Partial<CampaignDraft>) => void;
  user?: UserProfile | null;
  onUpdateUser?: (updates: Partial<UserProfile>) => void;
  embedded?: boolean;
}

const GRAY_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Cpath d='M50 40a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-20 30l15-20 10 10 20-25 15 35H30z' fill='%239ca3af'/%3E%3C/svg%3E";

// Keeps tall formats (e.g. standees) inside the preview stage by capping width from available height
const stageStyle = (ratioClass?: string): React.CSSProperties => {
  const m = (ratioClass || '').match(/aspect-\[(\d+)\/(\d+)\]/);
  const ratio = m ? Number(m[1]) / Number(m[2]) : 1;
  return { maxWidth: `min(28rem, calc((100vh - 22rem) * ${ratio}))`, marginLeft: 'auto', marginRight: 'auto' };
};

// --- Shared Canvas Preview Component ---
const CanvasPreview: React.FC<{ template: Template, data: PreviewData, ratioClass?: string, isMini?: boolean }> = ({ template, data, ratioClass = 'aspect-[4/5]', isMini = false }) => {

  // Adjust scale based on aspect ratio to keep text balanced within the available vertical space
  let scale = 1;
  if (ratioClass === 'aspect-video') scale = 0.65; // 16:9 (Wide) - needs smaller text relative to width
  if (ratioClass === 'aspect-[9/16]') scale = 1.3; // 9:16 (Tall) - needs larger text relative to width
  if (ratioClass === 'aspect-[4/5]') scale = 1.1;  // 4:5 (Portrait)
  if (ratioClass === 'aspect-[610/794]') scale = 1.15; // Full Page
  if (ratioClass === 'aspect-[936/709]') scale = 0.8; // Half Page
  if (ratioClass === 'aspect-[468/709]') scale = 1.2; // Quarter Page
  if (ratioClass === 'aspect-[1/2]') scale = 1.35; // Outdoor 1:2 & Standee
  if (ratioClass === 'aspect-[2/1]') scale = 0.55; // Outdoor 2:1
  if (ratioClass === 'aspect-[19/14]') scale = 0.85; // Poster (19x14 in)

  const displayLogo = data.logoUrl;
  const hasFooterInfo = Boolean(data.storeAddress || data.contactNumber || data.retailerUrl);

  return (
    <div
      className={`w-full ${ratioClass} ${isMini ? 'rounded-md' : 'rounded-lg sm:rounded-xl'} shadow-lg overflow-hidden relative flex flex-col bg-[#381F49]`}
      style={{ containerType: 'inline-size' }}
    >
      {/* Full-bleed official Base Creative background */}
      <img
        src={template.thumbnail}
        alt={template.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      {/* Header / Retailer Logo badge */}
      <div className="relative z-10 flex justify-between items-start shrink-0" style={{ padding: `${3.5 * scale}cqi` }}>
        {displayLogo ? (
          <img
            src={displayLogo}
            alt="Store Logo"
            className="rounded-full bg-white/95 object-cover shadow-md border border-white/80"
            style={{ width: `${12 * scale}cqi`, height: `${12 * scale}cqi` }}
          />
        ) : (
          <div
            className="rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-sm border border-[#381F49]/15"
            style={{ width: `${11 * scale}cqi`, height: `${11 * scale}cqi` }}
          >
            <ImageIcon className="text-[#634B6F]" style={{ width: `${4.5 * scale}cqi`, height: `${4.5 * scale}cqi` }} />
          </div>
        )}
      </div>

      {/* Spacer keeps artwork completely unobstructed in the center */}
      <div className="flex-grow min-h-0" />

      {/* Custom Uploaded Jewelry Inset (only overlays when retailer uploads a piece, otherwise the creative's own inset shines) */}
      {data.jewelryImageUrl && (
        <div
          className="absolute bg-white/95 backdrop-blur-sm rounded-full shadow-lg border-2 border-[#F2BE42] z-10 flex items-center justify-center overflow-hidden"
          style={{
            bottom: `${12 * scale}cqi`,
            right: `${4 * scale}cqi`,
            width: `${16 * scale}cqi`,
            height: `${16 * scale}cqi`
          }}
        >
          <img src={data.jewelryImageUrl} alt="Jewelry piece" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Footer / Store Contact overlay strip — matches the official creative's clean white retailer footer band */}
      {hasFooterInfo && (
        <div
          className="relative z-10 flex flex-col sm:flex-row justify-center items-center font-semibold text-[#381F49] bg-white/95 backdrop-blur-sm border-t border-[#E6E9ED] shrink-0"
          style={{ padding: `${2.8 * scale}cqi ${3.5 * scale}cqi`, gap: `${2 * scale}cqi`, fontSize: `${2.5 * scale}cqi` }}
        >
          {data.storeAddress && (
            <div className="flex items-center truncate max-w-full">
              <MapPin className="mr-1 flex-shrink-0 text-[#704287]" style={{ width: `${3 * scale}cqi`, height: `${3 * scale}cqi` }} />
              <span className="truncate">{formatAddress(data.storeAddress, data.landmark, data.city)}</span>
            </div>
          )}
          {data.contactNumber && (
            <div className="flex items-center flex-shrink-0">
              <Phone className="mr-1 text-[#704287]" style={{ width: `${3 * scale}cqi`, height: `${3 * scale}cqi` }} />
              {data.contactNumber}
            </div>
          )}
          {data.retailerUrl && (
            <div className="flex items-center flex-shrink-0">
              <Globe className="mr-1 text-[#704287]" style={{ width: `${3 * scale}cqi`, height: `${3 * scale}cqi` }} />
              {data.retailerUrl}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- 1. Gallery View ---
export const GalleryView: React.FC<FlowProps> = ({ onNavigate, onSelectTemplate, embedded = false }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRatioFilter, setActiveRatioFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  // Multi-select state for templates
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  // Non-interruptive top notification for selection count (auto-hides)
  const [selectionNotice, setSelectionNotice] = useState<number | null>(null);
  const [noticeVisible, setNoticeVisible] = useState(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showSelectionNotice = (count: number) => {
    setSelectionNotice(count);
    setNoticeVisible(true);
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNoticeVisible(false), 2500);
  };
  useEffect(() => () => { if (noticeTimer.current) clearTimeout(noticeTimer.current); }, []);

  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRatio = activeRatioFilter === 'All' || t.ratioId === activeRatioFilter;
    return matchesCat && matchesSearch && matchesRatio;
  });

  const handleTemplateSelect = (template: Template) => {
    const isSelected = selectedTemplates.some(t => t.id === template.id);

    if (isSelected) {
      setSelectedTemplates(prev => prev.filter(t => t.id !== template.id));
      setShowLimitAlert(false);
      showSelectionNotice(selectedTemplates.length - 1);
    } else {
      if (selectedTemplates.length >= MAX_CREATIVES_PER_SESSION) {
        setShowLimitAlert(true);
      } else {
        setSelectedTemplates(prev => [...prev, template]);
        showSelectionNotice(selectedTemplates.length + 1);
      }
    }
  };

  const handleContinue = () => {
    if (selectedTemplates.length > 0 && onSelectTemplate) {
      onSelectTemplate(selectedTemplates);
      onNavigate('editor');
    }
  };

  return (
    <div className={embedded ? 'relative' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative'}>

      {/* Selection notification — non-interruptive, top of screen, auto-hides */}
      {selectionNotice !== null && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm pointer-events-none transition-all duration-300 ${noticeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          <div className="bg-[#282828] text-white border border-[#F2BE42]/40 px-4 py-3 rounded-xl shadow-2xl flex items-center justify-center text-sm font-medium">
            <CheckCircle2 className="w-4 h-4 mr-2 text-[#F2BE42] flex-shrink-0" />
            <span>{selectionNotice}/{MAX_CREATIVES_PER_SESSION} selected, uncheck to deactivate selection.</span>
          </div>
        </div>
      )}

      {/* Limit modal */}
      {showLimitAlert && (
        <NoticeModal
          title="Creative limit reached"
          message={`You can only select up to ${MAX_CREATIVES_PER_SESSION} templates. Please deselect one to add another.`}
          onClose={() => setShowLimitAlert(false)}
        />
      )}

      {embedded ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
          <div>
            <h2 className="text-xl font-semibold text-black">Choose templates</h2>
            <p className="text-sm font-normal text-[#634B6F] mt-0.5">You can customise up to {MAX_CREATIVES_PER_SESSION} creatives per session.</p>
          </div>
          {selectedTemplates.length > 0 && (
            <Button variant="gold" onClick={handleContinue} className="group px-6">
              <span>Customize selected ({selectedTemplates.length}/{MAX_CREATIVES_PER_SESSION})</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <PageHeader title="Choose templates" onBack={() => onNavigate('dashboard')} />
            {selectedTemplates.length > 0 && (
              <Button variant="gold" onClick={handleContinue} className="group px-6">
                <span>Customize selected ({selectedTemplates.length}/{MAX_CREATIVES_PER_SESSION})</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 ease-out group-hover:translate-x-1" />
              </Button>
            )}
          </div>
          <p className="text-sm font-normal text-[#634B6F] -mt-4 sm:-mt-6 mb-6">You can customise up to {MAX_CREATIVES_PER_SESSION} creatives per session.</p>
        </>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Occasion filter */}
          <div className="relative w-full sm:w-56">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none w-full pl-4 pr-11 py-3 min-h-[46px] border border-[#634B6F]/40 rounded-lg focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none text-sm font-medium text-black bg-white cursor-pointer hover:border-[#704287]/70 transition-colors"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat === 'All' ? 'All occasions' : cat}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#634B6F] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <div className="relative w-full sm:w-64">
            <select
              value={activeRatioFilter}
              onChange={(e) => setActiveRatioFilter(e.target.value)}
              className="appearance-none w-full pl-4 pr-11 py-3 min-h-[46px] border border-[#634B6F]/40 rounded-lg focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none text-sm font-medium text-black bg-white cursor-pointer hover:border-[#704287]/70 transition-colors"
            >
              <option value="All">All sizes</option>
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
          <div className="relative w-full sm:w-64 sm:ml-auto">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#634B6F]" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-11 pr-4 py-3 min-h-[46px] border border-[#634B6F]/40 rounded-lg focus:ring-2 focus:ring-[#704287] focus:border-[#704287] outline-none text-sm font-normal text-black placeholder:text-[#634B6F]/60 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Masonry Layout for dynamic aspect ratios */}
      <div className="columns-1 sm:columns-2 lg:columns-4 gap-6">
        {filteredTemplates.map(template => {
          const isSelected = selectedTemplates.some(t => t.id === template.id);
          const badgeStyle = CATEGORY_BADGE_STYLES[template.category] || 'bg-[#ECE9ED] text-[#381F49]';
          return (
            <div
              key={template.id}
              className={`break-inside-avoid mb-6 group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${isSelected ? 'border-[#704287] ring-2 ring-[#704287]' : 'border-[#E6E9ED] hover:border-[#634B6F]/40'}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className={`relative ${template.ratioClass} bg-[#F6F3F8] overflow-hidden flex items-center justify-center`}>
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className={`w-full h-full ${template.ratioClass === 'aspect-[1/2]' || template.ratioClass === 'aspect-[2/1]' ? 'object-contain' : 'object-cover object-top'} group-hover:scale-105 transition-transform duration-500`}
                />

                {/* Selection Checkmark */}
                <div className="absolute top-3 left-3 z-20">
                  {isSelected ? (
                    <div className="w-6 h-6 bg-[#381F49] rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-[#F2BE42]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-white/85 border-2 border-[#634B6F]/50 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                <div className="absolute inset-0 bg-[#381F49]/0 sm:group-hover:bg-[#381F49]/15 transition-colors flex items-center justify-center">
                  {/* Empty overlay for hover effect */}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-[#E6E9ED] bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full ${badgeStyle}`}>{template.category}</span>
                    <h3 className="font-semibold text-lg text-black mt-1.5 leading-snug">{template.name}</h3>
                    <p className="text-xs font-light text-[#634B6F] mt-1">{getRatioDisplayLabel(template.ratioId, template.ratioClass)}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}
                    className="p-2 text-[#634B6F] hover:text-[#381F49] hover:bg-[#ECE9ED] rounded-full transition-colors flex-shrink-0 -mt-1 -mr-2 z-30"
                    title="Preview"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick-View Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl border border-[#E6E9ED]" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-[#ECE9ED] p-6 sm:p-8 flex items-center justify-center">
              <div className={`w-full ${previewTemplate.ratioClass} relative`}>
                <img src={previewTemplate.thumbnail} alt={previewTemplate.name} className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg" />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full ${CATEGORY_BADGE_STYLES[previewTemplate.category] || 'bg-[#ECE9ED] text-[#381F49]'}`}>{previewTemplate.category}</span>
                  <h2 className="text-2xl font-bold text-black mt-2">{previewTemplate.name}</h2>
                </div>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 bg-[#ECE9ED] text-[#634B6F] rounded-full hover:bg-[#e1dce5] hover:text-[#381F49] transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[#634B6F] font-normal mb-8">This template is perfect for {previewTemplate.category.toLowerCase()} promotions. It includes placeholders for your store logo, address, and contact details.</p>

              <div className="mt-auto space-y-3">
                <Button size="lg" fullWidth onClick={() => {
                  handleTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}>
                  {selectedTemplates.some(t => t.id === previewTemplate.id) ? 'Deselect template' : 'Select template'}
                </Button>
                <Button variant="outline" size="lg" fullWidth onClick={() => setPreviewTemplate(null)}>
                  Close preview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 2. Editor View (Now Edit Content) ---
// Mock gold-detection check for jewellery uploads. Real version: AI model with a 95–98% visible-gold threshold.
// For the prototype, files named with diamond / kundan / stone are rejected.
const GOLD_REJECT_KEYWORDS = ['diamond', 'kundan', 'stone'];

export const EditorView: React.FC<FlowProps> = ({ onNavigate, selectedTemplates, draft, updateDraft, user, onUpdateUser }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'logo' | 'jewelry' | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [profanityResult, setProfanityResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedTemplates || selectedTemplates.length === 0 || !draft || !updateDraft || !user) return null;

  // First-time users have no saved stores: no Select Store dropdown, just the store fields
  const isFirstTime = user.stores.length === 0;
  const [saveForLater, setSaveForLater] = useState(true);
  const firstStore = user.stores[0];

  // Create combinations of selected templates and selected sizes
  const safeSizes = draft.selectedSizes.length > 0 ? draft.selectedSizes : ['1:1'];

  const previewCombinations = selectedTemplates.flatMap(template =>
    safeSizes.map(size => ({ template, size }))
  );

  // Initialize artworksData to match previewCombinations
  const [artworksData, setArtworksData] = useState<PreviewData[]>(
    previewCombinations.map(() => ({
      storeId: firstStore?.id || 'manual',
      storeName: firstStore?.name || '',
      storeAddress: firstStore?.address || '',
      landmark: firstStore?.landmark || '',
      city: firstStore?.city || '',
      contactNumber: firstStore?.contactNumber || '',
      retailerUrl: firstStore?.retailerUrl || '',
      logoUrl: firstStore?.logoUrl || '',
      jewelryImageUrl: ''
    }))
  );
  const [useSameDetails, setUseSameDetails] = useState(draft.useSameDetails ?? true);

  // Ensure previewIndex is valid
  useEffect(() => {
    if (previewIndex >= previewCombinations.length) {
      setPreviewIndex(Math.max(0, previewCombinations.length - 1));
    }
  }, [previewCombinations.length, previewIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImage(url);
      setProfanityResult('idle');
      setIsChecking(true);

      setTimeout(() => {
        setIsChecking(false);
        const name = file.name.toLowerCase();
        // Jewellery: gold-only check. Logo: existing content check ('bad' / 'nsfw').
        const rejected = uploadType === 'jewelry'
          ? GOLD_REJECT_KEYWORDS.some(k => name.includes(k))
          : name.includes('bad') || name.includes('nsfw');
        setProfanityResult(rejected ? 'failed' : 'passed');
      }, 2000);
    }
  };

  const handleFieldChange = (index: number, field: keyof PreviewData, value: string) => {
    if (useSameDetails) {
      setArtworksData(prev => prev.map(data => ({ ...data, [field]: value, storeId: 'manual' })));
    } else {
      setArtworksData(prev => {
        const newData = [...prev];
        newData[index] = { ...newData[index], [field]: value, storeId: 'manual' };
        return newData;
      });
    }
  };

  const handleStoreSelect = (index: number, storeId: string) => {
    const store = user?.stores.find(s => s.id === storeId);
    const updates = store ? {
      storeId,
      storeName: store.name,
      storeAddress: store.address,
      landmark: store.landmark || '',
      city: store.city || '',
      contactNumber: store.contactNumber,
      retailerUrl: store.retailerUrl || '',
      logoUrl: store.logoUrl || ''
    } : {
      storeId: 'manual',
      storeName: '',
      storeAddress: '',
      landmark: '',
      city: '',
      contactNumber: '',
      retailerUrl: '',
      logoUrl: ''
    };

    if (useSameDetails) {
      setArtworksData(prev => prev.map(data => ({ ...data, ...updates })));
    } else {
      setArtworksData(prev => {
        const newData = [...prev];
        newData[index] = { ...newData[index], ...updates };
        return newData;
      });
    }
  };

  const confirmUpload = () => {
    if (profanityResult === 'passed' && tempImage && activeUploadIndex !== null) {
      handleFieldChange(activeUploadIndex, uploadType === 'logo' ? 'logoUrl' : 'jewelryImageUrl', tempImage);
      setIsModalOpen(false);
      setTempImage(null);
      setProfanityResult('idle');
      setUploadType(null);
      setActiveUploadIndex(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
    setProfanityResult('idle');
    setUploadType(null);
    setActiveUploadIndex(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openUpload = (index: number, type: 'logo' | 'jewelry') => {
    setActiveUploadIndex(index);
    setUploadType(type);
    setIsModalOpen(true);
  };

  const nextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % previewCombinations.length);
  };

  const prevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + previewCombinations.length) % previewCombinations.length);
  };

  // Store name + Address Line 1 are mandatory for every creative being customised
  const activeForms = useSameDetails ? [artworksData[0]] : artworksData;
  const isFormValid = activeForms.every(d => d && d.storeName.trim() && d.storeAddress.trim());
  const hasManualEntry = activeForms.some(d => d.storeId === 'manual');

  const handleGenerate = () => {
    if (!isFormValid) return;
    // "Save this for reusing later": manually entered stores are added to the user's saved stores
    if (saveForLater && hasManualEntry && onUpdateUser) {
      const seen = new Set(user.stores.map(st => `${st.name}|${st.address}`));
      const newStores: StoreInfo[] = [];
      activeForms.filter(d => d.storeId === 'manual').forEach((d, i) => {
        const key = `${d.storeName}|${d.storeAddress}`;
        if (seen.has(key)) return;
        seen.add(key);
        newStores.push({
          id: `s${Date.now()}${i}`,
          name: d.storeName,
          address: d.storeAddress,
          landmark: d.landmark,
          city: d.city,
          contactNumber: d.contactNumber,
          retailerUrl: d.retailerUrl,
          logoUrl: d.logoUrl
        });
      });
      if (newStores.length) onUpdateUser({ stores: [...user.stores, ...newStores] });
    }
    updateDraft({ artworksData, useSameDetails });
    onNavigate('generating');
  };

  const activeCombo = previewCombinations[previewIndex] || previewCombinations[0];
  const activeRatioClass = ASPECT_RATIOS.find(r => r.id === activeCombo.size)?.class || activeCombo.template.ratioClass || 'aspect-square';
  const activeRatioName = getRatioDisplayLabel(activeCombo.size, activeCombo.template.ratioClass);
  const currentData = artworksData[previewIndex] || artworksData[0];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col h-[calc(100vh-4rem)] bg-white">
      <div className="px-2 sm:px-0">
        <PageHeader title="Add your details" onBack={() => onNavigate('gallery')} />
        <p className="text-[#634B6F] font-normal mb-6">Provide the information to personalize your selected creatives.</p>
      </div>

      {/* Side-by-side layout forced on both mobile and desktop */}
      <div className="flex-grow flex flex-row gap-2 sm:gap-8 overflow-hidden pb-16 sm:pb-0">

        {/* Left: Canvas Preview */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-[#ECE9ED] rounded-xl sm:rounded-2xl p-2 sm:p-8 overflow-y-auto relative border border-[#E6E9ED]">

          <div className="flex justify-between items-center mb-2 shrink-0 gap-3">
            <span className="text-xs font-medium text-[#381F49] tracking-wide">Selected designs</span>
            <span className="text-xs bg-white px-3 py-1 rounded-full text-[#381F49] font-medium shadow-sm border border-[#E6E9ED]">{previewIndex + 1} of {previewCombinations.length}</span>
          </div>

          {/* Carousel Controls */}
          {previewCombinations.length > 1 && (
            <div className="absolute inset-x-0 top-[55%] -translate-y-1/2 flex justify-between px-1 sm:px-4 z-20 pointer-events-none">
              <button onClick={prevPreview} className="pointer-events-auto p-1 sm:p-2 bg-white/90 hover:bg-white text-[#381F49] rounded-full shadow-md backdrop-blur-sm transition-all">
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button onClick={nextPreview} className="pointer-events-auto p-1 sm:p-2 bg-white/90 hover:bg-white text-[#381F49] rounded-full shadow-md backdrop-blur-sm transition-all">
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}

          <div className="w-full max-w-md transition-all duration-500 flex items-center justify-center mt-10" style={stageStyle(activeRatioClass)}>
            <CanvasPreview template={activeCombo.template} data={currentData} ratioClass={activeRatioClass} />
          </div>

          <div className="mt-3 sm:mt-6 flex flex-col items-center w-full">
            {previewCombinations.length > 1 && (
              <div className="flex gap-1.5 mt-2 flex-wrap justify-center max-w-[80%] mb-4">
                {previewCombinations.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === previewIndex ? 'w-4 bg-[#F2BE42]' : 'w-1.5 bg-[#634B6F]/30'}`} />
                ))}
              </div>
            )}

            {/* Info Card */}
            <div className="w-full max-w-md border border-[#E6E9ED] rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
              <div>
                <h4 className="font-semibold text-black text-sm">{activeCombo.template.name}</h4>
                <p className="text-xs font-light text-[#634B6F] mt-1">Ratio: {activeRatioName}</p>
              </div>
              <div className="w-8 h-8 bg-[#ECE9ED] rounded-full flex items-center justify-center">
                <Eye className="text-[#704287] w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editing Controls */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl sm:rounded-2xl border border-[#E6E9ED] shadow-sm overflow-hidden relative">

          <div className="p-2 sm:p-6 overflow-y-auto flex-grow space-y-4 sm:space-y-6 pb-20 sm:pb-6">

            {/* "Use same details" only applies when more than one template is selected */}
            {selectedTemplates.length > 1 && (
            <label className="flex items-start mb-6 cursor-pointer group bg-[#ECE9ED]/60 p-4 rounded-xl border border-[#E6E9ED]">
              <input
                type="checkbox"
                checked={useSameDetails}
                onChange={(e) => setUseSameDetails(e.target.checked)}
                className="mt-1 h-5 w-5 text-[#381F49] border-[#634B6F]/50 rounded focus:ring-[#704287]"
              />
              <span className="ml-3 text-sm text-black font-medium group-hover:text-[#381F49] transition-colors">
                Use same contact number, address, and jewelry piece for all selected creatives
              </span>
            </label>
            )}

            {/* Render forms based on useSameDetails */}
            {(useSameDetails ? [artworksData[0]] : artworksData).map((data, index) => (
              <div key={index} className={`space-y-6 ${!useSameDetails ? 'p-6 bg-[#ECE9ED]/50 rounded-xl border border-[#E6E9ED] mb-6' : ''}`}>
                {!useSameDetails && (
                  <h3 className="font-semibold text-black text-lg border-b border-[#E6E9ED] pb-3">
                    Creative {index + 1}: {previewCombinations[index].template.name}
                  </h3>
                )}

                {!isFirstTime && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">Select store</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full rounded-lg border border-[#634B6F]/40 pl-4 pr-11 py-3 min-h-[46px] text-black font-medium shadow-sm focus:border-[#704287] focus:ring-2 focus:ring-[#704287] focus:outline-none sm:text-sm bg-white cursor-pointer hover:border-[#704287]/70 transition-colors"
                      value={data.storeId}
                      onChange={(e) => handleStoreSelect(index, e.target.value)}
                    >
                      {user?.stores.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                      <option value="manual">Enter manually...</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#634B6F] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <Input
                    label="Store name *"
                    placeholder="e.g. Royal Jewellers"
                    value={data.storeName}
                    onChange={(e) => handleFieldChange(index, 'storeName', e.target.value)}
                    maxLength={50}
                  />
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Store logo</label>
                    <div
                      onClick={() => openUpload(index, 'logo')}
                      className="border border-dashed border-[#634B6F]/50 rounded-lg h-[44px] flex items-center justify-center text-sm font-normal text-[#634B6F] cursor-pointer hover:bg-[#ECE9ED]/50 transition-colors overflow-hidden relative"
                    >
                      {data.logoUrl ? (
                        <img src={data.logoUrl} className="absolute inset-0 w-full h-full object-contain p-1" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 mr-2 text-[#704287]" />
                          <span>Click or drag file to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-6">
                  <Input
                    label="Contact number"
                    placeholder="+1 (555) 000-0000"
                    value={data.contactNumber}
                    onChange={(e) => handleFieldChange(index, 'contactNumber', e.target.value)}
                    maxLength={15}
                  />
                  <div>
                    <AddressFields
                      line1={data.storeAddress}
                      landmark={data.landmark}
                      city={data.city}
                      onChange={(f, v) => handleFieldChange(index, f === 'line1' ? 'storeAddress' : f, v)}
                    />
                  </div>
                  <Input
                    label="Retailer URL (optional)"
                    placeholder="e.g. www.yourstore.com"
                    value={data.retailerUrl || ''}
                    onChange={(e) => handleFieldChange(index, 'retailerUrl', e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-black mb-2">Jewelry piece for insert *</label>
                  <div
                    onClick={() => openUpload(index, 'jewelry')}
                    className="border-2 border-dashed border-[#634B6F]/45 rounded-xl p-6 flex flex-col items-center justify-center text-sm text-[#634B6F] cursor-pointer hover:bg-[#ECE9ED]/50 transition-colors relative overflow-hidden min-h-[120px]"
                  >
                    {data.jewelryImageUrl ? (
                      <img src={data.jewelryImageUrl} className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mb-3 text-[#704287]" />
                        <span className="font-medium text-[#381F49]">Click or drag file to upload</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs font-light text-[#634B6F] mt-2 leading-relaxed">
                    Best practices: Use a high-resolution image with a clean, solid background (preferably white or transparent) for best results.
                  </p>
                  <p className="text-xs font-light text-[#634B6F] mt-1 leading-relaxed">
                    Only gold jewellery is permitted. Diamond-centric pieces and large-stone Kundan pieces will be rejected; minor enamel accents or tiny embedded stones are fine.
                  </p>
                </div>
              </div>
            ))}

            {(isFirstTime || hasManualEntry) && (
              <label className="flex items-center cursor-pointer bg-[#ECE9ED]/60 p-4 rounded-xl border border-[#E6E9ED]">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-[#381F49] border-[#634B6F]/50 rounded focus:ring-[#704287]"
                  checked={saveForLater}
                  onChange={(e) => setSaveForLater(e.target.checked)}
                />
                <span className="ml-3 text-sm text-black font-medium">Save this for reusing later</span>
              </label>
            )}


          </div>

          {/* Fixed Bottom Bar inside the right panel for desktop, or global for mobile */}
          <div className="absolute sm:static bottom-0 left-0 right-0 p-2 sm:p-4 border-t border-[#E6E9ED] bg-white flex flex-col sm:flex-row sm:justify-between items-center gap-2 z-40">
            <p className="text-xs font-light text-[#634B6F] self-start sm:self-center">* Mandatory fields</p>
            <Button
              variant="gold"
              size="lg"
              onClick={handleGenerate}
              disabled={!isFormValid}
              className="group px-10 w-full sm:w-auto"
            >
              <span>Submit request</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 ease-out group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Upload & Profanity Check Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E6E9ED] flex justify-between items-center bg-[#ECE9ED]">
              <h3 className="font-semibold text-[#381F49]">Upload {uploadType === 'logo' ? 'store logo' : 'jewelry piece'}</h3>
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
                  <p className="text-center font-normal text-[#634B6F] mb-6">Select an image from your device gallery.</p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} fullWidth>
                    Choose from gallery
                  </Button>
                </>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-6">
                    <img src={tempImage} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md border-4 border-white" />
                    {isChecking && (
                      <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-[#381F49] animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Status Area */}
                  <div className="w-full min-h-[80px] flex flex-col items-center justify-center text-center mb-4">
                    {isChecking && (
                      <div className="text-[#381F49] flex flex-col items-center">
                        <p className="font-semibold">Analyzing image...</p>
                        <p className="text-xs font-light text-[#634B6F] mt-1">{uploadType === 'jewelry' ? 'Checking that this is gold jewellery' : 'Checking for inappropriate content'}</p>
                      </div>
                    )}

                    {profanityResult === 'passed' && (
                      <div className="text-[#00323C] flex flex-col items-center bg-[#40DDB1]/20 w-full p-3 rounded-lg border border-[#40DDB1]/50">
                        <CheckCircle2 className="w-6 h-6 mb-1" />
                        <p className="font-semibold text-sm">Image approved!</p>
                        <p className="text-xs font-normal text-[#00323C]/90 mt-0.5">Looks great and meets our guidelines.</p>
                      </div>
                    )}

                    {profanityResult === 'failed' && (
                      <div className="text-red-600 flex flex-col items-center bg-red-50 w-full p-3 rounded-lg border border-red-100">
                        <AlertTriangle className="w-6 h-6 mb-1" />
                        <p className="font-semibold text-sm">{uploadType === 'jewelry' ? 'Only gold jewellery is permitted on this platform.' : 'Image rejected'}</p>
                        <p className="text-xs font-normal text-red-700 mt-0.5">{uploadType === 'jewelry'
                          ? "Pieces that are mainly diamond or large-stone Kundan can't be used. Minor enamel accents or tiny embedded stones are fine."
                          : 'Image does not match the profanity check so please upload another one.'}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 w-full mt-2">
                    <Button variant="outline" className="flex-1" onClick={() => {
                      setTempImage(null);
                      setProfanityResult('idle');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      Try another
                    </Button>
                    <Button
                      className="flex-1"
                      disabled={profanityResult !== 'passed'}
                      onClick={confirmUpload}
                    >
                      Use image
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

// --- 4. Generating Loading View ---
export const GeneratingView: React.FC<FlowProps> = ({ onNavigate }) => {
  useEffect(() => {
    // Simulate generation time
    const timer = setTimeout(() => {
      onNavigate('download');
    }, 3000);
    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center bg-white">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-[#ECE9ED] rounded-full"></div>
        <div className="absolute inset-0 border-4 border-[#381F49] rounded-full border-t-[#F2BE42] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-[#381F49] animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-black mb-2">Crafting your campaign...</h2>
      <p className="text-[#634B6F] font-normal max-w-md">Applying your brand details and generating high-quality images in all selected sizes.</p>

      {/* Skeleton mockups */}
      <div className="mt-12 flex space-x-4 opacity-60">
        <div className="w-16 h-16 bg-[#ECE9ED] rounded animate-pulse"></div>
        <div className="w-12 h-20 bg-[#ECE9ED] rounded animate-pulse delay-75"></div>
        <div className="w-24 h-12 bg-[#ECE9ED] rounded animate-pulse delay-150"></div>
      </div>
    </div>
  );
};

// --- 5. Download / Success View ---
export const DownloadView: React.FC<FlowProps> = ({ onNavigate, draft, selectedTemplates, user }) => {
  const [copied, setCopied] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'digital' | 'print'>('digital');
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewItem, setPreviewItem] = useState<{template: Template, data: PreviewData, sizeId: string} | null>(null);

  if (!draft || !selectedTemplates || !user) return null;

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const generatedFiles = selectedTemplates.flatMap((template, idx) =>
    draft.selectedSizes.map(sizeId => ({
      template,
      sizeId,
      data: draft.useSameDetails ? draft.artworksData[0] : draft.artworksData[idx]
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative bg-white">

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-[#282828] text-white border border-[#F2BE42]/40 px-6 py-3 rounded-lg shadow-2xl flex items-center z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <CheckCircle2 className="w-5 h-5 text-[#40DDB1] mr-3" />
          <span className="font-semibold">Campaign image downloaded successfully!</span>
        </div>
      )}

      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#381F49] text-[#F2BE42] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-black mb-2">Campaign ready!</h1>
        <p className="text-[#634B6F] font-normal">Your designs have been generated successfully.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#E6E9ED] shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-[#E6E9ED] gap-4">
          <div>
            <h2 className="text-xl font-semibold text-black">Generated files</h2>
            <div className="flex items-center mt-3 space-x-4">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="format" checked={downloadFormat === 'digital'} onChange={() => setDownloadFormat('digital')} className="text-[#381F49] focus:ring-[#704287] h-4 w-4" />
                <span className="ml-2 text-sm text-black font-medium">Digital use (PNG)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="format" checked={downloadFormat === 'print'} onChange={() => setDownloadFormat('print')} className="text-[#381F49] focus:ring-[#704287] h-4 w-4" />
                <span className="ml-2 text-sm text-black font-medium">Print ready (PDF)</span>
              </label>
            </div>
          </div>
          <Button variant="gold" size="lg" className="w-full sm:w-auto px-7" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download all (ZIP)</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedFiles.map((file, idx) => {
            const ratio = ASPECT_RATIOS.find(r => r.id === file.template.ratioId) || ASPECT_RATIOS.find(r => r.class === file.template.ratioClass);
            return (
              <div key={idx} className="border border-[#E6E9ED] rounded-xl p-4 flex flex-col items-center group hover:border-[#704287] transition-colors">
                <div className="w-full bg-[#ECE9ED] rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                   <CanvasPreview template={file.template} data={file.data} ratioClass={ratio?.class} isMini={true} />
                </div>
                <div className="w-full flex justify-between items-center mt-auto">
                  <div className="overflow-hidden pr-2">
                    <p className="font-semibold text-black text-sm truncate">{file.data.storeName}</p>
                    <p className="text-xs font-light text-[#634B6F]">{getRatioDisplayLabel(file.template.ratioId, file.template.ratioClass)} • {downloadFormat === 'digital' ? 'PNG' : 'PDF'}</p>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <button onClick={() => setPreviewItem(file)} className="p-2 text-[#634B6F] hover:text-[#381F49] hover:bg-[#ECE9ED] rounded-full transition-colors flex items-center justify-center" title="Preview">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownload} className="p-2 text-[#704287] hover:text-[#381F49] hover:bg-[#ECE9ED] rounded-full transition-colors flex items-center justify-center" title="Download">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>Back to dashboard</Button>
        <Button variant="outline" onClick={() => onNavigate('gallery')}>Create another</Button>
      </div>

      {/* Full Size Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewItem(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl" style={stageStyle(previewItem.template.ratioClass)}>
              <CanvasPreview
                template={previewItem.template}
                data={previewItem.data}
                ratioClass={ASPECT_RATIOS.find(r => r.id === previewItem.sizeId)?.class}
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <Button variant="outline" onClick={() => setPreviewItem(null)}>Close</Button>
              <Button variant="gold" onClick={() => { handleDownload(); setPreviewItem(null); }}><Download className="w-4 h-4 mr-2" /> Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
