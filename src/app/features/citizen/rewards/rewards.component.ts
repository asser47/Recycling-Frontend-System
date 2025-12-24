import { Component, OnInit, inject, computed, signal, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { RewardService } from '@core/services/reward.service';
import { Reward } from '@core/models/reward.model';
import { DataService } from '@core/services/data.service';
import { LanguageService } from '@core/services/language.service';
import { CitizenService } from '@core/services/citizen.service';
import { CitizenStatsCardsComponent } from '../citizen-dashboard/stats-cards/stats-cards.component';

@Component({
  standalone: true,
  selector: 'app-reward-component',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
  imports: [CommonModule, FormsModule, CitizenStatsCardsComponent],
})
export class RewardsComponent implements OnInit {

  private rewardService = inject(RewardService);
  private dataService = inject(DataService);
  private languageService = inject(LanguageService);
  private citizenService = inject(CitizenService);
  private destroyRef = inject(DestroyRef);

  t = (key: string) => this.languageService.t(key);

  currentUser = computed(() => this.dataService.currentUser());
  points = signal<number>(0);
  userPoints = computed(() => this.points());

  stats = computed(() => {
    return [
      {
        id: 'reward-points',
        icon: '🎁',
        label: this.t('rewardPoints'),
        value: String(this.points()),
        change: '',
        color: 'text-primary',
      },
    ];
  });

  rewards: Reward[] = [];
  originalRewards: Reward[] = [];
  searchTerm = '';
  isLoading = false;
  redeemingId: number | null = null;

  // Toast notification
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Cart
  cart = signal<Reward[]>([]);
  showCartModal = signal(false);
  cartTotal = computed(() => this.cart().reduce((sum, item) => sum + item.requiredPoints, 0));
  cartItemCount = computed(() => this.cart().length);
  isCheckingOut = signal(false);

  ngOnInit(): void {
    this.loadPoints();
    this.loadRewards();
  }

  loadPoints() {
    this.citizenService
      .getPoints()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.points.set(response.points);
        },
        error: () => {
          this.points.set(0);
        }
      });
  }

  loadRewards() {
    this.isLoading = true;
    this.rewardService.getAll().subscribe({
      next: (res: Reward[]) => {
        this.rewards = res;
        this.originalRewards = [...res];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  search() {
    const term = this.searchTerm.trim().toLowerCase();
    this.rewards = term
      ? this.originalRewards.filter(r => r.name.toLowerCase().includes(term))
      : [...this.originalRewards];
  }

  resetSearch() {
    this.searchTerm = '';
    this.rewards = [...this.originalRewards];
  }

  redeemReward(reward: Reward) {
    if (this.userPoints() < reward.requiredPoints) {
      this.showToastNotification(
        `You need ${reward.requiredPoints - this.userPoints()} more points!`,
        'error'
      );
      return;
    }

    if (reward.stockQuantity === 0) {
      this.showToastNotification('This reward is out of stock!', 'error');
      return;
    }

    if (confirm(`Redeem "${reward.name}" for ${reward.requiredPoints} points?`)) {
      this.redeemingId = reward.id!;

      // Simulate async operation
      setTimeout(() => {
        const success = this.dataService.redeemReward(reward.id!);

        if (success) {
          this.showToastNotification(
            `Successfully redeemed "${reward.name}"! New balance: ${this.userPoints()} points`,
            'success'
          );
          this.loadRewards();
        } else {
          this.showToastNotification(
            'Failed to redeem reward. Please try again.',
            'error'
          );
        }

        this.redeemingId = null;
      }, 800);
    }
  }

  canRedeem(reward: Reward): boolean {
    return this.userPoints() >= reward.requiredPoints && reward.stockQuantity > 0;
  }

  showToastNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }

  closeToast() {
    this.showToast = false;
  }

  // Cart Methods
  addToCart(reward: Reward) {
    if (!this.canRedeem(reward)) {
      if (reward.stockQuantity === 0) {
        this.showToastNotification('This reward is out of stock!', 'error');
      } else {
        this.showToastNotification(`You need ${reward.requiredPoints - this.userPoints()} more points!`, 'error');
      }
      return;
    }

    // Check if already in cart
    if (this.isInCart(reward)) {
      this.showToastNotification('This reward is already in your cart!', 'error');
      return;
    }

    // Check if adding would exceed points
    if (this.cartTotal() + reward.requiredPoints > this.userPoints()) {
      this.showToastNotification('Adding this would exceed your available points!', 'error');
      return;
    }

    this.cart.update(items => [...items, reward]);
    this.showToastNotification(`"${reward.name}" added to cart!`, 'success');
  }

  removeFromCart(reward: Reward) {
    this.cart.update(items => items.filter(item => item.id !== reward.id));
    this.showToastNotification(`"${reward.name}" removed from cart`, 'success');
  }

  isInCart(reward: Reward): boolean {
    return this.cart().some(item => item.id === reward.id);
  }

  openCart() {
    this.showCartModal.set(true);
  }

  closeCart() {
    this.showCartModal.set(false);
  }

  clearCart() {
    this.cart.set([]);
    this.showToastNotification('Cart cleared!', 'success');
  }

  redeemCart() {
    if (this.cart().length === 0) {
      this.showToastNotification('Your cart is empty!', 'error');
      return;
    }

    if (this.cartTotal() > this.userPoints()) {
      this.showToastNotification('Not enough points for all items!', 'error');
      return;
    }

    this.isCheckingOut.set(true);

    // Process each item in cart
    let successCount = 0;
    const cartItems = [...this.cart()];

    setTimeout(() => {
      for (const reward of cartItems) {
        const success = this.dataService.redeemReward(reward.id!);
        if (success) {
          successCount++;
        }
      }

      if (successCount === cartItems.length) {
        this.showToastNotification(
          `Successfully redeemed ${successCount} reward${successCount > 1 ? 's' : ''}! New balance: ${this.userPoints()} points`,
          'success'
        );
        this.cart.set([]);
        this.showCartModal.set(false);
        this.loadRewards();
        this.loadPoints();
      } else {
        this.showToastNotification(
          `Redeemed ${successCount} of ${cartItems.length} rewards. Some items failed.`,
          'error'
        );
      }

      this.isCheckingOut.set(false);
    }, 1000);
  }
}
