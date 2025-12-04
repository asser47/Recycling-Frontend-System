import { Routes } from '@angular/router';
import { AdminNavbarComponent } from './features/admin/admin-navbar/admin-navbar';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { ManageMaterialsComponent } from './features/admin/manage-materials/manage-materials';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ManageFactoriesComponent } from './features/admin/manage-factories/manage-factories';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';
import { ManageOrdersComponent } from './features/admin/manage-orders/manage-orders';
import { RewardsComponent } from './features/admin/rewards/rewards';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { AuthGuard } from './core/guards/auth/auth-guard';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password';
import { Citizen } from './features/citizen/citizen';
import { CollectorDashboard } from './features/collector/collector-dashboard/collector-dashboard';
import { adminGuard } from './core/guards/admin/admin-guard';

export const routes: Routes = [
{ path: '', redirectTo: '/collector', pathMatch: 'full' },

  // 🔵 صفحات المستخدم العادي
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  {path:'reset-password', component: ResetPasswordComponent},
  {path:'confirm-email', component: ResetPasswordComponent},

  // 🔵 صفحات الأدمن
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
      { path: 'rewards', component: RewardsComponent },
    ]
  },

  //صفحة المواطن
  {
    path: 'citizen', component: Citizen,
  },

// صفحة الجامع
  {
    path: 'collector', component : CollectorDashboard
  },


  // صفحة اللوجين والريفجيستر العاديين
  { path: 'login', component:LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: 'login' }
];
