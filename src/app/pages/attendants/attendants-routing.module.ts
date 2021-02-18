import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttendantsPage } from './attendants.page';

const routes: Routes = [
  {
    path: '',
    component: AttendantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendantsPageRoutingModule {}
