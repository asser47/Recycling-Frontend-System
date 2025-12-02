import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AddOrder } from './add-order/add-order';

@Component({
  selector: 'app-citizen',
  imports: [CommonModule, AddOrder],
  templateUrl: './citizen.html',
  styleUrl: './citizen.css',
})
export class Citizen {
 modalOpen = false;

  stats = [
    {
      icon: "bi-box-seam",
      label: "Total Collections",
      value: "24",
      change: "+3 this month",
      color: "text-primary"
    },
    {
      icon: "bi-graph-up",
      label: "CO₂ Saved",
      value: "145 kg",
      change: "+12 kg this week",
      color: "text-success"
    },
    {
      icon: "bi-gift",
      label: "Reward Points",
      value: "1,250",
      change: "Redeem now",
      color: "text-warning"
    }
  ];

  recentRequests = [
    { id: 1, material: "Plastic Bottles", weight: "5 kg", status: "completed", date: "2025-11-28" },
    { id: 2, material: "Paper & Cardboard", weight: "8 kg", status: "pending", date: "2025-11-29" },
    { id: 3, material: "Glass Containers", weight: "3 kg", status: "in-progress", date: "2025-11-30" },
    { id: 4, material: "Metal Cans", weight: "2 kg", status: "completed", date: "2025-11-25" },
  ];

  getStatusBadge(status: string) {
    switch (status) {
      case "completed":
        return { text: "Completed", icon: "bi-check-circle", color: "text-success" };
      case "pending":
        return { text: "Pending", icon: "bi-clock", color: "text-muted" };
      case "in-progress":
        return { text: "In Progress", icon: "bi-arrow-repeat", color: "text-primary" };
      default:
        return { text: "Cancelled", icon: "bi-x-circle", color: "text-danger" };
    }
  }

}
