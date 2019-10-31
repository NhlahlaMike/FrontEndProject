import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../shared/product.service';
import { SharedService } from '../../shared/shared.service';
import { Product } from '../../interfaces/product';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.css']
})
export class ProductViewComponent implements OnInit {

  @Output() cartEvent = new EventEmitter<number>();
  products$: Observable<Product[]>;
  productAddedTocart: Product[];
  cartItemCount: number;
  checked: boolean[] = [];

  @Input() product: Product;
  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private route: ActivatedRoute,
              private router: Router,
              private pservice: ProductService,
              private sharedService: SharedService) { }

  ngOnInit() {
    const id = + this.route.snapshot.params.id;
    this.pservice.getProductsById(id).subscribe(result => this.product = result);

    if (this.cartItemCount < 1) {
      this.cartItemCount = 0;
    }

    this.product.Quantity = 1;
  }

  OnAddCart(product: Product) {
     this.productAddedTocart = this.pservice.getProductFromCart();

     if (this.productAddedTocart === null) {
      this.productAddedTocart = [];
      this.productAddedTocart.push(product);
      this.pservice.addProductToCart(this.productAddedTocart);
      setTimeout(() => {
        this.toastr.success('Product Added!', 'Successfully Added!', {timeOut: 1000});
   }, 500);
     } else {
      let checkId = null;
      this.productAddedTocart.forEach((item, index) => {
        if (product.Id === item.Id) {
          checkId = item.Id;
        }
      });

      if (checkId === null) {
        this.productAddedTocart.push(product);
        this.pservice.addProductToCart(this.productAddedTocart);
        this.toastr.success('Product Added!', 'Successfully Added!');
      } else {
        this.toastr.error('Product Not Added!', 'Product already exist in cart.', {timeOut: 1000});
      }

     }
  }

  onAddQuantity(product: Product) {
    // Get Product to add quantity
    if (Number(this.product.Quantity) === 1) {
      this.product.Quantity = 1;
      // this.isDisabled[Number(id)] = false;
      this.product.isDisabled = false;
    }
    if (Number(this.product.Quantity) >= 1) {
      this.product.Quantity = product.Quantity + 1;
      this.product.isDisabled = true;
    }

  }

  onMinusQuantity(product: Product) {
     // Get Product to Minus quantity
    if (Number(this.product.Quantity) === 1) {
      this.product.Quantity = 1;
      // this.isDisabled[Number(id)] = false;
      this.product.isDisabled = false;
    }
    if (Number(this.product.Quantity) >= 2) {
      this.product.Quantity = product.Quantity - 1;
      this.product.isDisabled = true;
    }
  }
  selectAllCheckBox(option, event) {
    this.checked[option] = event;
   /* this.ordersData.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.orders as FormArray).push(control);
    });*/
  }

}
