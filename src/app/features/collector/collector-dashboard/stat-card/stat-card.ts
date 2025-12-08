import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.html',
  styleUrl: './stat-card.css',
})
export class StatCard {

@Input() title!: string;
  @Input() value!: string | number;
  @Input() sub!: string;
  @Input() icon!: string;
}
