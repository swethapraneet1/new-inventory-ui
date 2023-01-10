import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material.module';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { LoginComponent } from './login';
import { AuthenticationService, BackendService, PagerService } from './_services';
import { HttpClientModule } from '@angular/common/http';
import { AboutComponent } from './about';
import { NotFoundPageComponent } from './notfoundpage';
import { ConfirmDialog } from './shared/dialog.component';
import { LoadingComponent } from  './loading';
import { AuthGuard } from './_guard';
import { DailogBoxComponent } from './dailog-box/dailog-box.component';
import { PriceChangeComponent } from './price-change/price-change.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { HomeComponent } from './home/home.component';
import { PumpInfoDailogComponent } from './pump-info-dailog/pump-info-dailog.component';
import { DeliverUpdatePageComponent } from './deliver-update-page/deliver-update-page.component';


@NgModule({
  declarations: [
    LoginComponent,
    AboutComponent,
    NotFoundPageComponent,
    ConfirmDialog,
    LoadingComponent,
    AppComponent,
    DailogBoxComponent,
    PriceChangeComponent,
    HomeComponent,
    PumpInfoDailogComponent,
    DeliverUpdatePageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    AuthGuard,
    BackendService,
    AuthenticationService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
