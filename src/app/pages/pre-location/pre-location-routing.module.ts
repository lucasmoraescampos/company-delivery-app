import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreLocationPage } from './pre-location.page';

const routes: Routes = [
  {
    path: '',
    component: PreLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreLocationPageRoutingModule {}
