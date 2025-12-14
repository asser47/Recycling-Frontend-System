import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="'card-component ' + (className || '')">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="'card-header ' + (className || '')">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-title',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <h3 [class]="'card-title ' + (className || '')">
      <ng-content></ng-content>
    </h3>
  `,
  styles: []
})
export class CardTitleComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-description',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <p [class]="'card-description ' + (className || '')">
      <ng-content></ng-content>
    </p>
  `,
  styles: []
})
export class CardDescriptionComponent {
  @Input() className = '';
}

@Component({
  selector: 'app-card-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <div [class]="'card-content ' + (className || '')">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardContentComponent {
  @Input() className = '';
}





