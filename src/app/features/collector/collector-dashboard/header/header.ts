import { Component, inject } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-collector-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class CollectorHeaderComponent {
  languageService = inject(LanguageService);
  t = (key: string) => this.languageService.t(key);
}
