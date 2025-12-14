import { Component, inject, ChangeDetectionStrategy, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { ApplicationUserDto } from '../../../../core/models/dtos.model';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  private languageService = inject(LanguageService);

  // State
  users = signal<ApplicationUserDto[]>([]);
  searchTerm = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Filter
  filteredUsers = computed(() => {
    const search = this.searchTerm().toLowerCase();
    return this.users().filter(user =>
      user.fullName?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.firstName?.toLowerCase().includes(search) ||
      user.lastName?.toLowerCase().includes(search)
    );
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading.set(true);
    this.error.set(null);
    this.adminService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.error.set('Failed to load users');
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(value: string) {
    this.searchTerm.set(value);
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          this.error.set('Failed to delete user');
        }
      });
    }
  }

  t = (key: string) => this.languageService.t(key);
}
