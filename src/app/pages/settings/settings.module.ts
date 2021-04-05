import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SettingsPageRoutingModule } from './settings-routing.module';
import { SettingsPage } from './settings.page';
import { ChooseCompanyModule } from 'src/app/components/choose-company/choose-company.module';
import { ModalShareLinkModule } from 'src/app/components/modal-share-link/modal-share-link.module';
import { ModalProfileModule } from 'src/app/components/modal-profile/modal-profile.module';
import { ModalLocationModule } from 'src/app/components/modal-location/modal-location.module';
import { ModalPlansModule } from 'src/app/components/modal-plans/modal-plans.module';
import { ModalPermissionsModule } from 'src/app/components/modal-permissions/modal-permissions.module';
import { ModalVariablesModule } from 'src/app/components/modal-variables/modal-variables.module';
import { ModalRadiusModule } from 'src/app/components/modal-radius/modal-radius.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule,
    ChooseCompanyModule,
    ModalShareLinkModule,
    ModalProfileModule,
    ModalLocationModule,
    ModalPlansModule,
    ModalPermissionsModule,
    ModalVariablesModule,
    ModalRadiusModule
  ],
  declarations: [SettingsPage]
})
export class SettingsPageModule {}
