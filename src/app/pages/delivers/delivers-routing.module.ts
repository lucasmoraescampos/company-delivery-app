import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeliversPage } from './delivers.page';

const routes: Routes = [
  {
    path: '',
    component: DeliversPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliversPageRoutingModule {}
