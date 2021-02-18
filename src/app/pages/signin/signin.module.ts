import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SigninPageRoutingModule } from './signin-routing.module';
import { SigninPage } from './signin.page';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';
import { InputCodeModule } from 'src/app/components/input-code/input-code.module';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SigninPageRoutingModule,
    ReactiveFormsModule,
    CustomScrollModule,
    InputCodeModule,
    BrMaskerModule
  ],
  declarations: [SigninPage]
})
export class SigninPageModule {}
