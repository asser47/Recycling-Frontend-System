import {
  Component,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { ThemeService } from '../../core/services/theme.service';
import { UserProfileService } from '../../core/services/user.services/user-profile.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent
} from '../../shared/ui/card/card.component';
import { BadgeComponent } from '../../shared/ui/badge/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    BadgeComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.dark]': 'isDarkMode()'
  }
})
export class ProfileComponent {

  private fb = inject(FormBuilder);
  private profileService = inject(UserProfileService);
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);

  isDarkMode = computed(() => this.themeService.theme() === 'dark');

  profileData = this.profileService.userProfile;
  isLoading = this.profileService.isLoading;
  isSaving = this.profileService.isSaving;

  isEditMode = signal(false);

  editForm: FormGroup = this.fb.group({
    fullName: [''],
    email: [{ value: '', disabled: true }],
    phoneNumber: [''],
    street: [''],
    city: [''],
    buildingNo: [''],
    apartment: ['']
  });

  fullName = computed(() => this.profileData()?.fullName ?? 'User');

  t = (key: string) => this.languageService.t(key);

  constructor() {
    // ✅ effect في injection context صحيح
    effect(() => {
      const profile = this.profileData();
      if (!profile) return;

      this.editForm.patchValue({
        fullName: profile.fullName ?? '',
        email: profile.email ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        street: profile.street ?? '',
        city: profile.city ?? '',
        buildingNo: profile.buildingNo ?? '',
        apartment: profile.apartment ?? ''
      });
    });

    // نطلب الداتا
    this.profileService.loadUserProfile().subscribe();
  }

  toggleEditMode(): void {
    this.isEditMode.update(v => !v);

    if (!this.isEditMode()) {
      const profile = this.profileData();
      if (profile) {
        this.editForm.patchValue({
          fullName: profile.fullName ?? '',
          email: profile.email ?? '',
          phoneNumber: profile.phoneNumber ?? '',
          street: profile.street ?? '',
          city: profile.city ?? '',
          buildingNo: profile.buildingNo ?? '',
          apartment: profile.apartment ?? ''
        });
      }
    }
  }

  saveProfile(): void {
    if (this.editForm.invalid) return;

    this.profileService
      .updateUserProfile(this.editForm.getRawValue())
      .subscribe(() => {
        this.isEditMode.set(false);
      });
  }
}
