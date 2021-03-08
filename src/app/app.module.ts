import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { INgxLoadingConfig, NgxLoadingModule } from 'ngx-loading';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { CustomScrollModule } from './directives/custom-scroll/custom-scroll.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { IonicConfig } from '@ionic/core';

registerLocaleData(localePt);

const loadingConfig: INgxLoadingConfig = {
  backdropBorderRadius: '4px',
  backdropBackgroundColour: 'rgba(255, 255, 255, 0.5)',
  primaryColour: '#18a4e0',
  secondaryColour: '#18a4e0',
  tertiaryColour: '#18a4e0',
  fullScreenBackdrop: true
};

const ionicConfig: IonicConfig = {
  mode: 'ios',
  backButtonText: 'Voltar'
}; 

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CustomScrollModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxLoadingModule.forRoot(loadingConfig),    
    IonicModule.forRoot(ionicConfig)
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
