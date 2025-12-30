import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG, API_ENDPOINTS } from '@core/config/api.config';
import { Reward } from '@core/models/reward.model';

@Injectable({ providedIn: 'root' })
export class CitizenRewardService {

  private http = inject(HttpClient);

  getAvailableRewards() {
    return this.http.get<Reward[]>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.available}`);
  }

  redeem(rewardId: number, quantity: number = 1) {
    const body = {
      RewardId: rewardId,
      Quantity: quantity
    };

    console.log('Redeem payload:', body);

    return this.http.post<{
      success: boolean;
      message: string;
    }>(`${API_CONFIG.baseUrl}${API_ENDPOINTS.rewards.redeem}`, body);
  }
}



