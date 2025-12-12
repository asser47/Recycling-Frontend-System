// src/app/features/admin/dashboard/dashboard.ts
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ChartOptions, ChartData } from 'chart.js';
import { MaterialService } from '../../../core/services/material.service';
import { FactoryService } from '../../../core/services/factory.service';
import { OrderService } from '../../../core/services/order.service';
import { CitizenService } from '../../../core/services/citizen.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  cards: any[] = [];
  materials: any[] = [];
  factories: any[] = [];
  orders: any[] = [];
  users: any[] = [];

  private cdr = inject(ChangeDetectorRef);

  private materialService = inject(MaterialService);
  private factoryService = inject(FactoryService);
  private orderService = inject(OrderService);
  private userService = inject(CitizenService);

  // Chart Config
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

  loadDashboard() {
    forkJoin({
      materials: this.materialService.getAll().pipe(catchError(() => of([]))),
      factories: this.factoryService.getAll().pipe(catchError(() => of([]))),
      orders: this.orderService.getAll().pipe(catchError(() => of([]))),
      users: this.userService ? this.userService.getAll().pipe(catchError(() => of([]))) : of([]),
    }).subscribe(
      (data: any) => {
        this.materials = data.materials || [];
        this.factories = data.factories || [];
        this.orders = data.orders || [];
        this.users = data.users || [];

        // Metrics
        const totalUsers = this.users.length;
        const collectionsThisMonth = this.countThisMonth(this.orders);
        const collectionsLastMonth = this.countLastMonth(this.orders);
        const collectionsChange = this.percentChange(collectionsThisMonth, collectionsLastMonth);

        const co2Kg = this.computeCO2FromMaterials(this.materials);
        const co2Tons = +(co2Kg / 1000).toFixed(1);

        const rewardsDistributed = 0;

        const usersThisMonth = this.countThisMonthFromUsers(this.users);
        const usersLastMonth = this.countLastMonthFromUsers(this.users);
        const usersChange = this.percentChange(usersThisMonth, usersLastMonth);

        this.cards = [
          { title: 'Total Users', count: totalUsers, changePercent: usersChange, subtitle: `${usersThisMonth} this month`, icon: '👥' },
          { title: 'Collections This Month', count: collectionsThisMonth, changePercent: collectionsChange, subtitle: `${collectionsLastMonth} last month`, icon: '📦' },
          { title: 'CO₂ Saved (tons)', count: co2Tons, changePercent: null, subtitle: `${co2Kg.toFixed(0)} kg`, icon: '🌿' },
          { title: 'Rewards Distributed', count: rewardsDistributed, changePercent: null, subtitle: '', icon: '🎁' },
        ];

        //----------------------------------------------
        // 🔥 CHART BASED ON REAL DB DATA (Orders + Users)
        //----------------------------------------------
        const monthsMeta = this.getLastMonths(6);
        const labels = monthsMeta.map((m) => m.label);

        const collectionSeries = monthsMeta.map((m) =>
          this.countOrdersByMonth(this.orders, m.year, m.monthIndex)
        );

        const usersSeries = monthsMeta.map((m) =>
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
              label: 'Active Users (Signups)',
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
      },
      (err) => console.error('Dashboard load error', err)
    );
  }

  //-------------------------------------------------------
  // Helpers
  //-------------------------------------------------------

  private getLastMonths(n: number) {
    const now = new Date();
    const months: { label: string; year: number; monthIndex: number }[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });
      months.push({ label, year: d.getFullYear(), monthIndex: d.getMonth() });
    }
    return months;
  }

  private countOrdersByMonth(orders: any[], year: number, monthIndex: number) {
    return orders.filter((o) => {
      const d = this.safeDate(o.orderDate || o.date || o.createdAt);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  private countUsersByMonth(users: any[], year: number, monthIndex: number) {
    return users.filter((u) => {
      const d = this.safeDate(u.createdAt || u.registeredAt || u.date);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  private countThisMonth(items: any[]) {
    const now = new Date();
    return items.filter((it) => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }

  private countLastMonth(items: any[]) {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return items.filter((it) => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }).length;
  }

  private countThisMonthFromUsers(users: any[]) {
    const now = new Date();
    return users.filter((u) => {
      const d = this.safeDate(u.createdAt || u.registeredAt || u.date);
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }

  private countLastMonthFromUsers(users: any[]) {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return users.filter((u) => {
      const d = this.safeDate(u.createdAt || u.registeredAt || u.date);
      return d && d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }).length;
  }

  private percentChange(current: number, previous: number) {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return +(((current - previous) / previous) * 100).toFixed(0);
  }

  private safeDate(val: any): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  private parseSizeKg(size: any): number {
    if (size == null) return 0;
    const s = String(size).trim();
    const m = s.match(/[\d.,]+/);
    if (!m) return 0;
    const num = parseFloat(m[0].replace(',', '.'));
    if (isNaN(num)) return 0;
    if (/l\b|ltr|liter|litre/i.test(s)) return num;
    if (/kg/i.test(s)) return num;
    if (/g\b/i.test(s)) return num / 1000;
    return num;
  }

  private co2FactorByType: Record<string, number> = {
    plastic: 2.5,
    paper: 1.0,
    glass: 0.6,
    metal: 3.0,
  };

  private computeCO2FromMaterials(materials: any[]): number {
    let totalKg = 0;
    for (const m of materials) {
      const weightKg = this.parseSizeKg(m.size);
      const key = (m.typeName || '').toLowerCase();
      const factor = this.co2FactorByType[key] ?? 1.0;
      totalKg += weightKg * factor;
    }
    return totalKg;
  }
}
