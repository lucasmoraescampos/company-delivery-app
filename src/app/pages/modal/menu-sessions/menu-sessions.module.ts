import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MenuSessionsPage } from './menu-sessions.page';
import { ChangeSessionPageModule } from '../change-session/change-session.module';
import { SessionHelpPageModule } from '../../popover/session-help/session-help.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangeSessionPageModule,
    SessionHelpPageModule
  ],
  declarations: [MenuSessionsPage],
  entryComponents: [MenuSessionsPage]
})
export class MenuSessionsPageModule {}
