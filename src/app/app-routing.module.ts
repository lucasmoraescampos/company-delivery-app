import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then(m => m.SigninPageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'location',
    loadChildren: () => import('./pages/location/location.module').then(m => m.LocationPageModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: 'notifications',
    loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'setup',
    loadChildren: () => import('./pages/setup/setup.module').then( m => m.SetupPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'photo',
    loadChildren: () => import('./pages/photo/photo.module').then( m => m.PhotoPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'pre-location',
    loadChildren: () => import('./pages/pre-location/pre-location.module').then( m => m.PreLocationPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delivery-settings',
    loadChildren: () => import('./pages/delivery-settings/delivery-settings.module').then( m => m.DeliverySettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment-methods',
    loadChildren: () => import('./pages/payment-methods/payment-methods.module').then( m => m.PaymentMethodsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'waiting-confirmation',
    loadChildren: () => import('./pages/waiting-confirmation/waiting-confirmation.module').then( m => m.WaitingConfirmationPageModule)
  },
  {
    path: 'delivers',
    loadChildren: () => import('./pages/delivers/delivers.module').then( m => m.DeliversPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'wallet',
    loadChildren: () => import('./pages/wallet/wallet.module').then( m => m.WalletPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
