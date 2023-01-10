import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about';
import { AuthGuard } from './_guard';
import { NotFoundPageComponent } from './notfoundpage';
import { LoginComponent } from './login';
import { LoadingComponent } from './loading';
import { PriceChangeComponent } from './price-change/price-change.component';
import { HomeComponent } from './home/home.component';
import { DeliverUpdatePageComponent } from './deliver-update-page/deliver-update-page.component'


// const routes: Routes = [];

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "loading",
    component: LoadingComponent,
  
  },
  {
    path: "about",
    component: AboutComponent
    , canActivate: [AuthGuard]
  },
  {
  path:'PriceChange',
  component:PriceChangeComponent,
  canActivate:[AuthGuard]
  },
  {
    path:'deliverypage',
    component:DeliverUpdatePageComponent,
    canActivate:[AuthGuard]
  },

  {
    path: "Home",
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: 'Home', pathMatch: 'full' },
  {
    path: "**",
    component: NotFoundPageComponent
  },
  
  // ]
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
