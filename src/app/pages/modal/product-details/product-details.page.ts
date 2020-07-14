import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionSheetController, ModalController, NavParams, IonContent, PopoverController } from '@ionic/angular';
import { ToastService } from '../../../services/toast/toast.service';
import { Base64Helper } from '../../../helpers/Base64Helper';
import { AddComplementPage } from '../add-complement/add-complement.page';
import { ComplementOptionsPage } from '../../popover/complement-options/complement-options.page';
import { AddSubcomplementPage } from '../add-subcomplement/add-subcomplement.page';
import { ChangeComplementPage } from '../change-complement/change-complement.page';
import { ChangeSubcomplementPage } from '../change-subcomplement/change-subcomplement.page';
import { ArrayHelper } from '../../../helpers/ArrayHelper';
import { AlertService } from '../../../services/alert/alert.service';
import { ProductService } from '../../../services/product/product.service';
import { NumberHelper } from '../../../helpers/NumberHelper';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { SubcomplementService } from 'src/app/services/subcomplement/subcomplement.service';
import { ComplementService } from 'src/app/services/complement/complement.service';

const { Camera } = Plugins;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;

  public loading: boolean = false;

  public segment: string = 'info';

  public session: any;

  public subcategories: Array<any>;

  public product: any;

  public photo: any = null;

  public isAlwaysAvailable: boolean;

  public has_promotion: boolean;

  public blob: Blob;

  public formGroupProduct: FormGroup;

  public formGroupPromotion: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private productSrv: ProductService,
    private popoverCtrl: PopoverController,
    private navParams: NavParams,
    private formbuilder: FormBuilder,
    private toastSrv: ToastService,
    private alertSrv: AlertService,
    public actionSheetController: ActionSheetController,
    private subcomplementSrv: SubcomplementService,
    private complementSrv: ComplementService
  ) { }

  ngOnInit() {

    this.product = this.navParams.get('product');

    this.session = this.navParams.get('session');

    this.subcategories = this.navParams.get('subcategories');

    this.photo = this.product.photo;

    this.isAlwaysAvailable = this.product.start_time == null && this.product.end_time == null;

    this.has_promotion = this.product.rebate != null;

    this.formGroupProduct = this.formbuilder.group({
      menu_session_id: [this.product.menu_session_id, Validators.required],
      name: [this.product.name, Validators.required],
      description: [this.product.description, Validators.required],
      subcategory_id: [this.product.subcategory_id, Validators.required],
      price: [this.product.price, Validators.required],
      is_available_sunday: [this.product.is_available_sunday],
      is_available_monday: [this.product.is_available_monday],
      is_available_tuesday: [this.product.is_available_tuesday],
      is_available_wednesday: [this.product.is_available_wednesday],
      is_available_thursday: [this.product.is_available_thursday],
      is_available_friday: [this.product.is_available_friday],
      is_available_saturday: [this.product.is_available_saturday],
      start_time: [this.product.start_time],
      end_time: [this.product.end_time]
    });

    this.formGroupPromotion = this.formbuilder.group({
      rebate: [this.product.rebate ? NumberHelper.cents(this.product.rebate) : '0,00']
    });

  }

  public update() {

    if (this.formGroupProduct.valid) {

      const product = this.formGroupProduct.value;

      if (product.price == '0,00') {

        this.toastSrv.error('Informe o valor do produto!');

      }

      else {

        this.loading = true;

        product.price = NumberHelper.parse(product.price);

        const formData = new FormData();

        formData.append('menu_session_id', product.menu_session_id);
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('subcategory_id', product.subcategory_id);
        formData.append('price', product.price);
        formData.append('is_available_sunday', product.is_available_sunday);
        formData.append('is_available_monday', product.is_available_monday);
        formData.append('is_available_tuesday', product.is_available_tuesday);
        formData.append('is_available_wednesday', product.is_available_wednesday);
        formData.append('is_available_thursday', product.is_available_thursday);
        formData.append('is_available_friday', product.is_available_friday);
        formData.append('is_available_saturday', product.is_available_saturday);
        
        if (product.start_time && product.end_time) {
          formData.append('start_time', product.start_time);
          formData.append('end_time', product.end_time);
        }

        if (this.blob) {
          formData.append('photo', this.blob);
        }

        this.productSrv.update(this.product.id, formData)
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.toastSrv.success(res.message);

              this.product = res.data;

            }
            else {

              this.toastSrv.error(res.message);

            }

          });

      }

    }

    else {
      this.toastSrv.error('Informe todos os dados!');
    }

  }

  public updatePromotion() {

    const promotion = this.formGroupPromotion.value;

    promotion.rebate = NumberHelper.parse(promotion.rebate);

    if (this.has_promotion && promotion.rebate == 0) {

      this.toastSrv.error('Informe o valor de desconto!');

    }

    else {

      this.loading = true;

      const formData = new FormData();

      formData.append('rebate', promotion.rebate);

      this.productSrv.update(this.product.id, formData)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            this.toastSrv.success(res.message);

          }

          else {

            this.toastSrv.error(res.message);

          }

        });

    }

  }

  public async optionsComplement(complement: any, ev: any) {

    const popover = await this.popoverCtrl.create({
      component: ComplementOptionsPage,
      event: ev,
      translucent: true,
      mode: 'md'
    });

    popover.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          switch (res.data) {

            case 'add_subcomplement':
              this.addSubcomplement(complement.id);
              break;

            case 'change_complement':
              this.changeComplement(complement);
              break;

            case 'delete_complement':
              this.deleteComplement(complement.id);
              break;

          }

        }

      });

    return await popover.present();
  }

  public async addComplement() {

    const modal = await this.modalCtrl.create({
      component: AddComplementPage,
      cssClass: 'modal-custom',
      componentProps: {
        product_id: this.product.id
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const complement = res.data;

          complement.subcomplements = [];

          this.product.complements.push(complement);

        }

      });

    return await modal.present();

  }

  public async addSubcomplement(complement_id: number) {

    const modal = await this.modalCtrl.create({
      component: AddSubcomplementPage,
      cssClass: 'modal-custom',
      componentProps: {
        complement_id: complement_id
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.product.complements, 'id', complement_id);

          this.product.complements[index].subcomplements.push(res.data);

        }

      });

    return await modal.present();

  }

  public async changeComplement(complement: any) {

    const modal = await this.modalCtrl.create({
      component: ChangeComplementPage,
      cssClass: 'modal-custom',
      componentProps: {
        complement: complement
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.product.complements, 'id', complement.id);

          const subcomplements = this.product.complements[index].subcomplements;

          this.product.complements[index] = res.data;

          this.product.complements[index].subcomplements = subcomplements;

        }

      });

    return await modal.present();

  }

  public async changeSubcomplement(subcomplement: any) {

    const modal = await this.modalCtrl.create({
      component: ChangeSubcomplementPage,
      cssClass: 'modal-custom',
      componentProps: {
        subcomplement: subcomplement
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data != undefined) {

          const index = ArrayHelper.getIndexByKey(this.product.complements, 'id', subcomplement.complement_id);

          const index2 = ArrayHelper.getIndexByKey(this.product.complements[index].subcomplements, 'id', subcomplement.id);

          this.product.complements[index].subcomplements[index2] = res.data;

        }

      });

    return await modal.present();

  }

  public deleteComplement(id: number) {

    this.alertSrv.confirm('Apagar este complemento?', () => {

      this.loading = true;

      this.complementSrv.delete(id)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.product.complements, 'id', id);

            this.product.complements = ArrayHelper.removeItem(this.product.complements, index);

            this.toastSrv.success(res.message);

          }

        });

    });

  }

  public deleteSubcomplement(subcomplement: any) {

    this.alertSrv.confirm('Apagar este item?', () => {

      this.loading = true;

      this.subcomplementSrv.delete(subcomplement.id)
        .subscribe(res => {

          this.loading = false;

          if (res.success) {

            const index = ArrayHelper.getIndexByKey(this.product.complements, 'id', subcomplement.complement_id);

            const index2 = ArrayHelper.getIndexByKey(this.product.complements[index].subcomplements, 'id', subcomplement.id);

            this.product.complements[index].subcomplements = ArrayHelper.removeItem(this.product.complements[index].subcomplements, index2);

            this.toastSrv.success(res.message);

          }

        });

    });

  }

  public dismiss() {
    this.modalCtrl.dismiss(this.product);
  }

  public changeAlwaysAvailable(event: CustomEvent) {

    if (event.detail.checked) {

      this.isAlwaysAvailable = true;

      this.formGroupProduct.patchValue({
        start_time: null,
        end_time: null
      });

    }
    else {

      this.isAlwaysAvailable = false;

      if (this.product.start_time && this.product.end_time) {

        this.formGroupProduct.patchValue({
          start_time: this.product.start_time,
          end_time: this.product.end_time
        });

      }

      else {

        this.formGroupProduct.patchValue({
          start_time: '00:00',
          end_time: '00:00'
        });

      }

      setTimeout(() => {
        this.content.scrollToBottom(1000);
      });

    }
  }

  public changeSegment(segment: string) {

    let element = document.getElementById(`segment-${segment}`);

    element.scrollIntoView({ behavior: "smooth", inline: "center" });

    this.segment = segment;

  }

  public checkPromotion(event: any) {

    if (event.detail.checked) {

      this.has_promotion = false;

      this.formGroupPromotion.patchValue({
        rebate: 0
      });

    }

    else {

      this.has_promotion = true;

      this.formGroupPromotion.patchValue({
        rebate: this.product.rebate ? NumberHelper.cents(this.product.rebate) : '0,00'
      });

    }

  }

  public async choosePhoto() {

    const actionSheet = await this.actionSheetController.create({
      mode: 'md',
      header: 'Escolha uma opção',
      buttons: [{
        text: 'Tirar Foto',
        icon: 'camera-outline',
        handler: () => {
          this.camera();
        }
      }, {
        text: 'Abrir Galeria',
        icon: 'image-outline',
        handler: () => {
          this.gallery();
        }
      }]
    });

    actionSheet.onWillDismiss()
      .then(() => { });

    await actionSheet.present();

  }

  private async camera() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.photo = image.dataUrl;

    }

  }

  private async gallery() {

    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });

    this.blob = Base64Helper.toBlob(image.dataUrl, image.format);

    if (this.blob.size > 8388608) {

      this.blob = null;

      this.toastSrv.error('A imagem escolhida é muito grande, escolha uma imagem menor que 8MB!');

    }

    else {

      this.photo = image.dataUrl;

    }

  }
}
