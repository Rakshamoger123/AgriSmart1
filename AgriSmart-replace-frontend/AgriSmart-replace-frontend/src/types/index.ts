export type UserRole = 'farmer' | 'officer';

export interface UserProfile {
  fullName: string;
  mobile: string;
  email?: string;
  role: UserRole;
  state: string;
  district: string;
  landSize?: string;
  soilCardNo?: string;
  irrigationType?: string;
  preferredCrop?: string;
  officerBadgeNo?: string;
  designation?: string;
  assignedTaluks?: string;
  preferredLang?: 'English' | 'Kannada';
}

export interface DistrictAgriData {
  district: string;
  displayName: string;
  region: string;
  soilType: string;
  temp: number;
  humidity: number;
  rainfall: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  recommendedCrop: string;
  recommendedCropKannada: string;
  confidenceScore: number;
  cropImage: string;
  description: string;
  alternativeCrop: string;
  alternativeCropKannada: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  riskReason: string;
  climateStatus: string;
  sowingWindow: string;
  waterRequirement: string;
  expectedYield: string;
  marketPrice: string;
  npkRecommendation: string;
}

export interface FarmerQuery {
  id: string;
  farmerName: string;
  location: string;
  district: string;
  query: string;
  time: string;
  status: 'Pending' | 'Replied';
  recommendedCrop?: string;
  officerReply?: string;
  repliedAt?: string;
}

export interface AdvisoryPost {
  id: string;
  title: string;
  district: string;
  category: 'Pest Alert' | 'Weather Advisory' | 'Fertilizer Guide' | 'Sowing Window';
  date: string;
  author: string;
  content: string;
  importance: 'High' | 'Medium' | 'Critical';
}

export interface FarmerDirectoryRecord {
  id: string;
  name: string;
  district: string;
  taluk: string;
  phone: string;
  acreage: string;
  mainCrop: string;
  soilType: string;
  queriesSent: number;
  lastActive: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'query' | 'alert' | 'advisory' | 'system';
  isRead: boolean;
  targetRole?: UserRole;
}
