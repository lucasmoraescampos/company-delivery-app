import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SessionHelpPage } from './session-help.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [SessionHelpPage],
  entryComponents: [SessionHelpPage]
})
export class SessionHelpPageModule {}
