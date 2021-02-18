import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { ItemReorderEventDetail } from '@ionic/core';
import { CategoryService } from 'src/app/services/category.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from 'src/app/services/loading.service';
import { ArrayHelper } from 'src/app/helpers/array.helper';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit, OnDestroy {

  public reorder: boolean;

  public categories: any[];

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private categorySrv: CategoryService,
    private loadingSrv: LoadingService,
    private actionSheetCtrl: ActionSheetController,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.prepareCategories();

  }

  ngOnDestroy() {

    this.unsubscribe.next();

    this.unsubscribe.complete();

  }

  public doReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    this.categories = ev.detail.complete(this.categories);
  }

  public async options(category: any) {

    const actionSheet = await this.actionSheetCtrl.create({
      header: category.name,
      buttons: [{
        text: 'Editar',
        handler: () => {
          this.modalCategory(category);
        }
      }, {
        text: 'Excluir',
        handler: () => {
          this.deleteCategory(category);
        }
      }, {
        text: 'Reordenar',
        handler: () => {
          this.reorder = true;
        }
      }, {
        text: 'Cancelar',
        role: 'cancel'
      }]
    });

    await actionSheet.present();

  }

  public async modalCategory(category?: any) {

    const modal = await this.modalCtrl.create({
      component: ModalCategoryComponent,
      backdropDismiss: false,
      cssClass: 'modal-sm',
      componentProps: {
        category: category
      }
    });

    modal.onWillDismiss()
      .then(res => {

        if (res.data) {

          if (category) {

            const index = ArrayHelper.getIndexByKey(this.categories, 'id', category.id);

            this.categories[index] = res.data;

          }

          else {

            this.categories.push(res.data);

          }

        }

      });

    return await modal.present();

  }

  public save() {
    this.loadingSrv.show();
    this.categorySrv.reorder({ categories: this.categories })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        this.reorder = false;
        if (res.success) {
          this.categories = res.data;
          this.alertSrv.toast({
            icon: 'success',
            message: res.message
          });
        }
      });
  }

  private deleteCategory(category: any) {
    this.alertSrv.show({
      icon: 'question',
      message: `Excluir a categoria ${category.name}?`,
      confirmButtonText: 'Excluir',
      onConfirm: () => {
        
        this.loadingSrv.show();

        this.categorySrv.delete(category.id)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(res => {

            this.loadingSrv.hide();

            if (res.success) {

              const index = ArrayHelper.getIndexByKey(this.categories, 'id', category.id);
              
              this.categories = ArrayHelper.removeItem(this.categories, index);

              this.alertSrv.toast({
                icon: 'success',
                message: res.message
              });

            }

            else {

              this.alertSrv.toast({
                icon: 'error',
                message: res.message
              });

            }

          });

      }
    });
  }

  private prepareCategories() {
    this.loadingSrv.show();
    this.categorySrv.getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {
        this.loadingSrv.hide();
        if (res.success) {
          this.categories = res.data;
        }
      });
  }

}
