import { Routes } from '@angular/router';
import { HomeComponent } from '@features/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { ConfirmEmailComponent } from './features/auth/confirm-email/confirm-email';
import { RegisterSuccessComponent } from './features/auth/register-success/register-success';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { ManageMaterialsComponent } from './features/admin/manage-materials/manage-materials';
import { ManageFactoriesComponent } from './features/admin/manage-factories/manage-factories';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders';
import { RewardManagementComponent } from './features/admin/reward-management/reward-management';
import { AddCollectorComponent } from './features/admin/add-collector/add-collector';
import { ManageCollectorsComponent } from './features/admin/manage-collectors/manage-collectors';
import { adminGuard } from './core/guards/admin/admin-guard';
import { userGuard } from './core/guards/citizin/citizen-guard';
import { collectorGuard } from './core/guards/collector/collector-guard';
import { authPagesGuard } from './core/guards/auth-pages/auth-pages.guard';

export const routes: Routes = [

  // ===================== HOME =====================
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },

  // ===================== AUTH =====================
  { path: 'login', component: LoginComponent, canActivate: [authPagesGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [userGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'register-success', component: RegisterSuccessComponent },

  // ===================== ADMIN =====================
  {
    path: 'admin',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'materials', component: ManageMaterialsComponent },
      { path: 'factories', component: ManageFactoriesComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'orders', component: ManageOrdersComponent },
      { path: 'rewards', component: RewardManagementComponent },
      { path: 'add-collector', component: AddCollectorComponent },
      { path: 'collectors', component: ManageCollectorsComponent }
    ]
  },

  // ===================== USER =====================
  {
    path: 'citizen-dashboard',
    loadComponent: () =>
      import('./features/citizen/citizen-dashboard/citizen-dashboard.component')
        .then(m => m.CitizenDashboardComponent),
    canActivate: [userGuard]
  },

  // ===================== COLLECTOR =====================
  {
    path: 'collector-dashboard',
    loadComponent: () =>
      import('./features/collector/collector-dashboard/collector-dashboard.component')
        .then(m => m.CollectorDashboardComponent),
    canActivate: [collectorGuard]
  },

  // ===================== SHARED =====================
  {
    path: 'rewards',
    loadComponent: () =>
      import('./features/rewards/rewards.component')
        .then(m => m.RewardsComponent)
  },
  {
    path: 'my-requests',
    loadComponent: () =>
      import('./features/requests/my-requests/my-requests.component')
        .then(m => m.MyRequestsComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component')
        .then(m => m.ProfileComponent)
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component')
        .then(m => m.SettingsComponent)
  },

  // ===================== NOT FOUND =====================
  {
    path: '**',
    loadComponent: () =>
      import('./features/errors/not-found/not-found.component')
        .then(m => m.NotFoundComponent)
  }
];
