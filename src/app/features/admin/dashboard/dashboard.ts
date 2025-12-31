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

        const rewardsDistributed =
          this.calculateDistributedRewards(this.orders);

        // Calculate CO2 from completed orders (material type + quantity)
        const co2Kg = this.computeCO2FromCompletedOrders(this.orders);
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

  // CO2 savings per kg for different material types (in kg CO2)
  // MaterialType enum: Plastic = 0, Can = 1, Carton = 2, Glass = 3
  // Based on real-world recycling impact data
  private co2FactorByType: Record<number, number> = {
    0: 1.8,   // Plastic: 1.8 kg CO2 saved per kg recycled (vs virgin plastic production)
    1: 9.0,   // Aluminum/Can: 9.0 kg CO2 saved per kg (aluminum is very energy intensive)
    2: 0.9,   // Carton/Cardboard: 0.9 kg CO2 saved per kg recycled
    3: 0.5    // Glass: 0.5 kg CO2 saved per kg recycled
  };

  // Map string material names to enum values
  private materialNameToEnum: Record<string, number> = {
    'plastic': 0,
    'can': 1,
    'carton': 2,
    'glass': 3
  };

  /**
   * Convert material type to enum number
   * Handles both string names and numeric enum values
   */
  private getMaterialTypeNumber(materialType: any): number | null {
    if (typeof materialType === 'number') {
      return materialType;
    }
    if (typeof materialType === 'string') {
      return this.materialNameToEnum[materialType.toLowerCase()] ?? null;
    }
    return null;
  }

  /**
   * Calculate CO2 savings from completed orders
   * Uses material type and quantity from each completed order
   * Takes into account the percentage distribution of materials
   */
  private computeCO2FromCompletedOrders(orders: any[]): number {
    console.log('=== DEBUG: Raw Orders ===');
    console.log('Total orders received:', orders.length);
    console.log('First 3 orders:', orders.slice(0, 3));
    
    let totalCo2Kg = 0;
    
    // Filter only completed orders (match both 'completed' and 'Completed')
    const completedOrders = orders.filter(order => 
      order.status?.toLowerCase() === 'completed'
    );
    
    console.log('Completed orders found:', completedOrders.length);
    console.log('Status values in orders:', [...new Set(orders.map(o => o.status))]);
    
    if (completedOrders.length === 0) {
      console.log('❌ No completed orders found');
      return 0;
    }
    
    // Calculate total quantity and material distribution
    let totalQuantity = 0;
    const materialStats: Record<number, { quantity: number; count: number }> = {
      0: { quantity: 0, count: 0 }, // Plastic
      1: { quantity: 0, count: 0 }, // Can
      2: { quantity: 0, count: 0 }, // Carton
      3: { quantity: 0, count: 0 }  // Glass
    };
    
    // Collect statistics
    for (const order of completedOrders) {
      const quantity = order.quantity || 0;
      const materialTypeRaw = order.typeOfMaterial;
      const materialType = this.getMaterialTypeNumber(materialTypeRaw);
      
      console.log(`Order ${order.id}: quantity=${quantity}, materialType(raw)=${materialTypeRaw}, materialType(converted)=${materialType}, status=${order.status}`);
      
      if (quantity > 0 && materialType !== null && materialStats[materialType] !== undefined) {
        totalQuantity += quantity;
        materialStats[materialType].quantity += quantity;
        materialStats[materialType].count += 1;
      }
    }
    
    console.log('=== CO2 Calculation Report ===');
    console.log(`Total completed orders: ${completedOrders.length}`);
    console.log(`Total quantity: ${totalQuantity} kg`);
    
    // Calculate CO2 for each material type with percentage distribution
    for (const [materialType, stats] of Object.entries(materialStats)) {
      if (stats.quantity > 0) {
        const materialTypeNum = parseInt(materialType);
        const percentage = (stats.quantity / totalQuantity) * 100;
        const co2Factor = this.co2FactorByType[materialTypeNum] ?? 1.0;
        const co2ForMaterial = stats.quantity * co2Factor;
        
        totalCo2Kg += co2ForMaterial;
        
        const materialNames = ['Plastic', 'Can/Aluminum', 'Carton', 'Glass'];
        console.log(`${materialNames[materialTypeNum]}:`);
        console.log(`  - Orders: ${stats.count}`);
        console.log(`  - Quantity: ${stats.quantity} kg (${percentage.toFixed(1)}%)`);
        console.log(`  - CO2 factor: ${co2Factor} kg CO2/kg`);
        console.log(`  - CO2 saved: ${co2ForMaterial.toFixed(2)} kg`);
      }
    }
    
    console.log(`\nTotal CO2 saved: ${totalCo2Kg.toFixed(2)} kg`);
    console.log('==============================');
    
    return totalCo2Kg;
  }
}
