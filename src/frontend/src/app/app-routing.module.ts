import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {GalleryComponent} from './components/gallery/gallery.component';
import {DashboardComponent} from './components/dashboards/dashboard/dashboard.component';
import {AboutComponent} from './components/about/about.component';
import {DisclaimerComponent} from './components/disclaimer/disclaimer.component';
import {LoginComponent} from './components/login/login.component';
import {AdminGuard} from './guards/admin/admin.guard';
import {SetupComponent} from './components/setup/setup.component';
import {SetupGuard} from './guards/setup/setup.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent, canActivate: [AdminGuard]},
  {path: 'about', component: AboutComponent},
  {path: 'setup', component: SetupComponent, canActivate: [SetupGuard]},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard]},
  {path: 'dashboard/:view', component: DashboardComponent, canActivate: [AdminGuard]},
  {path: 'disclaimer', component: DisclaimerComponent},
  {path: ':title', component: GalleryComponent},
  {path: ':title/:imageId', component: GalleryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
