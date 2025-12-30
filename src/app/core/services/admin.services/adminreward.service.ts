import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { Reward, RewardStats } from '../../models/rewards/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {

  private http = inject(HttpClient);

  private apiRoot = 'https://localhost:4375';

  // =====================
  // IMAGE URL NORMALIZER
  // =====================
  private normalizeImageUrl(imageUrl?: string | null): string | null {
    if (!imageUrl) return null;

    // لو URL كامل (حتى لو ببورت غلط)
    if (imageUrl.startsWith('http')) {
      return imageUrl.replace(/https?:\/\/localhost:\d+/, this.apiRoot);
    }

    // لو جاي /uploads/...
    if (imageUrl.startsWith('/')) {
      return `${this.apiRoot}${imageUrl}`;
    }

    // لو اسم ملف بس
    return `${this.apiRoot}/uploads/rewards/${imageUrl}`;
  }

  // =====================
  // MAPPERS
  // =====================
  private mapReward(r: Reward): Reward {
    return {
      ...r,
      imageUrl: this.normalizeImageUrl(r.imageUrl)
    };
  }

  private mapRewards(list: Reward[]): Reward[] {
    return list.map(r => this.mapReward(r));
  }

  // =====================
  // API CALLS
  // =====================
  getAll() {
    return this.http
      .get<Reward[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.getAll}`)
      .pipe(map(res => this.mapRewards(res)));
  }

  create(formData: FormData) {
    return this.http
      .post<Reward>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.create}`, formData)
      .pipe(map(res => this.mapReward(res)));
  }

  update(id: number, formData: FormData) {
    return this.http
      .put<Reward>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.update(id)}`, formData)
      .pipe(map(res => this.mapReward(res)));
  }

  // ✅ كانت ناقصة
  getLowStock(threshold: number = 10) {
    return this.http
      .get<Reward[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.getLowStock(threshold)}`)
      .pipe(map(res => this.mapRewards(res)));
  }

  updateStock(id: number, quantity: number) {
    // الباك مستني رقم raw مش object
    return this.http.patch(
      `${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.update(id)}/stock`,
      quantity,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

getStats(id: number) {
  return this.http
    .get<RewardStats>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.getById(id)}/stats`)
    .pipe(
      map(res => ({
        ...res,
        imageUrl: this.normalizeImageUrl(res.imageUrl)
      }))
    );
}

  delete(id: number) {
    return this.http.delete(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.delete(id)}`);
  }
}
