
import type { AIProfile, AvatarOption, AdminStatusDisplay, ManagedContactStatus, AdSettings, AIMediaAssetsConfig } from '@/types';

// For AIProfile.avatarUrl, AvatarOption.url, and statusStoryImageUrl:
// These should be URLs to publicly hosted images.

export const defaultAIProfile: AIProfile = {
  name: 'Kruthika',
  avatarUrl: '/kruthika-avatar.svg',
  status: '🌸 Living my best life! Let\'s chat! 🌸',
  statusStoryText: 'Ask me anything! 💬',
  statusStoryImageUrl: undefined,
  statusStoryHasUpdate: true,
};

export const defaultAdminStatusDisplay: AdminStatusDisplay = {
  id: "admin-own-status",
  name: "My Status",
  avatarUrl: "/kruthika-avatar.svg",
  statusText: "Tap to update from Admin Panel!",
  statusImageUrl: undefined,
  hasUpdate: false,
};

export const defaultManagedContactStatuses: ManagedContactStatus[] = [
  { id: "demo1", name: "Ananya ✨", avatarUrl: "https://placehold.co/100x100.png/FF9800/FFFFFF?text=A", statusText: "10 minutes ago", hasUpdate: true, dataAiHint: "profile woman", statusImageUrl: undefined },
  { id: "demo2", name: "Priya 💖", avatarUrl: "https://placehold.co/100x100.png/4CAF50/FFFFFF?text=P", statusText: "Wow, new pic! 📸", hasUpdate: true, dataAiHint: "girl fashion", statusImageUrl: "https://placehold.co/300x500.png/4CAF50/FFFFFF?text=Priya%27s+Story" },
  { id: "demo3", name: "Sneha 😊", avatarUrl: "https://placehold.co/100x100.png/03A9F4/FFFFFF?text=S", statusText: "Seen 2 hours ago", hasUpdate: false, dataAiHint: "female portrait", statusImageUrl: undefined },
];

// Default direct link URLs for ad networks
export const DEFAULT_ADSTERRA_DIRECT_LINK = "https://www.profitablecpmrate.com/cfe28perz?key=8b84a37b0c3f0e8a9c5d6e7f8a9b0c1d";
export const DEFAULT_MONETAG_DIRECT_LINK = "https://www.monetag.com/c/default?key=1a2b3c4d5e6f7g8h9i0j";

export const defaultAdSettings: AdSettings = {
  adsEnabledGlobally: true,
  
  adsterraBannerCode: "<!-- Adsterra Banner Code Placeholder: Paste full script here -->",
  adsterraBannerEnabled: true,
  adsterraPopunderCode: "<!-- Adsterra Pop-under Script Placeholder: Paste full script here -->",
  adsterraPopunderEnabled: true,
  adsterraSocialBarCode: "<!-- Adsterra Social Bar Code Placeholder: Paste full script here -->",
  adsterraSocialBarEnabled: false,
  adsterraDirectLink: DEFAULT_ADSTERRA_DIRECT_LINK,
  adsterraDirectLinkEnabled: false,

  monetagBannerCode: "<!-- Monetag Banner Code Placeholder: Paste full script here -->",
  monetagBannerEnabled: true,
  monetagPopunderCode: "<!-- Monetag Pop-under Script Placeholder: Paste full script here -->",
  monetagPopunderEnabled: true,
  monetagSocialBarCode: "<!-- Monetag Social Bar Code Placeholder: Paste full script here -->",
  monetagSocialBarEnabled: false,
  monetagDirectLink: DEFAULT_MONETAG_DIRECT_LINK,
  monetagDirectLinkEnabled: false,

  maxDirectLinkAdsPerDay: 3,
  maxDirectLinkAdsPerSession: 2,
  directLinkMessageInterval: 10,
  directLinkInactivityMinutes: 2,
};

// Strategic media assets for psychological engagement
// These images will be sent at strategic moments to increase user engagement
export const defaultAIMediaAssetsConfig: AIMediaAssetsConfig = {
  assets: [
    // Selfies - for building personal connection
    { id: 'selfie_morning', type: 'image', url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=800&fit=crop&crop=face', description: 'Morning selfie - fresh faced' },
    { id: 'selfie_cafe', type: 'image', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop&crop=face', description: 'At the café where I work' },
    { id: 'selfie_college', type: 'image', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop&crop=face', description: 'College vibes' },
    { id: 'selfie_evening', type: 'image', url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop&crop=face', description: 'Evening golden hour' },
    
    // Lifestyle - creating FOMO and interest
    { id: 'food_mumbai', type: 'image', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop', description: 'Street food in Mumbai' },
    { id: 'cafe_work', type: 'image', url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop', description: 'Working at the café' },
    { id: 'college_friends', type: 'image', url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop', description: 'Hanging with college friends' },
    { id: 'mumbai_rain', type: 'image', url: 'https://images.unsplash.com/photo-1571767942220-e72ee5e645c5?w=600&h=400&fit=crop', description: 'Mumbai monsoon vibes' },
    { id: 'study_session', type: 'image', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop', description: 'Psychology study session' },
    
    // Emotional moments - for deeper connection
    { id: 'sunset_bandra', type: 'image', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', description: 'Beautiful Bandra sunset' },
    { id: 'temple_visit', type: 'image', url: 'https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=600&h=400&fit=crop', description: 'Temple visit with family' },
    { id: 'festival_prep', type: 'image', url: 'https://images.unsplash.com/photo-1604596725663-7ad4b85b7eee?w=600&h=400&fit=crop', description: 'Festival preparations at home' },
    
    // Teasing/Flirty - strategically rare
    { id: 'mirror_selfie', type: 'image', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop&crop=face', description: 'Quick mirror selfie' },
    { id: 'getting_ready', type: 'image', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=400&fit=crop', description: 'Getting ready to go out' },
  ],
};

// This is kept for legacy avatar picker if ever re-enabled, but not used for Kruthika's profile avatar anymore.
export const availableAvatars: AvatarOption[] = [
  { id: 'avatar1', url: 'https://placehold.co/100x100.png/FFC107/000000?text=K1', aiHint: 'woman illustration' },
  { id: 'avatar2', url: 'https://placehold.co/100x100.png/4CAF50/FFFFFF?text=K2', aiHint: 'girl avatar' },
  { id: 'avatar3', url: 'https://placehold.co/100x100.png/2196F3/FFFFFF?text=K3', aiHint: 'female icon' },
  { id: 'avatar4', url: 'https://placehold.co/100x100.png/9C27B0/FFFFFF?text=K4', aiHint: 'woman face' },
  { id: 'avatar5', url: 'https://placehold.co/100x100.png/795548/FFFFFF?text=K5', aiHint: 'person silhouette' },
];
