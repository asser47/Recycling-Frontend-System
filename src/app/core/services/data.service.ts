import { Injectable, signal, computed } from '@angular/core';
import { CollectionRequest } from '../models/collection-request.model';
import type { RequestStatus } from '../models/collection-request.model';

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  roles?: string[];
  currentRole?: string;
  points: number;
  level?: string;
  totalCollections?: number;
  totalEarnings?: number;
  rating?: number;
  avatar?: string;
}

export interface Stat {
  id: string;
  icon: string;
  label: string;
  value: string;
  change: string;
  color: string;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: string;
  category: string;
  available: boolean;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  requirements: string;
}

export interface PointHistory {
  id: number;
  action: string;
  points: number;
  date: string;
  type: 'earned' | 'redeemed' | 'refunded';
  relatedId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Collection Requests
  private _collectionRequests = signal<CollectionRequest[]>(this.getInitialRequests());
  collectionRequests = this._collectionRequests.asReadonly();

  // User Stats
  private _userStats = signal<Stat[]>(this.getInitialStats());
  userStats = this._userStats.asReadonly();

  // Rewards
  private _rewards = signal<Reward[]>(this.getInitialRewards());
  rewards = this._rewards.asReadonly();

  // Badges
  private _badges = signal<Badge[]>(this.getInitialBadges());
  badges = this._badges.asReadonly();

  // Point History
  private _pointHistory = signal<PointHistory[]>(this.getInitialPointHistory());
  pointHistory = this._pointHistory.asReadonly();

  // Current User
  private _currentUser = signal<User>(this.getInitialUser());
  currentUser = this._currentUser.asReadonly();

  // Computed values
  pendingRequests = computed(() =>
    this._collectionRequests().filter(r => r.status === 'pending')
  );

  inProgressRequests = computed(() =>
    this._collectionRequests().filter(r => r.status === 'in-progress')
  );

  completedRequests = computed(() =>
    this._collectionRequests().filter(r => r.status === 'completed')
  );

  earnedBadges = computed(() =>
    this._badges().filter(b => b.earned)
  );

  totalEarnedPoints = computed(() =>
    this._pointHistory().filter(h => h.type === 'earned').reduce((sum, h) => sum + h.points, 0)
  );

  // ===========================
  // Collection Request Methods
  // ===========================

  getRequestsByStatus(status: RequestStatus): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.status === status);
  }

  getRequestsByCitizenId(citizenId: string | number): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.citizenId === citizenId);
  }

  getRequestsByCollectorId(collectorId: string | number): CollectionRequest[] {
    return this._collectionRequests().filter(r => r.collectorId === collectorId);
  }

  updateRequestStatus(
    requestId: string | number,
    status: RequestStatus,
    collectorId?: string | number,
    estimatedArrivalTime?: string,
    routeOrder?: number
  ): void {
    const requests = this._collectionRequests().map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status,
          ...(collectorId !== undefined && { collectorId: collectorId as number }),
          ...(estimatedArrivalTime !== undefined && { estimatedArrivalTime }),
          ...(routeOrder !== undefined && { routeOrder })
        };
      }
      return r;
    });
    this._collectionRequests.set(requests);
  }

  acceptRequestForRoute(
    requestId: string | number,
    collectorId: string | number,
    estimatedArrivalTime: string,
    routeOrder: number
  ): void {
    this.updateRequestStatus(requestId, 'in-progress', collectorId, estimatedArrivalTime, routeOrder);
  }

  addRequest(request: CollectionRequest): void {
    const requests = [...this._collectionRequests(), request];
    this._collectionRequests.set(requests);
  }

  deleteRequest(requestId: string | number): void {
    const requests = this._collectionRequests().filter(r => r.id !== requestId);
    this._collectionRequests.set(requests);
  }

  // ===========================
  // Reward Methods
  // ===========================

  redeemReward(rewardId: number): boolean {
    const reward = this._rewards().find(r => r.id === rewardId);
    const user = this._currentUser();

    if (!reward || !reward.available || user.points < reward.points) {
      return false;
    }

    // Update user points
    this._currentUser.update(u => ({
      ...u,
      points: u.points - reward.points
    }));

    // Add to point history
    const historyEntry: PointHistory = {
      id: Date.now(),
      action: `Redeemed: ${reward.title}`,
      points: reward.points,
      date: new Date().toISOString().split('T')[0],
      type: 'redeemed',
      relatedId: rewardId
    };
    this._pointHistory.update(h => [historyEntry, ...h]);

    return true;
  }

  // ===========================
  // Points Methods
  // ===========================

  addPoints(points: number, reason: string, relatedId?: number): void {
    this._currentUser.update(u => ({
      ...u,
      points: u.points + points
    }));

    const historyEntry: PointHistory = {
      id: Date.now(),
      action: reason,
      points,
      date: new Date().toISOString().split('T')[0],
      type: 'earned',
      ...(relatedId !== undefined && { relatedId })
    };
    this._pointHistory.update(h => [historyEntry, ...h]);
  }

  refundPoints(points: number, reason: string, relatedId?: number): void {
    this._currentUser.update(u => ({
      ...u,
      points: Math.max(0, u.points - points)
    }));

    const historyEntry: PointHistory = {
      id: Date.now(),
      action: reason,
      points,
      date: new Date().toISOString().split('T')[0],
      type: 'refunded',
      ...(relatedId !== undefined && { relatedId })
    };
    this._pointHistory.update(h => [historyEntry, ...h]);
  }

  // ===========================
  // User Stats Methods
  // ===========================

  updateUserStats(statType: 'collections' | 'co2' | 'points', value: number): void {
    const user = this._currentUser();

    if (statType === 'collections') {
      this._currentUser.update(u => ({
        ...u,
        totalCollections: (u.totalCollections || 0) + value
      }));
    }

    // Update stats array
    const stats = this._userStats().map(stat => {
      if (stat.id === 'total-collections' && statType === 'collections') {
        return {
          ...stat,
          value: String((user.totalCollections || 0) + value)
        };
      }
      return stat;
    });
    this._userStats.set(stats);
  }

  updateStats(stats: Stat[]): void {
    this._userStats.set(stats);
  }

  // ===========================
  // User Methods
  // ===========================

  setCurrentUser(user: User): void {
    this._currentUser.set(user);
  }

  updateCurrentUser(updates: Partial<User>): void {
    this._currentUser.update(u => ({ ...u, ...updates }));
  }

  // ===========================
  // Initial Data
  // ===========================

  private getInitialRequests(): CollectionRequest[] {
    return [
      {
        id: 1,
        material: 'Plastic Bottles',
        weight: '15 kg',
        location: 'Downtown Cairo',
        lat: 30.0444,
        lng: 31.2357,
        status: 'pending',
        date: '2025-11-28',
        distance: '2.3 km',
        citizenName: 'Ahmed Ali',
        citizenId: 1,
        materials: ['plastic']
      },
      {
        id: 2,
        material: 'Paper & Cardboard',
        weight: '25 kg',
        location: 'Nasr City',
        lat: 30.0626,
        lng: 31.3169,
        status: 'in-progress',
        date: '2025-11-29',
        distance: '5.1 km',
        citizenName: 'Fatima Hassan',
        citizenId: 2,
        collectorId: 1,
        materials: ['paper']
      }
    ];
  }

  private getInitialStats(): Stat[] {
    return [
      {
        id: 'total-collections',
        icon: '📦',
        label: 'Total Collections',
        value: '48',
        change: '+5 this week',
        color: 'text-primary'
      },
      {
        id: 'total-points',
        icon: '⭐',
        label: 'Total Points',
        value: '1250',
        change: '+250 this month',
        color: 'text-accent'
      }
    ];
  }

  private getInitialRewards(): Reward[] {
    return [
      {
        id: 1,
        title: 'Discount Voucher',
        description: '10% off on eco-friendly products',
        points: 500,
        icon: '🎫',
        category: 'popular',
        available: true
      },
      {
        id: 2,
        title: 'Gift Card',
        description: '$25 shopping gift card',
        points: 1000,
        icon: '💳',
        category: 'popular',
        available: true
      }
    ];
  }

  private getInitialBadges(): Badge[] {
    return [
      {
        id: 1,
        name: 'Green Warrior',
        description: 'Complete 10 collections',
        icon: '🌿',
        earned: true,
        earnedDate: '2025-11-15',
        requirements: 'Complete 10 collections'
      },
      {
        id: 2,
        name: 'Top Recycler',
        description: 'Recycle 100kg',
        icon: '🏆',
        earned: false,
        requirements: 'Recycle 100kg total'
      }
    ];
  }

  private getInitialPointHistory(): PointHistory[] {
    return [
      {
        id: 1,
        action: 'Plastic collection completed',
        points: 50,
        date: '2025-11-28',
        type: 'earned',
        relatedId: 1
      },
      {
        id: 2,
        action: 'Paper collection completed',
        points: 30,
        date: '2025-11-27',
        type: 'earned',
        relatedId: 2
      }
    ];
  }

  private getInitialUser(): User {
    return {
      id: 1,
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+20 123 456 7890',
      address: 'Cairo, Egypt',
      roles: ['citizen', 'collector'],
      currentRole: 'citizen',
      points: 1250,
      level: 'gold',
      totalCollections: 24,
      totalEarnings: 1240,
      rating: 4.8
    };
  }

  // TODO: Replace with API calls
  // async getRequests(): Promise<CollectionRequest[]>
  // async createRequest(request: CollectionRequest): Promise<CollectionRequest>
  // async updateRequest(id: number, updates: Partial<CollectionRequest>): Promise<CollectionRequest>
}
