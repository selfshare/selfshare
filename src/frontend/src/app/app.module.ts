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
import { AddImageDialogComponent } from './components/dialogs/add-image-dialog/add-image-dialog.component';
import { LargeImageDialogComponent } from './components/dialogs/large-image-dialog/large-image-dialog.component';
import {FormsModule} from "@angular/forms";

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
    AddImageDialogComponent,
    LargeImageDialogComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
