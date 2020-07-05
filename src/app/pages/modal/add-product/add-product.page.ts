import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, ActionSheetController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product/product.service';
import { ToastService } from '../../../services/toast/toast.service';
import { NumberHelper } from '../../../helpers/NumberHelper';
import { Base64Helper } from '../../../helpers/Base64Helper';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ConfigHelper } from 'src/app/helpers/ConfigHelper';

const { Camera } = Plugins;

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

  public photo: any = null;

  public isAlwaysAvailable: boolean = false;

  public sessions: Array<any>;

  public subcategories: Array<any>;

  public formGroupProduct: FormGroup;

  public blob: Blob;

  public loading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private formbuilder: FormBuilder,
    private navParams: NavParams,
    private productSrv: ProductService,
    private toastSrv: ToastService,
    public actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {

    this.sessions = this.navParams.get('sessions');

    this.formGroupProduct = this.formbuilder.group({
      menu_session_id: [null, Validators.required],
      name: [null, Validators.required],
      description: [null, Validators.required],
      subcategory_id: [null, Validators.required],
      price: ['0,00', Validators.required],
      is_available_sunday: [0],
      is_available_monday: [0],
      is_available_tuesday: [0],
      is_available_wednesday: [0],
      is_available_thursday: [0],
      is_available_friday: [0],
      is_available_saturday: [0],
      start_time: ['00:00'],
      end_time: ['00:00']
    });

    this.prepareSubcategories();

  }

  public add() {

    if (this.formGroupProduct.valid) {

      const product = this.formGroupProduct.value;

      if (product.price == '0,00') {

        this.toastSrv.error('Informe o valor do produto!');

      }

      else {

        this.loading = true;

        const formData = new FormData();

        formData.append('menu_session_id', product.menu_session_id);
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('subcategory_id', product.subcategory_id);
        formData.append('price', NumberHelper.parse(product.price).toString());
        formData.append('is_available_sunday', product.is_available_sunday);
        formData.append('is_available_monday', product.is_available_monday);
        formData.append('is_available_tuesday', product.is_available_tuesday);
        formData.append('is_available_wednesday', product.is_available_wednesday);
        formData.append('is_available_thursday', product.is_available_thursday);
        formData.append('is_available_friday', product.is_available_friday);
        formData.append('is_available_saturday', product.is_available_saturday);
        formData.append('start_time', product.start_time);
        formData.append('end_time', product.end_time);

        if (this.blob != null) {
          formData.append('photo', this.blob);
        }

        this.productSrv.create(formData)
          .subscribe(res => {

            this.loading = false;

            if (res.success) {

              this.toastSrv.success(res.message);

              this.modalCtrl.dismiss(res.data);

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

  public changeDays(event: CustomEvent) {

    switch (event.detail.value) {

      case 'is_available_sunday':
        this.formGroupProduct.patchValue({
          is_available_sunday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_monday':
        this.formGroupProduct.patchValue({
          is_available_monday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_tuesday':
        this.formGroupProduct.patchValue({
          is_available_tuesday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_wednesday':
        this.formGroupProduct.patchValue({
          is_available_wednesday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_thursday':
        this.formGroupProduct.patchValue({
          is_available_thursday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_friday':
        this.formGroupProduct.patchValue({
          is_available_friday: event.detail.checked == true ? 1 : 0
        });
        break;

      case 'is_available_saturday':
        this.formGroupProduct.patchValue({
          is_available_saturday: event.detail.checked == true ? 1 : 0
        });
        break;
    }
  }

  public dismiss() {
    this.modalCtrl.dismiss();
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
      this.formGroupProduct.patchValue({
        start_time: '00:00',
        end_time: '00:00'
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

  private prepareSubcategories() {

    this.loading = true;

    this.productSrv.getSubcategories()
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.subcategories = res.data;

        }

      });

  }
  
}
