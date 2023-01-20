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
import { StoreModule } from '@ngrx/store';
import { appReducer } from './app.reducer';
import { AppConfigService } from '../app/app.config.service';
import { EffectsModule } from '@ngrx/effects'
import { AppEffects } from '../app/app.effects'; 
import { RestService } from './_services/model.service';
import { SaveDailogBoxComponent } from './save-dailog-box/save-dailog-box.component';
import { ClosingDayEntryComponent } from './closing-day-entry/closing-day-entry.component';



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
    DeliverUpdatePageComponent,
    SaveDailogBoxComponent,
    ClosingDayEntryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MaterialModule,
    HttpClientModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    StoreModule.forRoot(
      {
        app: appReducer,
      }),
    NgIdleKeepaliveModule.forRoot(),
    EffectsModule.forRoot([
      AppEffects
    ]),
  ],
  providers: [
    AuthGuard,
    BackendService,
    AuthenticationService,
    ,AppConfigService,
    RestService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
