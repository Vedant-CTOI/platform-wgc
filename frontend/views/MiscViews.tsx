import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PageHeader, Button } from '../components/SharedUI';

interface MiscViewProps {
  onBack: () => void;
}

export const HelpView: React.FC<MiscViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader title="Help & Support" onBack={onBack} />
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E6E9ED] space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-black">How do I create a new campaign?</h4>
              <p className="text-[#634B6F] text-sm mt-1">Navigate to your dashboard and click the "Create New Campaign" button. You can then select a template, choose your aspect ratios, and customize the content.</p>
            </div>
            <div>
              <h4 className="font-semibold text-black">Can I add multiple stores to one campaign?</h4>
              <p className="text-[#634B6F] text-sm mt-1">Yes! During the customization step, you can select multiple stores from your account. The platform will automatically generate separate images for each store you select.</p>
            </div>
            <div>
              <h4 className="font-semibold text-black">What formats can I download?</h4>
              <p className="text-[#634B6F] text-sm mt-1">You can download your campaigns in PNG format for digital use (social media, WhatsApp) or PDF format for high-quality printing.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E6E9ED] pt-8">
          <h3 className="text-lg font-semibold text-black mb-2">Still need help?</h3>
          <p className="text-[#634B6F] text-sm mb-4">Our support team is available Monday through Friday, 9am to 6pm.</p>
          <a href="mailto:support@goldify.com" className="inline-flex items-center justify-center rounded-lg font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#ECE9ED] text-[#381F49] hover:bg-[#e1dce5] px-4 py-2.5 text-sm">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export const FaqView: React.FC<MiscViewProps> = ({ onBack }) => {
  const faqs = [
    { q: "How do I get started?", a: "Simply click on 'Choose a Template' or 'Create Account' to begin your journey." },
    { q: "Is it free to use?", a: "Yes, our basic templates are completely free to use for your business." },
    { q: "Can I add multiple stores?", a: "Absolutely! You can manage multiple store locations and generate creatives for all of them at once." },
    { q: "What formats can I download?", a: "You can download your campaigns in PNG format for digital use or PDF format for high-quality printing." },
    { q: "How do I change my store logo?", a: "Go to 'Store Management' from the menu, select your store, and click 'Change Logo'." },
    { q: "Are the templates customizable?", a: "Yes, you can customize the text, offer details, and select different aspect ratios for various platforms." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader title="Frequently Asked Questions" onBack={onBack} />
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-[#ECE9ED]/60 p-6 rounded-2xl border border-[#E6E9ED]">
            <h3 className="font-semibold text-black">{faq.q}</h3>
            <p className="text-[#634B6F] mt-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CombinedLegalContent: React.FC = () => (
  <>
    <p className="text-xs text-[#634B6F]">Last updated: October 2023</p>

    <h4 className="text-base font-semibold text-[#381F49] mt-4 mb-2">Terms &amp; Conditions</h4>

    <h5 className="text-black font-semibold mt-4 mb-1.5">1. Acceptance of Terms</h5>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>

    <h5 className="text-black font-semibold mt-4 mb-1.5">2. User License</h5>
    <p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis.</p>

    <h5 className="text-black font-semibold mt-4 mb-1.5">3. Disclaimer</h5>
    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue. Suspendisse dui purus, scelerisque at, vulputate vitae, pretium mattis, nunc.</p>

    <div className="border-t border-[#E6E9ED] my-6" />

    <h4 className="text-base font-semibold text-[#381F49] mb-2">Privacy Policy</h4>

    <h5 className="text-black font-semibold mt-4 mb-1.5">1. Information We Collect</h5>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>

    <h5 className="text-black font-semibold mt-4 mb-1.5">2. How We Use Your Information</h5>
    <p>Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante.</p>

    <h5 className="text-black font-semibold mt-4 mb-1.5">3. Data Security</h5>
    <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin pharetra nonummy pede. Mauris et orci. Aenean nec lorem. In porttitor. Donec laoreet nonummy augue.</p>
  </>
);

export const TermsView: React.FC<MiscViewProps> = ({ onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <PageHeader title="Terms & Privacy Policy" onBack={onBack} />
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E6E9ED] text-sm sm:text-base leading-relaxed text-[#634B6F]">
        <CombinedLegalContent />
      </div>
    </div>
  );
};

export const PrivacyView: React.FC<MiscViewProps> = ({ onBack }) => {
  return <TermsView onBack={onBack} />;
};

export interface LegalModalProps {
  onClose: () => void;
  requireConsent?: boolean;
  onAccept?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  onClose,
  requireConsent = false,
  onAccept,
}) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    if (!requireConsent) return;
    const checkScrollable = () => {
      if (el.scrollHeight <= el.clientHeight + 8) {
        setHasScrolledToBottom(true);
      }
    };
    const frame = requestAnimationFrame(checkScrollable);
    return () => cancelAnimationFrame(frame);
  }, [requireConsent]);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el || hasScrolledToBottom) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#E6E9ED] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — Goldify Plum 900 band with Gold seam */}
        <div className="px-6 py-4 bg-[#381F49] border-b-2 border-[#F2BE42]/70 flex justify-between items-center shrink-0">
          <h3 id="legal-modal-title" className="font-semibold text-white text-lg">
            Terms &amp; Privacy Policy
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Single Combined Scrollable Content */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="px-6 py-5 overflow-y-auto max-h-72 sm:max-h-80 text-sm text-[#634B6F] leading-relaxed"
        >
          <CombinedLegalContent />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6E9ED] bg-[#ECE9ED]/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {requireConsent ? (
            <>
              {!hasScrolledToBottom ? (
                <p className="text-xs text-[#634B6F]">Please scroll to the bottom to accept</p>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Decline
                </Button>
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  disabled={!hasScrolledToBottom}
                  onClick={() => {
                    onAccept?.();
                    onClose();
                  }}
                >
                  I Agree &amp; Accept
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-[#634B6F]">Please review carefully before using Goldify.</p>
              <Button type="button" size="sm" onClick={onClose} className="w-full sm:w-auto">
                Close
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
