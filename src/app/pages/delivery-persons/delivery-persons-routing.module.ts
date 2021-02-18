import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliveryPersonsPage } from './delivery-persons.page';

const routes: Routes = [
  {
    path: '',
    component: DeliveryPersonsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryPersonsPageRoutingModule {}
