import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout';
import { AdminDashboardComponent } from './features/admin/dashboard/dashboard';
import { ManageMaterialsComponent } from './features/admin/manage-materials/manage-materials';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { ManageFactoriesComponent } from './features/admin/manage-factories/manage-factories';
import { ManageUsersComponent } from './features/admin/manage-users/manage-users';
import { OrdersApprovalComponent } from './features/admin/orders-approval/orders-approval';
import { RewardsComponent } from './features/admin/rewards/rewards';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password';
import { AuthGuard } from './core/guards/auth/auth-guard';

export const routes: Routes = [
{ path: '', redirectTo: '/admin/dashboard', pathMatch: 'full' },

  // 🔵 صفحات المستخدم العادي
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // 🔵 صفحات الأدمن
  {
    path: 'admin',
    canActivate: [AuthGuard],
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'materials', component: ManageMaterialsComponent },
      { path: 'factories', component: ManageFactoriesComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'orders', component: OrdersApprovalComponent },
      { path: 'rewards', component: RewardsComponent },
    ]
  },

  // صفحة اللوجين والريفجيستر العاديين
  { path: 'login', component:LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: '**', redirectTo: 'login' }
];
