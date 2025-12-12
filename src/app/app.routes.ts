import { Routes } from '@angular/router';
import { AuthGuard } from '../app/core/guards/auth/auth-guard';
import { AdminNavbarComponent } from './features/admin/admin-navbar/admin-navbar';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { ManageMaterialsComponent } from './features/admin/manage-materials/manage-materials';
import { ManageFactoriesComponent } from './features/admin/manage-factories/manage-factories';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders';
import { adminGuard } from './core/guards/admin/admin-guard';
import { RewardManagementComponent } from './features/admin/reward-management/reward-management';
import { EditRewardComponent } from './features/admin/edit-reward/edit-reward';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'register-success',
    loadComponent: () => import('./features/auth/register-success/register-success').then(m => m.RegisterSuccessComponent)
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./features/auth/confirm-email/confirm-email').then(m => m.ConfirmEmailComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'role-selection',
    loadComponent: () => import('./features/auth/role-selection/role-selection.component').then(m => m.RoleSelectionComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'citizen-dashboard',
    loadComponent: () => import('./features/citizen/citizen-dashboard/citizen-dashboard.component').then(m => m.CitizenDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'collector-dashboard',
    loadComponent: () => import('./features/collector/collector-dashboard/collector-dashboard').then(m => m.CollectorDashboardComponent),
    canActivate: [AuthGuard]
  },

  // 🔵 Admin Pages with Guard
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminNavbarComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'materials', component: ManageMaterialsComponent },
      { path: 'factories', component: ManageFactoriesComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'orders', component: ManageOrdersComponent },

      {
        path: 'rewards',
        children: [
          { path: '', component: RewardManagementComponent },          // /admin/rewards
          { path: 'edit/:id', component: EditRewardComponent }         // /admin/rewards/edit/5
        ]
      }


    ]
  },

  {
    path: 'my-requests',
    loadComponent: () => import('./features/requests/my-requests/my-requests.component').then(m => m.MyRequestsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];





  // {
  //   path: 'admin/dashboard',
  //   loadComponent: () => import('./features/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'rewards',
  //   loadComponent: () => import('./features/rewards/rewards.component').then(m => m.RewardsComponent),
  //   canActivate: [AuthGuard]
  // },
