import {
  Component,
  OnInit,
  inject,
  computed,
  signal,
  DestroyRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { Reward } from '@core/models/rewards/reward.model';
import { LanguageService } from '@core/services/language.service';
import { CitizenService } from '@core/services/user.services/citizen.service';
import { CitizenRewardService } from '@core/services/user.services/citizenreward.service';
import { RewardService } from '@core/services/admin.services/adminreward.service';
import { CitizenStatsCardsComponent } from '../citizen-dashboard/stats-cards/stats-cards.component';

@Component({
  standalone: true,
  selector: 'app-reward-component',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
  imports: [CommonModule, FormsModule, CitizenStatsCardsComponent],
})
export class RewardsComponent implements OnInit {

  /* ========================
     Injects
  ======================== */
  private adminRewardService = inject(RewardService);
  private citizenRewardService = inject(CitizenRewardService);
  private citizenService = inject(CitizenService);
  private languageService = inject(LanguageService);
  private destroyRef = inject(DestroyRef);

  /* ========================
     Helpers
  ======================== */
  t = (key: string) => this.languageService.t(key);

  /* ========================
     Points & Stats
  ======================== */
  points = signal<number>(0);
  userPoints = computed(() => this.points());

  stats = computed(() => [
    {
      id: 'reward-points',
      icon: '🎁',
      label: this.t('rewardPoints'),
      value: String(this.points()),
      change: '',
      color: 'text-primary',
    }
  ]);

  /* ========================
     Rewards
  ======================== */
  rewards: Reward[] = [];
  originalRewards: Reward[] = [];
  searchTerm = '';
  isLoading = false;
  redeemingId: number | null = null;

  /* ========================
     Toast
  ======================== */
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  /* ========================
     Cart
  ======================== */
  cart = signal<Reward[]>([]);
  showCartModal = signal(false);
  isCheckingOut = signal(false);

  cartTotal = computed(() =>
    this.cart().reduce((sum, item) => sum + item.requiredPoints, 0)
  );

  cartItemCount = computed(() => this.cart().length);

  /* ========================
     Lifecycle
  ======================== */
  ngOnInit(): void {
    this.loadPoints();
    this.loadRewards();
  }

  /* ========================
     Loaders
  ======================== */
  loadPoints() {
    this.citizenService
      .getPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: res => this.points.set(res.points),
        error: () => this.points.set(0)
      });
  }

  loadRewards() {
    this.isLoading = true;
    this.adminRewardService.getAll().subscribe({
      next: res => {
        this.rewards = res;
        this.originalRewards = [...res];
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  /* ========================
     Search
  ======================== */
  search() {
    const term = this.searchTerm.trim().toLowerCase();
    this.rewards = term
      ? this.originalRewards.filter(r =>
          r.name.toLowerCase().includes(term)
        )
      : [...this.originalRewards];
  }

  resetSearch() {
    this.searchTerm = '';
    this.rewards = [...this.originalRewards];
  }

  /* ========================
     Redeem Single Reward
  ======================== */
redeemReward(reward: Reward) {
  if (!this.canRedeem(reward)) {
    this.showToastNotification('Cannot redeem this reward', 'error');
    return;
  }

  this.redeemingId = reward.id!;

this.citizenRewardService.redeem(reward.id!, 1).subscribe({
  next: res => {
    this.showToastNotification(res.message, 'success');
    this.loadRewards();
    this.loadPoints();
  },
  error: err => {
    this.showToastNotification(
      err?.error?.message || 'Redeem failed',
      'error'
    );
  },
  complete: () => {
    this.redeemingId = null;
  }
});

}



  canRedeem(reward: Reward): boolean {
    return (
      this.userPoints() >= reward.requiredPoints &&
      reward.stockQuantity > 0
    );
  }

  /* ========================
     Cart Methods
  ======================== */
  addToCart(reward: Reward) {
    if (!this.canRedeem(reward)) {
      this.showToastNotification('Cannot add this reward', 'error');
      return;
    }

    if (this.isInCart(reward)) {
      this.showToastNotification('Already in cart', 'error');
      return;
    }

    if (this.cartTotal() + reward.requiredPoints > this.userPoints()) {
      this.showToastNotification('Exceeds your points balance', 'error');
      return;
    }

    this.cart.update(items => [...items, reward]);
    this.showToastNotification(`"${reward.name}" added to cart`, 'success');
  }

  removeFromCart(reward: Reward) {
    this.cart.update(items => items.filter(i => i.id !== reward.id));
    this.showToastNotification(`"${reward.name}" removed`, 'success');
  }

  isInCart(reward: Reward): boolean {
    return this.cart().some(i => i.id === reward.id);
  }

  openCart() {
    this.showCartModal.set(true);
  }

  closeCart() {
    this.showCartModal.set(false);
  }

  clearCart() {
    this.cart.set([]);
    this.showToastNotification('Cart cleared', 'success');
  }

  /* ========================
     Redeem Cart
  ======================== */
  redeemCart() {
  if (this.cart().length === 0) {
    this.showToastNotification('Cart is empty', 'error');
    return;
  }

  if (this.cartTotal() > this.userPoints()) {
    this.showToastNotification('Not enough points', 'error');
    return;
  }

  this.isCheckingOut.set(true);

  const items = [...this.cart()];
  let successCount = 0;
  let completed = 0;

items.forEach(item => {
  this.citizenRewardService.redeem(item.id!, 1)
    .pipe(finalize(() => {
      completed++;

      if (completed === items.length) {
        this.isCheckingOut.set(false);

        if (successCount > 0) {
          this.cart.set([]);
          this.showCartModal.set(false);
          this.loadRewards();
          this.loadPoints();

          this.showToastNotification(
            `Redeemed ${successCount} reward(s) successfully`,
            'success'
          );
        } else {
          this.showToastNotification(
            'Not enough points or out of stock',
            'error'
          );
        }
      }
    }))
    .subscribe({
      next: () => successCount++,
      error: () => {}
    });
});

}



  /* ========================
     Toast
  ======================== */
  showToastNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => (this.showToast = false), 4000);
  }

  closeToast() {
    this.showToast = false;
  }
}
