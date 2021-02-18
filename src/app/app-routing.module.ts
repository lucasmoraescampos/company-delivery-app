import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { CompanyGuard } from './guards/company.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'companies',
    loadChildren: () => import('./pages/companies/companies.module').then( m => m.CompaniesPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'reports',
    loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'tables',
    loadChildren: () => import('./pages/tables/tables.module').then(m => m.TablesPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'table/:code',
    loadChildren: () => import('./pages/table/table.module').then(m => m.TablePageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'attendants',
    loadChildren: () => import('./pages/attendants/attendants.module').then( m => m.AttendantsPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'delivery-persons',
    loadChildren: () => import('./pages/delivery-persons/delivery-persons.module').then( m => m.DeliveryPersonsPageModule),
    canActivate: [AuthGuard, CompanyGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then( m => m.CategoriesPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
