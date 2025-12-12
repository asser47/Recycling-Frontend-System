export interface Reward {
_restock: any;
  id?: number;
  name: string;
  description?: string;
  category?: string;
  requiredPoints: number;     // بدل pointsCost
  stockQuantity: number;      // بدل stock
  imageUrl?: string;
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
  type: 'earned' | 'redeemed';
  relatedId?: number;
}
