import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialService } from '../../../core/services/material.service';
import { UserService } from '../../../core/services/user.service';
import { FactoryService } from '../../../core/services/factory.service';
import { OrderService } from '../../../core/services/order.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {

  cards: any[] = [];   // ← شيلنا loading

  constructor(
    private materialService: MaterialService,
    private factoryService: FactoryService,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.loadDashboard();   // ← مهم جدًا
  }

  loadDashboard() {
    forkJoin({
      materials: this.materialService.getAll(),
      factories: this.factoryService.getAll(),
      users: this.userService.getAll(),
      orders: this.orderService.getAll()
    }).subscribe({
      next: (data) => {
        this.cards = [
          { title: 'عدد المواد', count: data.materials.length },
          { title: 'عدد المصانع', count: data.factories.length },
          { title: 'عدد المستخدمين', count: data.users.length },
          { title: 'عدد الطلبات', count: data.orders.length },
        ];
      }
    });
  }
}
