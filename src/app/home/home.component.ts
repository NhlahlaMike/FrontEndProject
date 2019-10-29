import { UserService } from './../shared/user.service';
import { Product } from './../interfaces/product';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../shared/product.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, Subject, ReplaySubject, BehaviorSubject} from 'rxjs';
import { SharedService } from '../shared/shared.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userDetails;
  myproducts;
  LoginStatus$: Observable<boolean>;
  UserName$: Observable<string>;
  cartItemCount: number;
    // For the FormControl - Adding products
    insertForm: FormGroup;

    Barcode: FormControl;
    ProductName: FormControl;
    ProductType: FormControl;
    Description: FormControl;
    ImageUrl: FormControl;
    Features: FormControl;
    Usage: FormControl;

    // Modal properties
    selectedProduct: Product;
    products$: Observable<Product[]>;
    products: Product[] = [];
    userRoleStatus: string;

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private router: Router,
                private sharedservice: SharedService,
                private pservice: ProductService,
                private uservice: UserService) { }

  ngOnInit() {

    this.sharedservice.currentMessage.subscribe(msg => this.cartItemCount = msg);
// load user profile details
    this.uservice.getUserProfile().subscribe(
      res => {
        this.userDetails = res;
        // console.log(res);
      },
      err => {
        console.log(err);
      },
    );
// load user products details
    this.pservice.getProducts().subscribe(
      res => {
        this.products = res;
        // console.log(res);
      },
      err => {
        console.log(err);
      },
    );

    this.Barcode =  new FormControl('', [Validators.required]);
    this.ProductName =  new FormControl('', [Validators.required]);
    this.ProductType =  new FormControl('', [Validators.required]);
    this.Description =  new FormControl('', [Validators.required]);
    this.ImageUrl =  new FormControl('', [Validators.required]);
    this.Features =  new FormControl('', [Validators.required]);
    this.Usage =  new FormControl('', [Validators.required]);

    this.insertForm = this.fb.group({
    Barcode: this.Barcode,
    ProductName: this.ProductName,
    ProductType: this.ProductType,
    Description: this.Description,
    ImageUrl: this.ImageUrl,
    Features: this.Features,
    Usage: this.Usage
  });

    this.products$ = this.pservice.getProducts();

    this.products$.subscribe(result => {
    this.products = result;
});

  }

  onLogout() {
    this.uservice.logout();
  }

  onSubmit() {
    const newProduct = this.insertForm.value;
    console.log(newProduct);
    this.pservice.insertProduct(newProduct).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.insertForm.reset();
          this.toastr.success('New user created!', 'Registration successful.');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}

