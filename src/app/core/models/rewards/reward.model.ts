export interface Reward {
  id: number;
  name: string;
  description: string;
  category: string;
  requiredPoints: number;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string | null;
}


export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  requirements?: string;
}

export interface PointHistory {
  id: number;
  action: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed' | 'refunded';
  relatedId?: number;
}
export interface RewardStats {
  id: number;
  name: string;
  description: string;
  category: string;
  requiredPoints: number;
  stockQuantity: number;
  isAvailable: boolean;
  imageUrl?: string | null;

  // ⭐ stats
  totalRedemptions: number;
  pendingRedemptions: number;

}
