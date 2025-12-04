// src/app/features/admin/dashboard/dashboard.ts
import { Component, OnInit, inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MaterialService } from '../../../core/services/material.service';
import { FactoryService } from '../../../core/services/factory.service';
import { OrderService } from '../../../core/services/order.service';
// import UserService if exists
import { CitizenService } from '../../../core/services/citizen.service'; // optional

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class AdminDashboardComponent implements OnInit {

  cards: any[] = [];
  // raw data
  materials: any[] = [];
  factories: any[] = [];
  orders: any[] = [];
  users: any[] = [];

  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private materialService = inject(MaterialService);
  private factoryService = inject(FactoryService);
  private orderService = inject(OrderService);
  private userService = inject(CitizenService); // if not present, we'll handle

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    // كل استدعاء عنده catchError => fallback إلى مصفوفة فارغة
    forkJoin({
      materials: this.materialService.getAll().pipe(catchError(() => of([]))),
      factories: this.factoryService.getAll().pipe(catchError(() => of([]))),
      orders: this.orderService.getAll().pipe(catchError(() => of([]))),
      users: this.userService ? this.userService.getAll().pipe(catchError(() => of([]))) : of([])
    }).subscribe((data: any) => {
      // خزّن الداتا الخام
      this.materials = data.materials || [];
      this.factories = data.factories || [];
      this.orders = data.orders || [];
      this.users = data.users || [];

      // احسب الـ metrics
      const totalUsers = this.users.length;
      const collectionsThisMonth = this.countThisMonth(this.orders);
      const collectionsLastMonth = this.countLastMonth(this.orders);
      const collectionsChange = this.percentChange(collectionsThisMonth, collectionsLastMonth);

      // CO2: نحسب من أوزان الـ materials (كمثال بسيط)
      const co2Kg = this.computeCO2FromMaterials(this.materials); // بالـ kg
      const co2Tons = +(co2Kg / 1000).toFixed(1);

      // Rewards: احتياطي لحد ما الباك يرجع قيمة; لو الAPI موجود ممكن تجيبها من هنـا
      const rewardsDistributed = 0; // fallback

      // users change
      const usersThisMonth = this.countThisMonthFromUsers(this.users);
      const usersLastMonth = this.countLastMonthFromUsers(this.users);
      const usersChange = this.percentChange(usersThisMonth, usersLastMonth);

      this.zone.run(() => {
        this.cards = [
          { title: 'Total Users', count: totalUsers, changePercent: usersChange, subtitle: `${usersThisMonth} this month`, icon: '👥' },
          { title: 'Collections This Month', count: collectionsThisMonth, changePercent: collectionsChange, subtitle: `${collectionsLastMonth} last month`, icon: '📦' },
          { title: 'CO₂ Saved (tons)', count: co2Tons, changePercent: null, subtitle: `${co2Kg.toFixed(0)} kg`, icon: '🌿' },
          { title: 'Rewards Distributed', count: rewardsDistributed, changePercent: null, subtitle: '', icon: '🎁' }
        ];

        // فرض تحديث العرض
        this.cdr.detectChanges();
      });
    }, err => {
      console.error('Dashboard load error', err);
    });
  }

  // عدّ العناصر في الشهر الحالي (orders where orderDate in current month)
  private countThisMonth(items: any[]) {
    const now = new Date();
    return items.filter(it => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }

  private countLastMonth(items: any[]) {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return items.filter(it => {
      const d = this.safeDate(it.orderDate || it.date || it.createdAt);
      return d && d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }).length;
  }

  private countThisMonthFromUsers(users: any[]) {
    // يفترض أن اليوزر عنده createdDate أو createdAt
    const now = new Date();
    return users.filter(u => {
      const d = this.safeDate(u.createdAt || u.registeredAt || u.date);
      return d && d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }).length;
  }

  private countLastMonthFromUsers(users: any[]) {
    const now = new Date();
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return users.filter(u => {
      const d = this.safeDate(u.createdAt || u.registeredAt || u.date);
      return d && d.getFullYear() === last.getFullYear() && d.getMonth() === last.getMonth();
    }).length;
  }

  private percentChange(current: number, previous: number) {
    if (previous === 0) {
      if (current === 0) return 0;
      return 100; // from 0 to some => 100% (arbitrary fallback)
    }
    return +(((current - previous) / previous) * 100).toFixed(0);
  }

  // تحويل string تاريخ إلى Date بأمان
  private safeDate(val: any): Date | null {
    if (!val) return null;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }

  // نحاول نخرّج وزن من الحقل size (مثلاً '10' أو '25L' أو '3 kg')
  private parseSizeKg(size: any): number {
    if (size == null) return 0;
    const s = String(size).trim();
    // أخرج الأرقام (قد تكون عشرية)
    const m = s.match(/[\d.,]+/);
    if (!m) return 0;
    // استبدل الفواصل ثم parseFloat
    const num = parseFloat(m[0].replace(',', '.'));
    if (isNaN(num)) return 0;
    // إذا كان الوصف يحتوي على 'L' أو 'ltr' قد نعتبر اللتر ~ 1kg تقريباً (water-like) - هذا افتراض
    if (/l\b|ltr|liter|litre/i.test(s)) {
      return num; // treat 1L ~ 1kg
    }
    // إذا ذكر kg أو g
    if (/kg/i.test(s)) return num;
    if (/g\b/i.test(s)) return num / 1000;
    // افتراض افتراضي: لو القيمة صغيرة (< 100) نعتبرها kg، وإلا نرجع القيمة كما هي
    return num;
  }

  // خريطة عوامل CO2 حسب نوع المادة (يمكن تحديثها لاحقًا)
  private co2FactorByType: Record<string, number> = {
    'plastic': 2.5, // مثال: 2.5 kg CO2 per kg (تقديري)
    'paper': 1.0,
    'glass': 0.6,
    'metal': 3.0
    // أضف أو حدث حسب ما تحب
  };

  private computeCO2FromMaterials(materials: any[]): number {
    // نعد مجموع (weightKg * factor)
    let totalKg = 0;
    for (const m of materials) {
      const weightKg = this.parseSizeKg(m.size);
      const key = (m.typeName || '').toLowerCase();
      const factor = this.co2FactorByType[key] ?? 1.0; // افتراضي 1 kgCO2/kg
      totalKg += weightKg * factor;
    }
    return totalKg;
  }
}
