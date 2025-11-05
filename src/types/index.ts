export type MessageStatus = 'sent' | 'delivered' | 'read';
export type MessageReaction = 'heart' | 'thumbs_up' | 'laugh' | 'angry' | 'sad' | 'wow';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: MessageStatus;
  userImageUrl?: string;
  aiImageUrl?: string;
  audioUrl?: string;
  isNativeAd?: boolean;
  nativeAdCode?: string;
  nativeAdId?: string;
  deliveredAt?: Date;
  readAt?: Date;
  isLiked?: boolean;
  reaction?: MessageReaction;
  isViewOnce?: boolean; // WhatsApp-style view once
  isViewed?: boolean; // Track if view-once was opened
}

export interface EmotionalStateOutput {
  response: string;
  newMood: string;
  newIgnoreUntil?: number; // For client to update localStorage
}

export interface AIProfile {
  name: string;
  avatarUrl: string;
  status: string; // Main status line for ChatHeader
  statusStoryText?: string; // Text for the Status Page story
  statusStoryImageUrl?: string; // Image URL for the Status Page story (legacy, use statusStoryMediaUrl)
  statusStoryMediaUrl?: string; // Media URL for story (images, videos, audio)
  statusStoryMediaType?: 'image' | 'video' | 'audio'; // Type of story media
  statusStoryHasUpdate?: boolean; // Ring indicator for new story on Status Page
}

export interface AvatarOption {
  id: string;
  url: string;
  aiHint: string;
}

export interface AdminStatusDisplay {
  id: string;
  name: string;
  avatarUrl: string;
  statusText: string;
  statusImageUrl?: string;
  hasUpdate: boolean;
}

export interface ManagedContactStatus {
  id: string;
  name: string;
  avatarUrl: string;
  statusText: string;
  hasUpdate: boolean;
  dataAiHint?: string;
  statusImageUrl?: string;
}

export interface AdSettings {
  adsEnabledGlobally: boolean;

  adsterraBannerCode: string;
  adsterraBannerEnabled: boolean;
  adsterraNativeBannerCode: string;
  adsterraNativeBannerEnabled: boolean;
  adsterraPopunderCode: string;
  adsterraPopunderEnabled: boolean;

  monetagBannerCode: string;
  monetagBannerEnabled: boolean;
  monetagNativeBannerCode: string;
  monetagNativeBannerEnabled: boolean;
  monetagPopunderCode: string;
  monetagPopunderEnabled: boolean;
}

export interface AIMediaAsset {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string; // Full public URL for uploaded files or external URLs
  description?: string; // Optional description for admin reference
  storagePath?: string; // Path in Supabase Storage (for uploaded files)
  storageBucket?: string; // Bucket name in Supabase Storage (for uploaded files)
  uploadedAt?: string; // Timestamp when file was uploaded
}
export interface AIMediaAssetsConfig {
  assets: AIMediaAsset[];
}

// Key for storing AdSettings in Supabase app_configurations table
export const AD_SETTINGS_CONFIG_KEY = 'ad_settings_kruthika_chat_v1';
// Key for storing AIProfile in Supabase app_configurations table
export const AI_PROFILE_CONFIG_KEY = 'ai_profile_kruthika_chat_v1';
// Key for storing Admin's own status in Supabase app_configurations table
export const ADMIN_OWN_STATUS_CONFIG_KEY = 'admin_own_status_config_v1';
// Key for storing Managed Demo Contacts in Supabase app_configurations table
export const MANAGED_DEMO_CONTACTS_CONFIG_KEY = 'managed_demo_contacts_config_v1';
// Key for storing AI's sharable media assets in Supabase app_configurations table
export const AI_MEDIA_ASSETS_CONFIG_KEY = 'ai_media_assets_config_v1';