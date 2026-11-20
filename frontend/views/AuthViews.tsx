import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, PageHeader } from '../components/SharedUI';
import { ViewState, UserProfile, StoreInfo } from '../types';
import { RETURNING_USER_STORES, DEMO_ACCOUNTS, DEMO_OTP } from '../constants';
import { Store, Image as ImageIcon, MapPin, Phone, CheckCircle2, UploadCloud, AlertTriangle, X, Loader2, Plus, Trash2, Zap, Shield, Palette, Mail, Send } from 'lucide-react';

interface AuthProps {
  onNavigate: (view: ViewState) => void;
  onLogin: (user: UserProfile) => void;
  user?: UserProfile | null;
  onSetAuthMode?: (mode: 'new' | 'returning') => void;
  authMode?: 'new' | 'returning';
}

export const LandingView: React.FC<AuthProps> = ({ onNavigate, user }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20 sm:py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Lorem ipsum dolor sit amet <span className="text-primary-600">consectetur.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Choose a template, add your store details once, and generate professional marketing materials for all your social channels instantly.
          </p>
          <div className="flex flex-col items-center space-y-4">
            <Button size="lg" onClick={() => onNavigate(user ? 'gallery' : 'login')} className="w-full sm:w-auto px-8">
              Choose a Template
            </Button>
            {!user && (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate('register')} 
                  className="text-primary-600 font-medium hover:text-primary-700 hover:underline text-sm"
                >
                  Create Account
                </button>
                <span className="text-gray-300">|</span>
                <button 
                  onClick={() => onNavigate('login')} 
                  className="text-primary-600 font-medium hover:text-primary-700 hover:underline text-sm"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* About the Platform */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Platform</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Platform is designed specifically for small and medium businesses to effortlessly create high-quality, branded promotional content. We bridge the gap between complex design tools and the fast-paced needs of retail marketing, allowing you to focus on what you do best: running your business.
          </p>
        </div>
      </section>

      {/* Key Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Key Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Generate campaigns in seconds. No more waiting for designers or struggling with complex software.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <Palette className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">On-Brand Always</h3>
              <p className="text-gray-600">Your logo, your address, your contact info—automatically applied to every template perfectly.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable & Secure</h3>
              <p className="text-gray-600">Your data and assets are stored securely, ensuring your business information is always protected.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4 text-left">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900">How do I get started?</h3>
              <p className="text-gray-600 mt-2">Simply click on "Choose a Template" or "Create Account" to begin your journey.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900">Is it free to use?</h3>
              <p className="text-gray-600 mt-2">Yes, our basic templates are completely free to use for your business.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="font-bold text-gray-900">Can I add multiple stores?</h3>
              <p className="text-gray-600 mt-2">Absolutely! You can manage multiple store locations and generate creatives for all of them at once.</p>
            </div>
          </div>
          <Button variant="outline" className="mt-10" onClick={() => onNavigate('faq')}>
            View All FAQs
          </Button>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-10">Have questions or need custom templates? We're here to help.</p>
          
          <form className="space-y-4 text-left bg-white p-8 rounded-2xl border border-gray-100 shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Name" placeholder="Your name" />
              <Input label="Email" type="email" placeholder="Your email address" />
            </div>
            <div className="w-full mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 focus:outline-none sm:text-sm transition-colors min-h-[120px]"
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              <Send className="w-4 h-4 mr-2" /> Send Message
            </Button>
          </form>
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

  // Standard 15-character GSTIN format: 2-digit state code + PAN + entity no. + 'Z' + checksum
  const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

  const handleGstChange = (value: string) => {
    setGstNumber(value.toUpperCase().replace(/\s/g, ''));
    setGstStatus('idle');
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

  const handleContinue = () => {
    if (!email || !firstName || !lastName || gstStatus !== 'verified') return;
    onSetAuthMode?.('new');
    onNavigate('otp');
  };

  const isFormValid = email && firstName && lastName && gstStatus === 'verified';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white sm:bg-gray-50">
      <div className="max-w-md w-full space-y-8 sm:bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-white font-bold text-2xl leading-none">P</span>
          </div>
          <h2 className="text-center text-2xl font-medium text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            to continue to Platform
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input 
                label="Last Name" 
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input 
              label="Email ID" 
              type="email" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="border-t border-gray-200 pt-6 mt-4">
              <div className="flex items-end gap-2">
                <div className="flex-grow">
                  <Input 
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
              <p className={`text-sm mt-1 flex items-center ${gstStatus === 'verified' ? 'text-green-600' : 'text-gray-500'}`}>
                {gstStatus === 'verified' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                {gstStatus === 'verifying'
                  ? 'Verifying GSTIN...'
                  : gstStatus === 'verified'
                    ? 'GSTIN verified'
                    : 'We use your GSTIN to verify that you are a registered business.'}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Terms</a> and <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row-reverse items-center justify-between gap-4">
            <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={!isFormValid}>
              Send Email OTP
            </Button>
            <button type="button" onClick={() => onNavigate('login')} className="text-primary-600 font-medium hover:text-primary-700 text-sm">
              Sign in instead
            </button>
          </div>
        </form>
      </div>
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

  // One-click demo sign-in: fills the email, then continues to OTP
  const demoSignIn = (kind: 'new' | 'returning') => {
    setEmail(DEMO_ACCOUNTS[kind].email);
    setTimeout(() => {
      onSetAuthMode?.(kind);
      onNavigate('otp');
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white sm:bg-gray-50">
      <div className="max-w-md w-full space-y-8 sm:bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-white font-bold text-2xl leading-none">P</span>
          </div>
          <h2 className="text-center text-2xl font-medium text-gray-900">Sign in</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            to continue to Platform
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
            <button type="button" onClick={() => onNavigate('register')} className="text-primary-600 font-medium hover:text-primary-700 text-sm">
              Create account
            </button>
          </div>
        </form>

        {/* Demo accounts (for showcasing the two journeys) */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 text-center">Demo accounts</p>
          <div className="grid grid-cols-2 gap-3">
            {(['new', 'returning'] as const).map(kind => (
              <button
                key={kind}
                type="button"
                onClick={() => demoSignIn(kind)}
                className="p-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-colors text-left"
              >
                <span className="block text-sm font-bold text-gray-900">{DEMO_ACCOUNTS[kind].label}</span>
                <span className="block text-xs text-gray-500 mt-0.5 truncate">{DEMO_ACCOUNTS[kind].email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">OTP: {DEMO_OTP}</p>
        </div>
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-white sm:bg-gray-50">
      <div className="max-w-md w-full space-y-8 sm:bg-white p-4 sm:p-10 sm:rounded-3xl sm:shadow-sm sm:border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <span className="text-white font-bold text-2xl leading-none">P</span>
          </div>
          <h2 className="text-center text-2xl font-medium text-gray-900">Verify it's you</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 4-digit code to your email.
          </p>
        </div>
        
        <div className="mt-8 space-y-8">
          <div className="flex justify-center space-x-4">
            {otp.map((data, index) => (
              <input
                className="w-14 h-14 text-center text-2xl font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
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
              <span className="text-gray-500">Resend code in 00:{timer.toString().padStart(2, '0')}</span>
            ) : (
              <button className="text-primary-600 font-medium hover:text-primary-700">Resend OTP</button>
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
            <button type="button" onClick={() => onNavigate(authMode === 'new' ? 'register' : 'login')} className="text-primary-600 font-medium hover:text-primary-700 text-sm">
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
