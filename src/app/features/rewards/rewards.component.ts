import { Component, inject, computed, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { RewardService } from '../../core/services/reward.service';
import { Reward } from '../../core/models/reward.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../shared/ui/card/card.component';
import { BadgeDisplayComponent } from '../../shared/ui/badge-display/badge-display.component';
import { PointHistoryItemComponent } from '../../shared/ui/point-history-item/point-history-item.component';

@Component({
  selector: 'app-rewards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeDisplayComponent,
    PointHistoryItemComponent
  ],
  template: `
    <div class="min-h-screen py-8 px-4 md:px-6 lg:px-8 pb-24 md:pb-8">
      <div class="max-w-7xl mx-auto space-y-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-bold text-foreground">{{ t('rewards') }}</h1>
            <p class="text-muted-foreground mt-2">استبدل نقاطك بمكافآت رائعة</p>
          </div>
        </div>

        <!-- Success Message -->
        @if (successMessage()) {
          <div class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-in fade-in">
            <span class="text-2xl">✅</span>
            <div>
              <h3 class="font-semibold text-green-800">تم الاستبدال بنجاح!</h3>
              <p class="text-sm text-green-700 mt-1">{{ successMessage() }}</p>
            </div>
            <button
              class="ml-auto text-green-600 hover:text-green-800 font-bold"
              (click)="successMessage.set('')">
              ×
            </button>
          </div>
        }

        <!-- Error Message -->
        @if (errorMessage()) {
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in">
            <span class="text-2xl">❌</span>
            <div>
              <h3 class="font-semibold text-red-800">خطأ في الاستبدال</h3>
              <p class="text-sm text-red-700 mt-1">{{ errorMessage() }}</p>
            </div>
            <button
              class="ml-auto text-red-600 hover:text-red-800 font-bold"
              (click)="errorMessage.set('')">
              ×
            </button>
          </div>
        }

        <!-- Points Summary -->
        <div class="grid md:grid-cols-3 gap-6">
          <app-card class="shadow-md border-l-4 border-l-primary">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1 uppercase tracking-wide font-semibold">إجمالي النقاط</p>
                  <p class="text-4xl font-bold text-primary">{{ currentUser().points }}</p>
                  <p class="text-xs text-muted-foreground mt-1">متاح للاستخدام</p>
                </div>
                <span class="text-6xl opacity-50">⭐</span>
              </div>
            </app-card-content>
          </app-card>

          <app-card class="shadow-md border-l-4 border-l-green-500">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1 uppercase tracking-wide font-semibold">هذا الشهر</p>
                  <p class="text-4xl font-bold text-green-600">+{{ monthlyPoints() }}</p>
                  <p class="text-xs text-muted-foreground mt-1">نقاط جديدة</p>
                </div>
                <span class="text-6xl opacity-50">📈</span>
              </div>
            </app-card-content>
          </app-card>

          <app-card class="shadow-md border-l-4 border-l-blue-500">
            <app-card-content class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-muted-foreground mb-1 uppercase tracking-wide font-semibold">مستواك</p>
                  <p class="text-4xl font-bold text-blue-600 capitalize">{{ getLevelName(currentUser().level || 'bronze') }}</p>
                  <p class="text-xs text-muted-foreground mt-1">أنت على طريق الصواب</p>
                </div>
                <span class="text-6xl opacity-50">🏆</span>
              </div>
            </app-card-content>
          </app-card>
        </div>

        <!-- Badges Section -->
        @if (badges().length > 0) {
          <app-card class="shadow-md">
            <app-card-header>
              <app-card-title class="text-2xl">🏆 شارات وإنجازاتك</app-card-title>
              <app-card-description>استمر في العمل الجاد لكسب المزيد من الشارات</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                @for (badge of badges(); track badge.id) {
                  <app-badge-display
                    [badge]="badge"
                  ></app-badge-display>
                }
              </div>
            </app-card-content>
          </app-card>
        }

        <!-- Rewards Grid -->
        <div>
          <h2 class="text-2xl font-bold mb-6">🎁 المكافآت المتاحة</h2>

          @if (rewards().length === 0) {
            <app-card class="shadow-md">
              <app-card-content class="p-12 text-center">
                <span class="text-6xl block mb-4">🎯</span>
                <p class="text-lg font-semibold text-muted-foreground">لا توجد مكافآت متاحة حالياً</p>
                <p class="text-sm text-muted-foreground mt-2">عد لاحقاً لمزيد من المكافآت الرائعة</p>
              </app-card-content>
            </app-card>
          } @else {
            <div class="reward-grid">
              @for (reward of rewardsFromAPI(); track reward.id) {
                <div class="reward-card" [class.opacity-60]="!reward.isAvailable || currentUser().points < reward.requiredPoints">
                  <!-- Image -->
                  <div class="reward-image-wrapper">
                    <img
                      [src]="reward.imageUrl || '/assets/default-reward.png'"
                      [alt]="reward.name"
                    >
                  </div>

                  <!-- Content -->
                  <div class="reward-card-content">
                    <h4>{{ reward.name }}</h4>
                    <p class="text-sm text-gray-600 mb-2">{{ reward.description }}</p>

                    <!-- Points -->
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-2xl font-bold text-primary">{{ reward.requiredPoints }}</span>
                      <span class="text-xs text-muted-foreground font-semibold">نقطة</span>
                    </div>

                    <!-- Stock Badge -->
                    <span class="text-xs px-3 py-1 rounded-full font-medium block text-center mb-3"
                          [class.text-green-700]="reward.stockQuantity > 5"
                          [class.bg-green-50]="reward.stockQuantity > 5"
                          [class.text-red-700]="reward.stockQuantity <= 5"
                          [class.bg-red-50]="reward.stockQuantity <= 5">
                      📦 {{ reward.stockQuantity }} متاح
                    </span>

                    <!-- Status Badge -->
                    @if (reward.isAvailable && currentUser().points >= reward.requiredPoints) {
                      <span class="text-xs text-green-700 bg-green-50 px-3 py-1 rounded-full font-medium block text-center mb-3">
                        ✅ جاهز للاستبدال
                      </span>
                    } @else if (reward.isAvailable && currentUser().points < reward.requiredPoints) {
                      <span class="text-xs text-orange-700 bg-orange-50 px-3 py-1 rounded-full font-medium block text-center mb-3">
                        ⚠️ تحتاج {{ reward.requiredPoints - currentUser().points }} نقطة
                      </span>
                    } @else {
                      <span class="text-xs text-red-700 bg-red-50 px-3 py-1 rounded-full font-medium block text-center mb-3">
                        ❌ غير متاح
                      </span>
                    }

                    <!-- Action Button -->
                    <app-button
                      [disabled]="!reward.isAvailable || currentUser().points < reward.requiredPoints || isRedeeming()"
                      [variant]="reward.isAvailable && currentUser().points >= reward.requiredPoints ? 'default' : 'outline'"
                      class="w-full text-sm"
                      (onClick)="redeemReward(reward.id, reward.name, reward.requiredPoints)"
                    >
                      @if (reward.isAvailable && currentUser().points >= reward.requiredPoints) {
                        <span>✅ استبدل الآن</span>
                      } @else if (!reward.isAvailable) {
                        <span>❌ غير متاح</span>
                      } @else {
                        <span>💰 نقاط غير كافية</span>
                      }
                    </app-button>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Point History -->
        @if (pointHistory().length > 0) {
          <app-card class="shadow-md">
            <app-card-header>
              <app-card-title class="text-2xl">📊 سجل النقاط</app-card-title>
              <app-card-description>تابع كل كسبك واستبدالك للنقاط</app-card-description>
            </app-card-header>
            <app-card-content>
              <div class="space-y-3">
                @for (history of pointHistory() | slice:0:10; track history.id) {
                  <app-point-history-item
                    [history]="history"
                  ></app-point-history-item>
                }
              </div>
              @if (pointHistory().length > 10) {
                <div class="text-center pt-4">
                  <button class="text-primary hover:underline text-sm font-medium">
                    عرض جميع السجلات ({{ pointHistory().length }})
                  </button>
                </div>
              }
            </app-card-content>
          </app-card>
        }
      </div>
    </div>
  `,
  styles: [`
    /* Reward Grid & Cards */
    :host ::ng-deep .reward-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    :host ::ng-deep .reward-card {
      background: white;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
      border: 1px solid #f0f0f0;
    }

    :host ::ng-deep .reward-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    /* Image Wrapper */
    :host ::ng-deep .reward-image-wrapper {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host ::ng-deep .reward-image {
      max-width: 85%;
      max-height: 85%;
      object-fit: contain;
      display: block;
    }

    /* Card Content */
    :host ::ng-deep .reward-card-content {
      padding: 14px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    :host ::ng-deep .reward-card-content h4 {
      font-size: 16px;
      font-weight: 700;
      color: #222;
      margin: 0 0 6px 0;
      text-align: center;
    }

    :host ::ng-deep .reward-card-content p {
      font-size: 13px;
      color: #666;
      margin: 0;
      text-align: center;
      line-height: 1.4;
    }

    /* Opacity for unavailable */
    :host ::ng-deep .reward-card.opacity-60 {
      opacity: 0.6;
      pointer-events: none;
    }

    @media (max-width: 768px) {
      :host ::ng-deep .reward-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
      }

      :host ::ng-deep .reward-card-content {
        padding: 12px;
      }

      :host ::ng-deep .reward-card-content h4 {
        font-size: 14px;
      }
    }
  `]
})
export class RewardsComponent implements OnInit {
  languageService = inject(LanguageService);
  dataService = inject(DataService);
  rewardService = inject(RewardService);

  t = (key: string) => this.languageService.t(key);

  // Messages
  successMessage = signal('');
  errorMessage = signal('');
  isRedeeming = signal(false);

  // Rewards from API
  rewardsFromAPI = signal<Reward[]>([]);

  // Get data from service
  currentUser = computed(() => this.dataService.currentUser());
  badges = computed(() => this.dataService.badges());
  rewards = computed(() => this.dataService.rewards());
  pointHistory = computed(() => this.dataService.pointHistory());

  ngOnInit(): void {
    this.loadRewards();
  }

  loadRewards(): void {
    this.rewardService.getAll().subscribe({
      next: (rewards) => {
        this.rewardsFromAPI.set(rewards);
      },
      error: (err) => {
        console.error('Error loading rewards:', err);
        this.errorMessage.set('حدث خطأ في تحميل المكافآت');
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  monthlyPoints = computed(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.pointHistory()
      .filter(h => {
        const historyDate = new Date(h.date);
        return historyDate.getMonth() === currentMonth &&
               historyDate.getFullYear() === currentYear &&
               h.type === 'earned';
      })
      .reduce((sum, h) => sum + h.points, 0);
  });

  availableRewardsCount = computed(() => {
    return this.rewards().filter(r => r.available).length;
  });

  redeemReward(rewardId: number, rewardTitle: string, pointsCost: number): void {
    this.isRedeeming.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    // Simulate async operation
    setTimeout(() => {
      const success = this.dataService.redeemReward(rewardId);

      if (success) {
        this.successMessage.set(`تم استبدال "${rewardTitle}" بنجاح! تم خصم ${pointsCost} نقطة من حسابك.`);
        // Auto hide after 5 seconds
        setTimeout(() => this.successMessage.set(''), 5000);
      } else {
        const reward = this.rewards().find(r => r.id === rewardId);
        if (!reward?.available) {
          this.errorMessage.set('المكافأة غير متاحة حالياً');
        } else if (this.currentUser().points < pointsCost) {
          this.errorMessage.set(`ليس لديك نقاط كافية. تحتاج إلى ${pointsCost - this.currentUser().points} نقطة إضافية.`);
        } else {
          this.errorMessage.set('حدث خطأ أثناء محاولة استبدال المكافأة. حاول مرة أخرى.');
        }
        // Auto hide after 5 seconds
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
      this.isRedeeming.set(false);
    }, 1000);
  }

  getLevelName(level: string): string {
    const levels: { [key: string]: string } = {
      'bronze': '🥉 برونزي',
      'silver': '🥈 فضي',
      'gold': '🥇 ذهبي',
      'platinum': '💎 بلاتيني',
      'diamond': '👑 ماسي'
    };
    return levels[level?.toLowerCase()] || level;
  }
}
