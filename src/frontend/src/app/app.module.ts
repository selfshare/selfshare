import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import {HeaderUserComponent} from './components/header/header-user/header-user.component';
import {HeaderAdminComponent} from './components/header/header-admin/header-admin.component';
import {AppRoutingModule} from './app-routing.module';
import {GalleryComponent} from './components/gallery/gallery.component';
import { AboutComponent } from './components/about/about.component';
import { DashboardContentComponent } from './components/dashboards/dashboard-content/dashboard-content.component';
import { DashboardAboutMeComponent } from './components/dashboards/dashboard-about-me/dashboard-about-me.component';
import { DashboardSecurityComponent } from './components/dashboards/dashboard-security/dashboard-security.component';
import { DashboardDesignComponent } from './components/dashboards/dashboard-design/dashboard-design.component';
import {DashboardComponent} from './components/dashboards/dashboard/dashboard.component';
import { AddImageDialogComponent } from './add-image-dialog/add-image-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    HeaderUserComponent,
    HeaderAdminComponent,
    GalleryComponent,
    AboutComponent,
    DashboardContentComponent,
    DashboardAboutMeComponent,
    DashboardSecurityComponent,
    DashboardDesignComponent,
    AddImageDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
