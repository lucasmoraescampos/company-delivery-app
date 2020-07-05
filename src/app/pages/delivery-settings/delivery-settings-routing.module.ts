import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliverySettingsPage } from './delivery-settings.page';

const routes: Routes = [
  {
    path: '',
    component: DeliverySettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliverySettingsPageRoutingModule {}
