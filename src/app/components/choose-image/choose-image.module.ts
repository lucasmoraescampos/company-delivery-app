import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChooseImageComponent } from './choose-image.component';
import { IonicModule } from '@ionic/angular';
import { NgxLoadingModule } from 'ngx-loading';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalImageCropperComponent } from './modal-image-cropper/modal-image-cropper.component';
import { CustomScrollModule } from 'src/app/directives/custom-scroll/custom-scroll.module';

@NgModule({
  declarations: [ChooseImageComponent, ModalImageCropperComponent],
  imports: [
    CommonModule,
    IonicModule,
    NgxLoadingModule,
    ImageCropperModule,
    CustomScrollModule
  ],
  exports: [ChooseImageComponent]
})
export class ChooseImageModule { }
