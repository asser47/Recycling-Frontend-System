import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth-guard';
import { adminGuard } from './core/guards/admin/admin-guard';

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
    loadComponent: () => import('./features/collector/collector-dashboard/collector-dashboard.component').then(m => m.CollectorDashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [AuthGuard, adminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/dashboard/dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'reward-management',
        loadComponent: () => import('./features/admin/admin-dashboard/reward-management/reward-management.component').then(m => m.RewardManagementComponent)
      },
      {
        path: 'manage-users',
        loadComponent: () => import('./features/admin/admin-dashboard/manage-users/manage-users').then(m => m.ManageUsersComponent)
      },
      {
        path: 'manage-orders',
        loadComponent: () => import('./features/admin/admin-dashboard/manage-orders/manage-orders.component').then(m => m.OrderManagementComponent)
      },
      {
        path: 'manage-materials',
        loadComponent: () => import('./features/admin/admin-dashboard/manage-materials/manage-materials').then(m => m.ManageMaterialsComponent)
      },
      {
        path: 'manage-factories',
        loadComponent: () => import('./features/admin/admin-dashboard/manage-factories/manage-factories').then(m => m.ManageFactoriesComponent)
      },
      {
        path: 'edit-reward/:id',
        loadComponent: () => import('./features/admin/admin-dashboard/edit-reward/edit-reward').then(m => m.EditRewardComponent)
      }
    ]
  },
  {
    path: 'rewards',
    loadComponent: () => import('./features/rewards/rewards.component').then(m => m.RewardsComponent),
    canActivate: [AuthGuard]
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
    path: 'order-tracking',
    loadComponent: () => import('./features/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'order-tracking/:id',
    loadComponent: () => import('./features/order-tracking/order-tracking.component').then(m => m.OrderTrackingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

