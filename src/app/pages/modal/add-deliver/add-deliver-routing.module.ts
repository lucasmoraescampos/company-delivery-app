import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddDeliverPage } from './add-deliver.page';

const routes: Routes = [
  {
    path: '',
    component: AddDeliverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddDeliverPageRoutingModule {}
