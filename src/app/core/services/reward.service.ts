import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RewardDto, RedeemRewardDto, CreateHistoryRewardDto, RedeemHistoryRewardDto } from '../models/dtos.model';

@Injectable({
  providedIn: 'root'
})
export class RewardService {

  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:4375/api';

  // ===== CITIZEN: View & Redeem Rewards =====

  /** Citizen: Get all available rewards */
  getAvailableRewards(): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward/available`);
  }

  /** Citizen: Get rewards by category */
  getRewardsByCategory(category: string): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward/category/${category}`);
  }

  /** Citizen: Get popular rewards */
  getPopularRewards(topCount: number = 10): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward/popular`, {
      params: { topCount: topCount.toString() }
    });
  }

  /** Citizen: Search rewards */
  searchRewards(term: string): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward/search`, {
      params: { term }
    });
  }

  /** Citizen: Redeem a reward */
  redeemReward(dto: RedeemRewardDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Reward/redeem`, dto);
  }

  /** Get reward details */
  getReward(id: number): Observable<RewardDto> {
    return this.http.get<RewardDto>(`${this.apiUrl}/Reward/${id}`);
  }

  // ===== HISTORY REWARD: Track Rewards =====

  /** Get reward redemption history for a user */
  getRewardHistory(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/HistoryReward/user/${userId}`);
  }

  /** Get reward history summary */
  getRewardHistorySummary(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/HistoryReward/${userId}/summary`);
  }

  /** Redeem reward (using HistoryReward) */
  redeemHistoryReward(dto: RedeemHistoryRewardDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/HistoryReward/redeem`, dto);
  }

  /** Validate redeem before processing */
  validateRedeem(dto: RedeemHistoryRewardDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/HistoryReward/validate-redeem`, dto);
  }

  // ===== ADMIN: Manage Rewards =====

  /** Admin: Get all rewards */
  getAllRewards(): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward`);
  }

  /** Admin: Create reward (with image) */
  createReward(formData: FormData): Observable<RewardDto> {
    return this.http.post<RewardDto>(`${this.apiUrl}/Reward`, formData);
  }

  /** Admin: Update reward */
  updateReward(id: number, formData: FormData): Observable<RewardDto> {
    return this.http.put<RewardDto>(`${this.apiUrl}/Reward/${id}`, formData);
  }

  /** Admin: Delete reward */
  deleteReward(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Reward/${id}`);
  }

  /** Admin: Get reward statistics */
  getRewardStats(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Reward/${id}/stats`);
  }

  /** Admin: Update reward stock */
  updateRewardStock(id: number, quantity: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/Reward/${id}/stock`, quantity);
  }

  /** Admin: Get low stock rewards */
  getLowStockRewards(threshold: number = 10): Observable<RewardDto[]> {
    return this.http.get<RewardDto[]>(`${this.apiUrl}/Reward/low-stock`, {
      params: { threshold: threshold.toString() }
    });
  }

  /** Admin: Get all reward categories */
  getRewardCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Reward/categories`);
  }

  // ===== ADMIN: Manage Reward History =====

  /** Admin: Get all reward history */
  getAllRewardHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/HistoryReward`);
  }

  /** Admin: Get reward history with pagination & filters */
  getRewardHistoryPaged(filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/HistoryReward/paged`, { params: filters });
  }

  /** Admin: Create reward history entry */
  createRewardHistory(dto: CreateHistoryRewardDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/HistoryReward`, dto);
  }

  /** Admin: Bulk create reward history */
  createRewardHistoryBulk(dtos: CreateHistoryRewardDto[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/HistoryReward/bulk`, dtos);
  }

  /** Admin: Get reward history by ID */
  getRewardHistoryById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/HistoryReward/${id}`);
  }

  /** Admin: Update reward history status */
  updateRewardHistoryStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/HistoryReward/${id}/status`, status);
  }

  /** Admin: Delete reward history */
  deleteRewardHistory(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/HistoryReward/${id}`);
  }
}
