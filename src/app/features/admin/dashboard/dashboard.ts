// src/app/features/admin/dashboard/dashboard.ts
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { MaterialService } from '../../../core/services/materials.services/material.service';
import { FactoryService } from '../../../core/services/factory.services/factory.service';
import { OrderService } from '../../../core/services/order.services/order.service';
import { CitizenService } from '../../../core/services/user.services/citizen.service';
import { RewardService } from '@core/services/admin.services/adminreward.service';

interface DashboardCard {
  title: string;
  count: number;
  subtitle: string;
  icon: string;
  changePercent: number | null;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {

  cards: DashboardCard[] = [];

  materials: any[] = [];
  factories: any[] = [];
  orders: any[] = [];
  users: any[] = [];
totalRedeemptions = 0;
totalRedeemedPoints = 0;

  private cdr = inject(ChangeDetectorRef);

  private materialService = inject(MaterialService);
  private factoryService = inject(FactoryService);
  private orderService = inject(OrderService);
  private userService = inject(CitizenService);
private rewardService = inject(RewardService);

  // ---------------------------
  // Chart Config
  // ---------------------------
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  ngOnInit() {
    this.loadDashboard();
  }

  // ---------------------------
  // Load Dashboard Data
  // ---------------------------
  loadDashboard() {
forkJoin({
  materials: this.materialService.getAll().pipe(catchError(() => of([]))),
  factories: this.factoryService.getAll().pipe(catchError(() => of([]))),
  orders: this.orderService.getAll().pipe(catchError(() => of([]))),
  users: this.userService.getAll().pipe(catchError(() => of([]))),
  rewards: this.rewardService.getAll().pipe(catchError(() => of([]))), // ✅ جديد
})
.subscribe({
      next: (data: any) => {

        this.materials = data.materials ?? [];
        this.factories = data.factories ?? [];
        this.orders = data.orders ?? [];
        this.users = data.users ?? [];

        // ---------------------------
        // Admin Metrics
        // ---------------------------
        const totalUsers = this.users.length;
const rewards = data.rewards ?? [];

this.loadTotalRedeemptions(rewards);

        const deliveredOrders = this.orders.filter(
          o => o.status === 'Delivered'
        ).length;

        const completedOrders = this.orders.filter(
          o => o.status === 'Completed'
        ).length;

        const co2Kg = this.computeCO2FromMaterials(this.materials);
        const co2Tons = +(co2Kg / 1000).toFixed(1);

        this.cards = [
          {
            title: 'Total Users',
            count: totalUsers,
            subtitle: 'Registered users',
            changePercent: null,
            icon: '👥'
          },
          {
            title: 'Delivered Orders',
            count: deliveredOrders,
            subtitle: 'Waiting for admin review',
            changePercent: null,
            icon: '🚚'
          },
          {
            title: 'Completed Orders',
            count: completedOrders,
            subtitle: 'Approved by admin',
            changePercent: null,
            icon: '✅'
          },
          {
            title: 'CO₂ Saved (tons)',
            count: co2Tons,
            subtitle: `${co2Kg.toFixed(0)} kg`,
            changePercent: null,
            icon: '🌿'
          },
          {
            title: 'Rewards Distributed',
            count: this.totalRedeemptions,
            subtitle: 'Points granted by admin',
            changePercent: null,
            icon: '🎁'
          },
        ];

        // ---------------------------
        // Chart Data
        // ---------------------------
        const monthsMeta = this.getLastMonths(6);
        const labels = monthsMeta.map(m => m.label);

        const collectionSeries = monthsMeta.map(m =>
          this.countOrdersByMonth(this.orders, m.year, m.monthIndex)
        );

        const usersSeries = monthsMeta.map(m =>
          this.countUsersByMonth(this.users, m.year, m.monthIndex)
        );

        this.lineChartData = {
          labels,
          datasets: [
            {
              label: 'Waste Collection (Orders)',
              data: collectionSeries,
              tension: 0.4,
              fill: true,
              backgroundColor: 'rgba(16,185,129,.20)',
              borderColor: '#10b981',
              borderWidth: 2,
              pointBackgroundColor: '#10b981',
            },
            {
              label: 'User Signups',
              data: usersSeries,
              tension: 0.35,
              fill: false,
              borderColor: '#0284c7',
              borderWidth: 2,
              pointBackgroundColor: '#0284c7',
            },
          ],
        };

        this.cdr.detectChanges();
      }
    });
  }

  // ---------------------------
  // Rewards Logic (Admin-only)
  // ---------------------------

  // ---------------------------
  // Helpers
  // ---------------------------
  private getLastMonths(n: number) {
    const now = new Date();
    const months: { label: string; year: number; monthIndex: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthIndex: d.getMonth()
      });
    }
    return months;
  }

  private countOrdersByMonth(orders: any[], year: number, monthIndex: number) {
    return orders.filter(o => {
      const d = this.safeDate(o.orderDate || o.createdAt);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  private countUsersByMonth(users: any[], year: number, monthIndex: number) {
    return users.filter(u => {
      const d = this.safeDate(u.createdAt);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  private safeDate(val: any): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  private parseSizeKg(size: any): number {
    if (!size) return 0;
    const num = parseFloat(size);
    return isNaN(num) ? 0 : num;
  }

  private co2FactorByType: Record<string, number> = {
    plastic: 2.5,
    can: 1.0,
    glass: 0.6,
    carton: 3.0,
  };

  private computeCO2FromMaterials(materials: any[]): number {
    let totalKg = 0;
    for (const m of materials) {
      const weightKg = this.parseSizeKg(m.size);
      const factor = this.co2FactorByType[(m.typeName || '').toLowerCase()] ?? 1;
      totalKg += weightKg * factor;
    }
    return totalKg;
  }

  private loadTotalRedeemptions(rewards: any[]) {
  if (!rewards.length) {
    this.totalRedeemptions = 0;
    return;
  }

  const statsCalls = rewards.map(r =>
    this.rewardService.getStats(r.id).pipe(
      catchError(() => of({ totalRedeemptions: 0 }))
    )
  );

forkJoin(statsCalls).subscribe((statsList: any[]) => {

  console.log('🔥 Reward stats list:', statsList);

this.totalRedeemptions = 0;
this.totalRedeemedPoints = 0;

statsList.forEach(s => {
  const redemptions = s.totalRedemptions || 0;
  const points = s.requiredPoints || 0;

  this.totalRedeemptions += redemptions;
  this.totalRedeemedPoints += redemptions * points;
});



  this.updateRewardsCard();
  this.cdr.detectChanges();
});

}
private updateRewardsCard() {
  const index = this.cards.findIndex(
    c => c.title === 'Rewards Distributed'
  );

  if (index !== -1) {
    this.cards[index] = {
      ...this.cards[index],
      count: this.totalRedeemedPoints, // ⭐ المهم
      subtitle: 'Points granted to users'
    };
  }
}


}
