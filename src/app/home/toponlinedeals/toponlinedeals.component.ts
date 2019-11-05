import { Product } from './../../interfaces/product';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from './../../shared/product.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { SharedService } from '../../shared/shared.service';
import { IAlert } from './../../interfaces/ialert';
import { ProductDisplay } from '../../interfaces/product-display';

@Component({
  selector: 'app-toponlinedeals',
  templateUrl: './toponlinedeals.component.html',
  styleUrls: ['./toponlinedeals.component.css']
})
export class ToponlinedealsComponent implements OnInit {
  products$: Observable<Product[]>;
  products: Product[] = [];
  allProducts$: Observable<Product[]>;
  allProducts: ProductDisplay[] = [];
  changeQuantiy: FormGroup;
  cquantity: number;
  insertQuantity: FormControl;
  displayProduct: Product[];
  dafualtQuantity: number;
  selectedProduct: Product;

  // cart declarations
  public alerts: Array<IAlert> = [];
  cartItemCount: number = 0;
  @Output() cartEvent = new EventEmitter<number>();
  public globalResponse: any;
  yourByteArray: any;
  productAddedTocart: Product[];
  productViedFromCart: Product[]; // not used
  // isDisabled: boolean[] = [];

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private pservice: ProductService,
              private sharedService: SharedService) { }

  ngOnInit() {

    if (this.cartItemCount < 1 ) {
      this.cartItemCount = 0;
    }

    // load all products from database
    this.products$ = this.pservice.getProducts();
    this.products$.subscribe(
    res => {
      this.products = res;
      this.globalResponse = res;
      res.map(item => {
        console.log(item);
      });

    },
    err => {
      console.log(err);
    },
    () => {
      this.allProducts = this.globalResponse;

    }
  );

  // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < 4; i++) {
    // this.isDisabled.push(true);
    // console.log(this.isDisabled);
  }

    this.pservice.addDisplayProduct(this.products);
    this.displayProduct = this.pservice.getDisplayedProduct();
    // console.log(this.products);
    this.displayProduct.forEach((item, index) => {
    this.displayProduct[index].Quantity = 1;
      // console.log(this.displayProduct[index].Quantity);
 });
//     for (const i of this.products) {
//     this.products[0].Quantity = 1;
//  }
    this.products.forEach((item, index) => {
    this.products[index].Quantity = 1;
      // console.log(this.products[index].Quantity);
 });

  }

  OnAddCart(product: Product) {
    // console.log('Product Info: ' + product);
    // alert('Adding in cart');

    this.productAddedTocart = this.pservice.getProductFromCart();

    if (this.productAddedTocart === null) {
      alert('Null cart');
      this.productAddedTocart = [];
      this.productAddedTocart.push(product);
      this.pservice.addProductToCart(this.productAddedTocart);
      this.alerts.push({
        id: 1,
        type: 'success',
        message: 'Product added to cart.'
      });
      setTimeout(() => {
        this.closeAlert(this.alerts);
   }, 3000);

    } else {

      // works
      // const tempProduct = this.productAddedTocart.find(p => p.Id === product.Id).Id;
      // console.log(tempProduct);
      // if (tempProduct === null) {
      //   console.log('null value is: ' + tempProduct);
      // } else {
      //   console.log('value is: ' + tempProduct);
      // }
      const mytemp = JSON.parse(JSON.stringify(this.productAddedTocart));
      const mytempCheck = mytemp.find(p => p.Id === product.Id);

      let tempIdval = null;
      this.productAddedTocart.forEach((item, index) => {
        if (product.Id === item.Id) {
          tempIdval = item.Id;
        }
      });
      console.log(tempIdval);

      if (tempIdval === null) {
        alert('Product does not in cart');
        this.productAddedTocart.push(product);
        this.pservice.addProductToCart(this.productAddedTocart);
        this.alerts.push({
          id: 1,
          type: 'success',
          message: 'Product added to cart.'
        });
        // setTimeout(function(){ }, 2000);
        setTimeout(() => {
          this.closeAlert(this.alerts);
     }, 3000);
      } else {
        this.alerts.push({
          id: 2,
          type: 'warning',
          message: 'Product already exist in cart.'
        });
        setTimeout(() => {
          this.closeAlert(this.alerts);
     }, 3000);
      }
    }
    // console.log(this.cartItemCount);
    this.cartItemCount = this.productAddedTocart.length;
    // this.cartEvent.emit(this.cartItemCount);
    this.sharedService.updateCartCount(this.cartItemCount);
    // console.log(this.cartItemCount);
    // console.log(this.productAddedTocart);
  }

  public closeAlert(alert: any) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
}

onAddQuantity(product: Product) {
  // Get Product to add quantity
  if (Number(this.products.find(p => p.Id === product.Id).Quantity) === 1) {
    this.products.find(p => p.Id === product.Id).Quantity = 1;

    const id = this.products.find(p => p.Id === product.Id).Id;
    // this.isDisabled[Number(id)] = false;
    this.products.find(p => p.Id === product.Id).isDisabled = false;
  }
  if (Number(this.products.find(p => p.Id === product.Id).Quantity) >= 1) {
    this.products.find(p => p.Id === product.Id).Quantity = product.Quantity + 1;
    this.products.find(p => p.Id === product.Id).isDisabled = true;
  }

}

onMinusQuantity(product: Product) {
   // Get Product to Minus quantity
  if (Number(this.products.find(p => p.Id === product.Id).Quantity) === 1) {
    this.products.find(p => p.Id === product.Id).Quantity = 1;

    const id = this.products.find(p => p.Id === product.Id).Id;
    // this.isDisabled[Number(id)] = false;
    this.products.find(p => p.Id === product.Id).isDisabled = false;
  }
  if (Number(this.products.find(p => p.Id === product.Id).Quantity) >= 2) {
    this.products.find(p => p.Id === product.Id).Quantity = product.Quantity - 1;
    this.products.find(p => p.Id === product.Id).isDisabled = false;
  }
}

selectedPic(product: Product) {
  this.pservice.getProductsById(product.Id);
}

onSelect(product: Product): void {
    this.selectedProduct = product;

    this.router.navigateByUrl('/ProductView/' + product.Id);
}

}
