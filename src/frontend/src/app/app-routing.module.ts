import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import {DashboardComponent} from './components/dashboards/dashboard/dashboard.component';
import {AboutComponent} from './components/about/about.component';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {LoginComponent} from './components/login/login.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/:view', component: DashboardComponent },
  { path: 'disclaimer', component: DisclaimerComponent },
  { path: ':title', component: GalleryComponent },
  { path: ':title/:imageId', component: GalleryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
