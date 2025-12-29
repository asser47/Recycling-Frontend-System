import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Reward, RewardStats } from '../models/reward.model';

@Injectable({ providedIn: 'root' })
export class RewardService {

  private http = inject(HttpClient);

  private baseUrl = 'https://localhost:4375/api/Reward';
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
      .get<Reward[]>(this.baseUrl)
      .pipe(map(res => this.mapRewards(res)));
  }

  create(formData: FormData) {
    return this.http
      .post<Reward>(this.baseUrl, formData)
      .pipe(map(res => this.mapReward(res)));
  }

  update(id: number, formData: FormData) {
    return this.http
      .put<Reward>(`${this.baseUrl}/${id}`, formData)
      .pipe(map(res => this.mapReward(res)));
  }

  // ✅ كانت ناقصة
  getLowStock(threshold: number = 10) {
    return this.http
      .get<Reward[]>(`${this.baseUrl}/low-stock`, {
        params: { threshold }
      })
      .pipe(map(res => this.mapRewards(res)));
  }

  updateStock(id: number, quantity: number) {
    // الباك مستني رقم raw مش object
    return this.http.patch(
      `${this.baseUrl}/${id}/stock`,
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
    .get<RewardStats>(`${this.baseUrl}/${id}/stats`)
    .pipe(
      map(res => ({
        ...res,
        imageUrl: this.normalizeImageUrl(res.imageUrl)
      }))
    );
}



  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
