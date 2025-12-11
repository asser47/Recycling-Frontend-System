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
