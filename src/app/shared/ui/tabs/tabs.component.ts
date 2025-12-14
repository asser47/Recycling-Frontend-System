import { Component, Input, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="className || ''">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class TabsComponent {
  @Input() defaultValue = '';
  @Input() className = '';
  selectedTab = signal(this.defaultValue);

  constructor() {
    effect(() => {
      // Update all child components when selectedTab changes
      if (typeof document !== 'undefined') {
        const triggers = document.querySelectorAll('app-tabs-trigger');
        const contents = document.querySelectorAll('app-tabs-content');
        triggers.forEach((trigger: any) => {
          if (trigger.componentInstance) {
            trigger.componentInstance.isActive = trigger.componentInstance.value === this.selectedTab();
          }
        });
        contents.forEach((content: any) => {
          if (content.componentInstance) {
            content.componentInstance.isActive = content.componentInstance.value === this.selectedTab();
          }
        });
      }
    });
  }
}

@Component({
  selector: 'app-tabs-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="'tabs-list ' + (className || '')">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class TabsListComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-tabs-trigger',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <button
      [class]="'tabs-trigger ' + (isActive ? 'active' : '') + ' ' + (className || '')"
      (click)="select()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class TabsTriggerComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() isActive = false;
  @Input() onSelect?: () => void;

  select(): void {
    if (this.onSelect) {
      this.onSelect();
    }
  }
}

@Component({
  selector: 'app-tabs-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    @if (isActive) {
      <div [class]="'mt-2 ' + (className || '')">
        <ng-content></ng-content>
      </div>
    }
  `,
  styles: []
})
export class TabsContentComponent {
  @Input() value = '';
  @Input() className = '';
  @Input() isActive = false;
}

