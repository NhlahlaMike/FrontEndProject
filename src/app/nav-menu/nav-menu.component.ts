import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { UserService } from '../shared/user.service';
import { Product } from './../interfaces/product';
import { ProductService } from '../shared/product.service';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private uservice: UserService, private pservice: ProductService, private sharedService: SharedService) { }

  LoginStatus$: Observable<boolean>;

  UserName$: Observable<string>;
  productAddedTocart: Product[];
  cartItemCount = 0;

  ngOnInit() {

      this.LoginStatus$ = this.uservice.isLoggesIn;

      this.UserName$ = this.uservice.currentUserName;

      if (this.cartItemCount < 1 ) {
        this.cartItemCount = 0;
      }

      this.productAddedTocart = this.pservice.getProductFromCart();
      this.cartItemCount = this.productAddedTocart.length;
      // this.cartEvent.emit(this.cartItemCount);
      this.sharedService.updateCartCount(this.cartItemCount);
}

  onLogout() {

     this.uservice.logout();
  }

}
