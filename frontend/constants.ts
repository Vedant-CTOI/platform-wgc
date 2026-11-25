import { Template } from './types';

const GRAY_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23e5e7eb'/%3E%3Cpath d='M200 220a20 20 0 1 0 0-40 20 20 0 0 0 0 40zm-40 60l30-40 20 20 40-50 30 70H160z' fill='%239ca3af'/%3E%3C/svg%3E";

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Diwali Mega Sale',
    category: 'Diwali',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[610/794]',
    defaultText: {
      headline: 'FESTIVE MEGA SALE',
      subheadline: 'Light up your home with our special offers',
      offer: 'UP TO 50% OFF',
    },
    colorScheme: { bg: 'bg-gray-200', text: 'text-gray-900', accent: 'bg-gray-800' }
  },
  {
    id: 't2',
    name: 'Wedding Collection',
    category: 'Wedding',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[936/709]',
    defaultText: {
      headline: 'WEDDING SPECIAL',
      subheadline: 'Make your special day even more memorable',
      offer: 'FLAT 30% OFF',
    },
    colorScheme: { bg: 'bg-gray-100', text: 'text-gray-900', accent: 'bg-gray-700' }
  },
  {
    id: 't3',
    name: 'Concert Tickets',
    category: 'Concert',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-square',
    defaultText: {
      headline: 'LIVE IN CONCERT',
      subheadline: 'Get your tickets before they sell out',
      offer: 'BOOK NOW',
    },
    colorScheme: { bg: 'bg-gray-300', text: 'text-gray-900', accent: 'bg-black' }
  },
  {
    id: 't4',
    name: 'Office Supplies',
    category: 'Office',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[610/794]',
    defaultText: {
      headline: 'BACK TO OFFICE',
      subheadline: 'Stock up on essentials for the new year',
      offer: 'BULK DISCOUNTS',
    },
    colorScheme: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-gray-900' }
  },
  {
    id: 't5',
    name: 'Diwali Gifts',
    category: 'Diwali',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-square',
    defaultText: {
      headline: 'PERFECT GIFTS',
      subheadline: 'Find something special for everyone',
      offer: 'SHOP NOW',
    },
    colorScheme: { bg: 'bg-gray-100', text: 'text-gray-800', accent: 'bg-gray-600' }
  },
  {
    id: 't6',
    name: 'Wedding Decor',
    category: 'Wedding',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[936/709]',
    defaultText: {
      headline: 'DREAM DECOR',
      subheadline: 'Transform your venue into a magical space',
      offer: 'FREE CONSULTATION',
    },
    colorScheme: { bg: 'bg-gray-200', text: 'text-black', accent: 'bg-gray-900' }
  },
  {
    id: 't7',
    name: 'Music Festival',
    category: 'Concert',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[610/794]',
    defaultText: {
      headline: 'SUMMER FEST',
      subheadline: 'Three days of non-stop music and fun',
      offer: 'EARLY BIRD TICKETS',
    },
    colorScheme: { bg: 'bg-gray-300', text: 'text-gray-900', accent: 'bg-gray-800' }
  },
  {
    id: 't8',
    name: 'Corporate Event',
    category: 'Office',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[936/709]',
    defaultText: {
      headline: 'ANNUAL MEET',
      subheadline: 'Join us for our yearly corporate gathering',
      offer: 'RSVP NOW',
    },
    colorScheme: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
  },
  {
    id: 't9',
    name: 'Diwali Sweets',
    category: 'Diwali',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-square',
    defaultText: {
      headline: 'SWEET TREATS',
      subheadline: 'Delicious hampers for your loved ones',
      offer: 'PRE-ORDER',
    },
    colorScheme: { bg: 'bg-gray-100', text: 'text-gray-900', accent: 'bg-gray-700' }
  },
  {
    id: 't10',
    name: 'Bridal Wear',
    category: 'Wedding',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[610/794]',
    defaultText: {
      headline: 'BRIDAL ELEGANCE',
      subheadline: 'Discover our new collection of bridal wear',
      offer: 'UP TO 70% OFF',
    },
    colorScheme: { bg: 'bg-gray-200', text: 'text-gray-800', accent: 'bg-gray-900' }
  },
  {
    id: 't11',
    name: 'Rock Concert',
    category: 'Concert',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[936/709]',
    defaultText: {
      headline: 'ROCK THE NIGHT',
      subheadline: 'Experience the ultimate rock performance',
      offer: 'VIP PASSES',
    },
    colorScheme: { bg: 'bg-gray-300', text: 'text-black', accent: 'bg-gray-800' }
  },
  {
    id: 't12',
    name: 'Office Furniture',
    category: 'Office',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-square',
    defaultText: {
      headline: 'WORKSPACE UPGRADE',
      subheadline: 'Ergonomic furniture for a productive environment',
      offer: 'SPECIAL OFFERS',
    },
    colorScheme: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
  },
  {
    id: 't13',
    name: 'Diwali Crackers',
    category: 'Diwali',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[610/794]',
    defaultText: {
      headline: 'SAFE CELEBRATIONS',
      subheadline: 'Eco-friendly crackers for a green Diwali',
      offer: 'EXPLORE NOW',
    },
    colorScheme: { bg: 'bg-gray-100', text: 'text-gray-900', accent: 'bg-gray-700' }
  },
  {
    id: 't14',
    name: 'Wedding Photography',
    category: 'Wedding',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[936/709]',
    defaultText: {
      headline: 'CAPTURE MEMORIES',
      subheadline: 'Professional photography for your special day',
      offer: 'BOOK A SESSION',
    },
    colorScheme: { bg: 'bg-gray-200', text: 'text-gray-900', accent: 'bg-gray-800' }
  },
  {
    id: 't15',
    name: 'Festive Quarter Page',
    category: 'Diwali',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[468/709]',
    defaultText: { headline: 'FESTIVE OFFERS', subheadline: 'Celebrate the season with us', offer: 'VISIT TODAY' },
    colorScheme: { bg: 'bg-gray-100', text: 'text-gray-900', accent: 'bg-gray-800' }
  },
  {
    id: 't16',
    name: 'Bridal Standee',
    category: 'Wedding',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[800/2000]',
    defaultText: { headline: 'BRIDAL SEASON', subheadline: 'Walk in and explore the collection', offer: 'IN STORE NOW' },
    colorScheme: { bg: 'bg-gray-200', text: 'text-gray-900', accent: 'bg-gray-900' }
  },
  {
    id: 't17',
    name: 'In-store Poster',
    category: 'Concert',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[1000/1414]',
    defaultText: { headline: 'NEW ARRIVALS', subheadline: 'Ask our staff for details', offer: 'SHOP NOW' },
    colorScheme: { bg: 'bg-white', text: 'text-gray-900', accent: 'bg-black' }
  },
  {
    id: 't18',
    name: 'Highway Billboard',
    category: 'Office',
    thumbnail: GRAY_PLACEHOLDER,
    ratioClass: 'aspect-[3000/1000]',
    defaultText: { headline: 'PURE GOLD', subheadline: 'Timeless craftsmanship', offer: 'VISIT US' },
    colorScheme: { bg: 'bg-gray-300', text: 'text-gray-900', accent: 'bg-gray-800' }
  }
];

export const CATEGORIES = ['All', 'Diwali', 'Concert', 'Wedding', 'Office', 'Option 5', 'Option 6', 'Option 7', 'Option 8'];

// Media formats grouped into categories (gallery tabs + grouped size filter).
// NOTE: Quarter Page, Standee, Poster and Billboard ratios are placeholders until final specs are shared.
export const MEDIA_GROUPS = ['Print Ads', 'Social Media', 'Outdoor & Collateral'] as const;

export const ASPECT_RATIOS = [
  { id: '610x794', name: 'Vertical Full Page', class: 'aspect-[610/794]', group: 'Print Ads' },
  { id: '936x709', name: 'Horizontal Half Page', class: 'aspect-[936/709]', group: 'Print Ads' },
  { id: '468x709', name: 'Quarter Page', class: 'aspect-[468/709]', group: 'Print Ads' },
  { id: '621x621', name: '1:1 Square Post', class: 'aspect-square', group: 'Social Media' },
  { id: '800x2000', name: '1:2 Vertical Standee', class: 'aspect-[800/2000]', group: 'Outdoor & Collateral' },
  { id: '1000x1414', name: '1:1 In-store Poster', class: 'aspect-[1000/1414]', group: 'Outdoor & Collateral' },
  { id: '3000x1000', name: '2:1 Landscape Banner', class: 'aspect-[3000/1000]', group: 'Outdoor & Collateral' },
];

// Max creatives a user can customise in one session.
export const MAX_CREATIVES_PER_SESSION = 3;

// Address character limits — placeholders, to be finalised during development.
export const ADDRESS_LIMITS = { line1: 40, landmark: 30, city: 25 };

export const formatAddress = (line1?: string, landmark?: string, city?: string) =>
  [line1, landmark, city].filter(Boolean).join(', ');

// Mock data: stores for a returning (multi-branch) retailer.
export const RETURNING_USER_STORES = [
  { id: 's1', name: 'Store 1', address: '12 MG Road', landmark: 'Near City Mall', city: 'Mumbai', contactNumber: '98765 43210', retailerUrl: 'www.yourstore.com' },
  { id: 's2', name: 'Store 2', address: '45 Linking Road', landmark: 'Opp. Bandra Station', city: 'Mumbai', contactNumber: '91234 56789', retailerUrl: 'www.yourstore.com' },
  { id: 's3', name: 'Store 3', address: '78 Connaught Place', landmark: '', city: 'Delhi', contactNumber: '99887 77665', retailerUrl: '' },
  { id: 's4', name: 'Store 4', address: '9 Brigade Road', landmark: 'Near Metro', city: 'Bangalore', contactNumber: '90000 11122', retailerUrl: '' },
  { id: 's5', name: 'Store 5', address: '21 Park Street', landmark: '', city: 'Kolkata', contactNumber: '93333 44455', retailerUrl: 'www.yourstore.com' },
];

// Demo accounts for showcasing the first-time vs repeat user journeys.
export const DEMO_ACCOUNTS = {
  new: { email: 'new@demo.com', label: 'First-time user' },
  returning: { email: 'repeat@demo.com', label: 'Repeat user' },
};
export const DEMO_OTP = '1234';
