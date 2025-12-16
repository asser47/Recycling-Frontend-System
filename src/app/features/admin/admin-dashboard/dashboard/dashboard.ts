// src/app/features/admin/dashboard/dashboard.ts
import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { ChartOptions, ChartData } from 'chart.js';
import { AdminService } from '../../../../core/services/admin.service';
import { OrderService } from '../../../../core/services/order.service';
import { CollectorService } from '../../../../core/services/collector.service';
import { BaseChartDirective } from 'ng2-charts';
import { MaterialDto, ApplicationUserDto } from '../../../../core/models/dtos.model';
import { Factory } from '../../../../core/models/factory.model';
import { OrderDto } from '@core/models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class AdminDashboardComponent implements OnInit {
  // Services
  private adminService = inject(AdminService);
  private orderService = inject(OrderService);
  private collectorService = inject(CollectorService);

  // State Signals
  isLoading = signal(false);
  error = signal<string | null>(null);
  materials = signal<MaterialDto[]>([]);
  factories = signal<Factory[]>([]);
  orders = signal<OrderDto[]>([]);
  collectors = signal<ApplicationUserDto[]>([]);
  cards = signal<any[]>([]);

  // Chart Data Signals
  lineChartData = signal<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' }
    }
  };

  // Computed Properties for Dashboard Stats
  stats = computed(() => {
    const allOrders = this.orders();
    const allCollectors = this.collectors();
    const allMaterials = this.materials();

    const collectionsThisMonth = this.countThisMonth(allOrders);
    const collectionsLastMonth = this.countLastMonth(allOrders);
    const collectionsChange = this.percentChange(collectionsThisMonth, collectionsLastMonth);

    const co2Kg = this.computeCO2FromMaterials(allMaterials);
    const co2Tons = +(co2Kg / 1000).toFixed(1);

    const totalCollectors = allCollectors.length;

    return [
      { title: 'Total Collectors', count: totalCollectors, changePercent: null, subtitle: 'Active', icon: '👷' },
      { title: 'Collections This Month', count: collectionsThisMonth, changePercent: collectionsChange, subtitle: `${collectionsLastMonth} last month`, icon: '📦' },
      { title: 'CO₂ Saved (tons)', count: co2Tons, changePercent: null, subtitle: `${co2Kg.toFixed(0)} kg`, icon: '🌿' },
      { title: 'Pending Orders', count: allOrders.filter(o => o.status === 'Pending').length, changePercent: null, subtitle: 'Awaiting assignment', icon: '⏳' },
    ];
  });

  ngOnInit() {
    this.loadDashboard();
  }

  /**
   * Load all dashboard data from services
   */
  loadDashboard() {
    this.isLoading.set(true);
    this.error.set(null);

    forkJoin({
      materials: this.adminService.getAllMaterials().pipe(catchError(() => of([]))),
      factories: this.adminService.getAllFactories().pipe(catchError(() => of([]))),
      orders: this.orderService.getAllOrders().pipe(catchError(() => of([]))),
      collectors: this.collectorService.getAllCollectors().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        // Update state signals
        this.materials.set(data.materials || []);
        this.factories.set(data.factories || []);
        this.orders.set(data.orders || []);
        this.collectors.set(data.collectors || []);

        // Update cards with computed stats
        this.cards.set(this.stats());

        // Build charts from data
        this.buildCharts(data.orders, data.collectors);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Dashboard load error:', err);
        this.error.set('Failed to load dashboard data');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Build chart data from loaded data
   */
  private buildCharts(allOrders: any[], allCollectors: any[]) {
    const monthsMeta = this.getLastMonths(6);
    const labels = monthsMeta.map((m) => m.label);

    const collectionSeries = monthsMeta.map((m) =>
      this.countOrdersByMonth(allOrders, m.year, m.monthIndex)
    );

    const collectorSeries = monthsMeta.map((m) =>
      this.countCollectorsByMonth(allCollectors, m.year, m.monthIndex)
    );

    this.lineChartData.set({
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
          label: 'Active Collectors',
          data: collectorSeries,
          tension: 0.35,
          fill: false,
          borderColor: '#0284c7',
          borderWidth: 2,
          pointBackgroundColor: '#0284c7',
        },
      ],
    });
  }

  //-------------------------------------------------------
  // Helper Methods for Data Processing
  //-------------------------------------------------------

  /**
   * Get last N months metadata for chart x-axis
   */
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

  /**
   * Count orders in specific month
   */
  private countOrdersByMonth(orders: any[], year: number, monthIndex: number) {
    return orders.filter((o) => {
      const d = this.safeDate(o.orderDate || o.date || o.createdAt);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  /**
   * Count collectors registered in specific month
   */
  private countCollectorsByMonth(collectors: any[], year: number, monthIndex: number) {
    return collectors.filter((c) => {
      const d = this.safeDate(c.createdAt || c.registeredAt || c.dateJoined);
      return d && d.getFullYear() === year && d.getMonth() === monthIndex;
    }).length;
  }

  /**
   * Count orders in current month
   */
  private countThisMonth(items: any[]) {
    const now = new Date();
    return items.filter((it) => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }

  /**
   * Count orders in previous month
   */
  private countLastMonth(items: any[]) {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return items.filter((it) => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }).length;
  }

  /**
   * Calculate percentage change
   */
  private percentChange(current: number, previous: number) {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100;
    }
    return +(((current - previous) / previous) * 100).toFixed(0);
  }

  /**
   * Safe date parsing
   */
  private safeDate(val: any): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  /**
   * Parse weight from material size string
   */
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

  /**
   * CO2 emission factors by material type
   */
  private co2FactorByType: Record<string, number> = {
    plastic: 2.5,
    paper: 1.0,
    glass: 0.6,
    metal: 3.0,
  };

  /**
   * Compute total CO2 saved from materials
   */
  private computeCO2FromMaterials(materials: any[]): number {
    let totalKg = 0;
    for (const m of materials) {
      const weightKg = this.parseSizeKg(m.size || m.weight);
      const key = (m.typeName || m.type || '').toLowerCase();
      const factor = this.co2FactorByType[key] ?? 1.0;
      totalKg += weightKg * factor;
    }
    return totalKg;
  }
}
