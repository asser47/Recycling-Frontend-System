import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      [class]="'btn-component ' + getClasses()"
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'default' | 'outline' | 'ghost' = 'default';
  @Input() size: 'sm' | 'lg' | 'icon' | 'default' = 'default';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getClasses(): string {
    const classes = [this.variant, this.size !== 'default' ? this.size : ''];
    return classes.filter(Boolean).join(' ');
  }
}

