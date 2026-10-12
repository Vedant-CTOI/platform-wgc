import React, { useState, useEffect, useRef } from 'react';
import { Button, PageHeader, Input } from '../components/SharedUI';
import { ViewState, Template, CampaignDraft, UserProfile, StoreInfo, PreviewData } from '../types';
import { MOCK_TEMPLATES, CATEGORIES, ASPECT_RATIOS } from '../constants';
import { Search, Filter, Download, Share2, Copy, Check, Loader2, Image as ImageIcon, MapPin, Phone, X, ChevronLeft, ChevronRight, UploadCloud, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

interface FlowProps {
  onNavigate: (view: ViewState) => void;
  onSelectTemplate?: (t: Template[]) => void;
  selectedTemplates?: Template[];
  selectedTemplate?: Template | null;
  draft?: CampaignDraft | null;
  updateDraft?: (updates: Partial<CampaignDraft>) => void;
  user?: UserProfile | null;
}

const GRAY_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Cpath d='M50 40a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-20 30l15-20 10 10 20-25 15 35H30z' fill='%239ca3af'/%3E%3C/svg%3E";

// --- Shared Canvas Preview Component ---
const CanvasPreview: React.FC<{ template: Template, data: PreviewData, ratioClass?: string, isMini?: boolean }> = ({ template, data, ratioClass = 'aspect-[4/5]', isMini = false }) => {
  
  // Adjust scale based on aspect ratio to keep text balanced within the available vertical space
  let scale = 1;
  if (ratioClass === 'aspect-video') scale = 0.65; // 16:9 (Wide) - needs smaller text relative to width
  if (ratioClass === 'aspect-[9/16]') scale = 1.3; // 9:16 (Tall) - needs larger text relative to width
  if (ratioClass === 'aspect-[4/5]') scale = 1.1;  // 4:5 (Portrait)
  if (ratioClass === 'aspect-[610/794]') scale = 1.15; // Full Page
  if (ratioClass === 'aspect-[936/709]') scale = 0.8; // Half Page

  const displayLogo = data.logoUrl;

  return (
    <div 
      className={`w-full ${ratioClass} ${isMini ? 'rounded-md' : 'rounded-lg sm:rounded-xl'} shadow-lg overflow-hidden relative flex flex-col ${template.colorScheme.bg}`}
      style={{ containerType: 'inline-size' }}
    >
      {/* Header / Logo area */}
      <div className="flex justify-between items-start shrink-0" style={{ padding: `${4 * scale}cqi` }}>
        {displayLogo ? (
          <img src={displayLogo} alt="Logo" className="rounded-full bg-white object-cover shadow-sm" style={{ width: `${12 * scale}cqi`, height: `${12 * scale}cqi` }} />
        ) : (
          <div className="rounded-full bg-white/50 flex items-center justify-center shadow-sm" style={{ width: `${12 * scale}cqi`, height: `${12 * scale}cqi` }}>
            <ImageIcon className="text-gray-500" style={{ width: `${5 * scale}cqi`, height: `${5 * scale}cqi` }} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center min-h-0 overflow-hidden" style={{ padding: `${4 * scale}cqi` }}>
        <h2 className={`font-black uppercase tracking-tight ${template.colorScheme.text} leading-tight line-clamp-3`} style={{ fontSize: `${8 * scale}cqi`, marginBottom: `${2 * scale}cqi` }}>
          {template.defaultText.headline}
        </h2>
        <p className={`font-medium ${template.colorScheme.text} opacity-90 leading-snug line-clamp-2`} style={{ fontSize: `${4 * scale}cqi`, marginBottom: `${4 * scale}cqi` }}>
          {template.defaultText.subheadline}
        </p>
        <div className={`rounded-full font-bold text-white shadow-md ${template.colorScheme.accent} truncate max-w-full shrink-0`} style={{ fontSize: `${3.5 * scale}cqi`, padding: `${1.5 * scale}cqi ${4 * scale}cqi` }}>
          {template.defaultText.offer}
        </div>
      </div>

      {/* Inset Circle for Jewelry */}
      <div 
        className="absolute bg-white/90 backdrop-blur-sm rounded-full shadow-md border border-gray-200 z-10 flex items-center justify-center overflow-hidden"
        style={{ 
          bottom: `${12 * scale}cqi`, 
          right: `${4 * scale}cqi`, 
          width: `${14 * scale}cqi`, 
          height: `${14 * scale}cqi` 
        }}
      >
        {data.jewelryImageUrl ? (
          <img src={data.jewelryImageUrl} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="text-gray-400" style={{ width: `${6 * scale}cqi`, height: `${6 * scale}cqi` }} />
        )}
      </div>

      {/* Footer / Contact area */}
      <div className={`flex flex-col sm:flex-row justify-center items-center font-medium ${template.colorScheme.text} bg-black/5 backdrop-blur-sm shrink-0`} style={{ padding: `${3 * scale}cqi`, gap: `${2 * scale}cqi`, fontSize: `${2.5 * scale}cqi` }}>
        {data.storeAddress && (
          <div className="flex items-center truncate max-w-full">
            <MapPin className="mr-1 flex-shrink-0" style={{ width: `${3 * scale}cqi`, height: `${3 * scale}cqi` }} /> 
            <span className="truncate">{data.storeAddress}</span>
          </div>
        )}
        {data.contactNumber && (
          <div className="flex items-center flex-shrink-0">
            <Phone className="mr-1" style={{ width: `${3 * scale}cqi`, height: `${3 * scale}cqi` }} /> 
            {data.contactNumber}
          </div>
        )}
      </div>
    </div>
  );
};

// --- 1. Gallery View ---
export const GalleryView: React.FC<FlowProps> = ({ onNavigate, onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeRatioFilter, setActiveRatioFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  
  // Multi-select state for templates
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [showLimitAlert, setShowLimitAlert] = useState(false);

  const filteredTemplates = MOCK_TEMPLATES.filter(t => {
    const matchesCat = activeCategory === 'All' || t.category === activeCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRatio = activeRatioFilter === 'All' || t.ratioClass === activeRatioFilter;
    return matchesCat && matchesSearch && matchesRatio;
  });

  const handleTemplateSelect = (template: Template) => {
    const isSelected = selectedTemplates.some(t => t.id === template.id);
    
    if (isSelected) {
      setSelectedTemplates(prev => prev.filter(t => t.id !== template.id));
      setShowLimitAlert(false);
    } else {
      if (selectedTemplates.length >= 3) {
        setShowLimitAlert(true);
        setTimeout(() => setShowLimitAlert(false), 3000);
      } else {
        setSelectedTemplates(prev => [...prev, template]);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Limit Alert Toast */}
      {showLimitAlert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center z-50 transition-all duration-300">
          <AlertTriangle className="w-5 h-5 mr-3" />
          <span className="font-medium">You can only select up to 3 templates. Please deselect one to add another.</span>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <PageHeader title="Choose Templates" onBack={() => onNavigate('dashboard')} />
        {selectedTemplates.length > 0 && (
          <Button onClick={handleContinue}>
            Customize Selected ({selectedTemplates.length}/3)
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex overflow-x-auto no-scrollbar space-x-2 w-full sm:w-auto pb-2 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <select
            value={activeRatioFilter}
            onChange={(e) => setActiveRatioFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm bg-white"
          >
            <option value="All">All Sizes</option>
            <option value="aspect-[610/794]">Full Page</option>
            <option value="aspect-[936/709]">Half Page</option>
            <option value="aspect-square">Social Media</option>
          </select>
          <div className="relative w-full sm:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search templates..." 
              className="w-full pl-10 pr-4 py-2.5 min-h-[44px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
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
          return (
            <div 
              key={template.id} 
              className={`break-inside-avoid mb-6 group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer ${isSelected ? 'border-primary-500 ring-2 ring-primary-500' : 'border-gray-200'}`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className={`relative ${template.ratioClass} bg-gray-100 overflow-hidden flex items-center justify-center`}>
                <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Selection Checkmark */}
                <div className="absolute top-3 left-3 z-20">
                  {isSelected ? (
                    <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-white/80 border-2 border-gray-300 rounded-full shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>

                <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  {/* Empty overlay for hover effect */}
                </div>
                {/* Inset circle on the right bottom */}
                <div className="absolute bottom-3 right-3 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-gray-200 z-10"></div>
              </div>
              <div className="p-4 flex flex-col flex-grow border-t border-gray-100 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{template.category}</span>
                    <h3 className="font-bold text-gray-900 mt-1">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{ASPECT_RATIOS.find(r => r.class === template.ratioClass)?.name || 'Social Media'}</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setPreviewTemplate(template); }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors flex-shrink-0 -mt-1 -mr-2 z-30"
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
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/2 bg-gray-100 p-6 sm:p-8 flex items-center justify-center">
              <div className={`w-full ${previewTemplate.ratioClass} relative`}>
                <img src={previewTemplate.thumbnail} alt={previewTemplate.name} className="absolute inset-0 w-full h-full object-cover shadow-md rounded-lg" />
              </div>
            </div>
            <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{previewTemplate.category}</span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{previewTemplate.name}</h2>
                </div>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-600 mb-8">This template is perfect for {previewTemplate.category.toLowerCase()} promotions. It includes placeholders for your store logo, address, and contact details.</p>
              
              <div className="mt-auto space-y-3">
                <Button size="lg" fullWidth onClick={() => {
                  handleTemplateSelect(previewTemplate);
                  setPreviewTemplate(null);
                }}>
                  {selectedTemplates.some(t => t.id === previewTemplate.id) ? 'Deselect Template' : 'Select Template'}
                </Button>
                <Button variant="outline" size="lg" fullWidth onClick={() => setPreviewTemplate(null)}>
                  Close Preview
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
export const EditorView: React.FC<FlowProps> = ({ onNavigate, selectedTemplates, draft, updateDraft, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'logo' | 'jewelry' | null>(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [profanityResult, setProfanityResult] = useState<'idle' | 'passed' | 'failed'>('idle');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [activeUploadIndex, setActiveUploadIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!selectedTemplates || selectedTemplates.length === 0 || !draft || !updateDraft || !user) return null;

  // Create combinations of selected templates and selected sizes
  const safeSizes = draft.selectedSizes.length > 0 ? draft.selectedSizes : ['1:1'];
  
  const previewCombinations = selectedTemplates.flatMap(template => 
    safeSizes.map(size => ({ template, size }))
  );

  // Initialize artworksData to match previewCombinations
  const [artworksData, setArtworksData] = useState<PreviewData[]>(
    previewCombinations.map(() => ({
      storeId: user?.stores[0]?.id || 'manual',
      storeName: user?.stores[0]?.name || '',
      storeAddress: user?.stores[0]?.address || '',
      contactNumber: user?.stores[0]?.contactNumber || '',
      logoUrl: user?.stores[0]?.logoUrl || '',
      jewelryImageUrl: ''
    }))
  );
  const [useSameDetails, setUseSameDetails] = useState(draft.useSameDetails ?? true);
  const [globalEmail, setGlobalEmail] = useState(user?.email || '');

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
        // Mock logic: fail if filename contains 'bad' or 'nsfw', otherwise pass
        if (file.name.toLowerCase().includes('bad') || file.name.toLowerCase().includes('nsfw')) {
          setProfanityResult('failed');
        } else {
          setProfanityResult('passed');
        }
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
      contactNumber: store.contactNumber,
      logoUrl: store.logoUrl || ''
    } : {
      storeId: 'manual',
      storeName: '',
      storeAddress: '',
      contactNumber: '',
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

  const handleGenerate = () => {
    updateDraft({ artworksData, useSameDetails });
    onNavigate('generating');
  };

  const activeCombo = previewCombinations[previewIndex] || previewCombinations[0];
  const activeRatioClass = ASPECT_RATIOS.find(r => r.id === activeCombo.size)?.class || 'aspect-square';
  const activeRatioName = ASPECT_RATIOS.find(r => r.id === activeCombo.size)?.name || 'Social Media';
  const currentData = artworksData[previewIndex] || artworksData[0];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-2 sm:px-0">
        <PageHeader title="Add your details" onBack={() => onNavigate('gallery')} />
        <p className="text-gray-600 mb-6">Provide the information to personalize your selected creatives.</p>
      </div>

      {/* Side-by-side layout forced on both mobile and desktop */}
      <div className="flex-grow flex flex-row gap-2 sm:gap-8 overflow-hidden pb-16 sm:pb-0">
        
        {/* Left: Canvas Preview */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 rounded-xl sm:rounded-2xl p-2 sm:p-8 overflow-y-auto relative">
          
          <div className="flex justify-between items-center mb-2 shrink-0">
            <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">Selected Designs</span>
            <span className="text-xs bg-white px-3 py-1 rounded-full text-gray-600 font-medium shadow-sm">{previewIndex + 1} of {previewCombinations.length}</span>
          </div>

          {/* Carousel Controls */}
          {previewCombinations.length > 1 && (
            <div className="absolute inset-x-0 top-[55%] -translate-y-1/2 flex justify-between px-1 sm:px-4 z-20 pointer-events-none">
              <button onClick={prevPreview} className="pointer-events-auto p-1 sm:p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm transition-all">
                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
              <button onClick={nextPreview} className="pointer-events-auto p-1 sm:p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md backdrop-blur-sm transition-all">
                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
              </button>
            </div>
          )}

          <div className="w-full max-w-md transition-all duration-500 flex items-center justify-center mt-10">
            <CanvasPreview template={activeCombo.template} data={currentData} ratioClass={activeRatioClass} />
          </div>

          <div className="mt-3 sm:mt-6 flex flex-col items-center w-full">
            {previewCombinations.length > 1 && (
              <div className="flex gap-1.5 mt-2 flex-wrap justify-center max-w-[80%] mb-4">
                {previewCombinations.map((_, idx) => (
                  <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === previewIndex ? 'w-4 bg-[#d4c4a8]' : 'w-1.5 bg-gray-300'}`} />
                ))}
              </div>
            )}
            
            {/* Info Card */}
            <div className="w-full max-w-md border border-gray-200 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm">
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{activeCombo.template.name}</h4>
                <p className="text-xs text-gray-500 mt-1">Ratio: {activeRatioName}</p>
              </div>
              <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                <Eye className="text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editing Controls */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm overflow-hidden relative">
          
          <div className="p-2 sm:p-6 overflow-y-auto flex-grow space-y-4 sm:space-y-6 pb-20 sm:pb-6">
            
            <label className="flex items-start mb-6 cursor-pointer group bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input 
                type="checkbox" 
                checked={useSameDetails}
                onChange={(e) => setUseSameDetails(e.target.checked)}
                className="mt-1 h-5 w-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500" 
              />
              <span className="ml-3 text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                Use same contact number, address, and jewelry piece for all selected creatives
              </span>
            </label>

            {/* Render forms based on useSameDetails */}
            {(useSameDetails ? [artworksData[0]] : artworksData).map((data, index) => (
              <div key={index} className={`space-y-6 ${!useSameDetails ? 'p-6 bg-gray-50 rounded-xl border border-gray-200 mb-6' : ''}`}>
                {!useSameDetails && (
                  <h3 className="font-bold text-gray-900 text-lg border-b border-gray-200 pb-3">
                    Creative {index + 1}: {previewCombinations[index].template.name}
                  </h3>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Store</label>
                  <select 
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none sm:text-sm bg-white"
                    value={data.storeId}
                    onChange={(e) => handleStoreSelect(index, e.target.value)}
                  >
                    {user?.stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                    <option value="manual">Enter Manually...</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <Input 
                    label="Store Name *" 
                    placeholder="e.g. Royal Jewellers" 
                    value={data.storeName}
                    onChange={(e) => handleFieldChange(index, 'storeName', e.target.value)}
                    maxLength={50}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store Logo</label>
                    <div 
                      onClick={() => openUpload(index, 'logo')} 
                      className="border border-dashed border-gray-300 rounded-lg h-[44px] flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors overflow-hidden relative"
                    >
                      {data.logoUrl ? (
                        <img src={data.logoUrl} className="absolute inset-0 w-full h-full object-contain p-1" />
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4 mr-2 text-gray-400" /> 
                          <span>Click or drag file to upload</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-6 mb-6">
                  <Input 
                    label="Contact Number" 
                    placeholder="+1 (555) 000-0000" 
                    value={data.contactNumber}
                    onChange={(e) => handleFieldChange(index, 'contactNumber', e.target.value)}
                    maxLength={15}
                  />
                  <Input 
                    label="Store Address" 
                    placeholder="Enter full address" 
                    value={data.storeAddress}
                    onChange={(e) => handleFieldChange(index, 'storeAddress', e.target.value)}
                    maxLength={100}
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jewelry Piece for Insert *</label>
                  <div 
                    onClick={() => openUpload(index, 'jewelry')} 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden min-h-[120px]"
                  >
                    {data.jewelryImageUrl ? (
                      <img src={data.jewelryImageUrl} className="absolute inset-0 w-full h-full object-contain p-2" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                        <span className="font-medium">Click or drag file to upload</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Best Practices: Use a high-resolution image with a clean, solid background (preferably white or transparent) for best results.
                  </p>
                </div>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-6 mt-6">
              <Input 
                label="Email ID *" 
                placeholder="store@example.com" 
                helperText="Your personalized creatives will be shared via this email." 
                value={globalEmail}
                onChange={(e) => setGlobalEmail(e.target.value)}
              />
            </div>

          </div>

          {/* Fixed Bottom Bar inside the right panel for desktop, or global for mobile */}
          <div className="absolute sm:static bottom-0 left-0 right-0 p-2 sm:p-4 border-t border-gray-200 bg-white flex flex-col sm:flex-row justify-end items-center gap-2 z-40">
            <Button 
              onClick={handleGenerate} 
              className="px-10 py-3 text-base w-full sm:w-auto"
            >
              Submit Request
            </Button>
          </div>
        </div>
      </div>

      {/* Upload & Profanity Check Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Upload {uploadType === 'logo' ? 'Store Logo' : 'Jewelry Piece'}</h3>
              <button onClick={closeModal} className="p-1 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              {!tempImage ? (
                <>
                  <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-10 h-10" />
                  </div>
                  <p className="text-center text-gray-600 mb-6">Select an image from your device gallery.</p>
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
                    <img src={tempImage} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-md border-4 border-white" />
                    {isChecking && (
                      <div className="absolute inset-0 bg-white/70 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Status Area */}
                  <div className="w-full min-h-[80px] flex flex-col items-center justify-center text-center mb-4">
                    {isChecking && (
                      <div className="text-primary-600 flex flex-col items-center">
                        <p className="font-medium">Analyzing image...</p>
                        <p className="text-xs text-primary-400 mt-1">Checking for inappropriate content</p>
                      </div>
                    )}
                    
                    {profanityResult === 'passed' && (
                      <div className="text-green-600 flex flex-col items-center bg-green-50 w-full p-3 rounded-lg border border-green-100">
                        <CheckCircle2 className="w-6 h-6 mb-1" />
                        <p className="font-medium text-sm">Image approved!</p>
                        <p className="text-xs text-green-700 mt-0.5">Looks great and meets our guidelines.</p>
                      </div>
                    )}

                    {profanityResult === 'failed' && (
                      <div className="text-red-600 flex flex-col items-center bg-red-50 w-full p-3 rounded-lg border border-red-100">
                        <AlertTriangle className="w-6 h-6 mb-1" />
                        <p className="font-medium text-sm">Image rejected</p>
                        <p className="text-xs text-red-700 mt-0.5">Image does not match the profanity check so please upload another one.</p>
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-primary-600 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Crafting your campaign...</h2>
      <p className="text-gray-500 max-w-md">Applying your brand details and generating high-quality images in all selected sizes.</p>
      
      {/* Skeleton mockups */}
      <div className="mt-12 flex space-x-4 opacity-50">
        <div className="w-16 h-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="w-12 h-20 bg-gray-200 rounded animate-pulse delay-75"></div>
        <div className="w-24 h-12 bg-gray-200 rounded animate-pulse delay-150"></div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center z-50 transition-all duration-300 transform translate-y-0 opacity-100">
          <CheckCircle2 className="w-5 h-5 text-green-400 mr-3" />
          <span className="font-medium">Campaign image downloaded successfully!</span>
        </div>
      )}

      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Ready!</h1>
        <p className="text-gray-600">Your designs have been generated successfully.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Generated Files</h2>
            <div className="flex items-center mt-3 space-x-4">
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="format" checked={downloadFormat === 'digital'} onChange={() => setDownloadFormat('digital')} className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700 font-medium">Digital Use (PNG)</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" name="format" checked={downloadFormat === 'print'} onChange={() => setDownloadFormat('print')} className="text-primary-600 focus:ring-primary-500 h-4 w-4" />
                <span className="ml-2 text-sm text-gray-700 font-medium">Print Ready (PDF)</span>
              </label>
            </div>
          </div>
          <Button variant="primary" className="w-full sm:w-auto" onClick={handleDownload}><Download className="w-4 h-4 mr-2" /> Download All (ZIP)</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {generatedFiles.map((file, idx) => {
            const ratio = ASPECT_RATIOS.find(r => r.class === file.template.ratioClass);
            return (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 flex flex-col items-center group hover:border-primary-300 transition-colors">
                <div className="w-full bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                   <CanvasPreview template={file.template} data={file.data} ratioClass={ratio?.class} isMini={true} />
                </div>
                <div className="w-full flex justify-between items-center mt-auto">
                  <div className="overflow-hidden pr-2">
                    <p className="font-medium text-gray-900 text-sm truncate">{file.data.storeName}</p>
                    <p className="text-xs text-gray-500">{ratio?.name} • {downloadFormat === 'digital' ? 'PNG' : 'PDF'}</p>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <button onClick={() => setPreviewItem(file)} className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors flex items-center justify-center" title="Preview">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownload} className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors flex items-center justify-center" title="Download">
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
        <Button variant="outline" onClick={() => onNavigate('dashboard')}>Back to Dashboard</Button>
        <Button variant="outline" onClick={() => onNavigate('gallery')}>Create Another</Button>
        <Button variant="secondary" onClick={handleCopyLink}>
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
          {copied ? 'Link Copied!' : 'Share Link'}
        </Button>
      </div>

      {/* Full Size Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setPreviewItem(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreviewItem(null)} className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors">
              <X className="w-8 h-8" />
            </button>
            <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden shadow-2xl">
              <CanvasPreview 
                template={previewItem.template} 
                data={previewItem.data} 
                ratioClass={ASPECT_RATIOS.find(r => r.id === previewItem.sizeId)?.class} 
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <Button variant="secondary" onClick={() => setPreviewItem(null)}>Close</Button>
              <Button onClick={() => { handleDownload(); setPreviewItem(null); }}><Download className="w-4 h-4 mr-2" /> Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
