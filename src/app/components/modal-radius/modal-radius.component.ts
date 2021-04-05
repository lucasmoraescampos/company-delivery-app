import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { CompanyService } from 'src/app/services/company.service';

declare const google: any;

@Component({
  selector: 'app-modal-radius',
  templateUrl: './modal-radius.component.html',
  styleUrls: ['./modal-radius.component.scss'],
})
export class ModalRadiusComponent implements OnInit, OnDestroy {

  @ViewChild('map', { static: true }) mapElement: ElementRef;

  public loading: boolean;

  public company: any;

  public radius: number;

  private map: any;

  private circle: any;

  private unsubscribe = new Subject();

  constructor(
    private modalCtrl: ModalController,
    private companySrv: CompanyService,
    private alertSrv: AlertService
  ) { }

  ngOnInit() {

    this.company = this.companySrv.getCurrentCompany();

    this.radius = this.company.radius;

    this.initMap();

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public dismiss() {
    this.modalCtrl.dismiss();
  }

  public radiusChanged() {
    this.circle.setRadius(this.radius * 1000);
  }

  public save() {

    this.loading = true;

    this.companySrv.update(this.company.id, { radius: this.radius })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(res => {

        this.loading = false;

        if (res.success) {

          this.alertSrv.toast({
            icon: 'success',
            message: res.message
          });

          this.modalCtrl.dismiss(res.data);

        }

      });

  }

  private async initMap() {

    const latLng = new google.maps.LatLng(this.company.latitude, this.company.longitude);

    const mapOptions = {
      center: latLng,
      zoom: 13,
      zoomControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    const marker = new google.maps.Marker({
      map: this.map,
      draggable: false,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    this.circle = new google.maps.Circle({
      map: this.map,
      radius: this.radius * 1000,
      strokeColor: '#18a4e0',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#18a4e0',
      fillOpacity: 0.35
    });

    this.circle.bindTo('center', marker, 'position');

  }

}
