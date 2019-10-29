import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DataTablesModule } from 'angular-datatables';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { ProductService } from './shared/product.service';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { ToponlinedealsComponent } from './home/toponlinedeals/toponlinedeals.component';
import { SharedService } from './shared/shared.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CartComponent } from './cart/cart.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CarouselComponent } from './home/carousel/carousel.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AccordionPanelComponent } from 'ngx-bootstrap/accordion';
import { ProductViewComponent } from './home/product-view/product-view.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    AdminPanelComponent,
    ForbiddenComponent,
    NavMenuComponent,
    ToponlinedealsComponent,
    CartComponent,
    CarouselComponent,
    ProductViewComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    DataTablesModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true
    }),
    FormsModule,
    CarouselModule.forRoot()
  ],
  providers: [UserService, ProductService, SharedService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
