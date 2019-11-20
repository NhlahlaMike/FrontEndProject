import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { Router } from '@angular/router';
import { Product } from '../interfaces/product';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ProductSubCategory } from './../interfaces/product-sub-category';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css']
})
export class FavouriteComponent implements OnInit {

product$: Observable<Product[]>;
product: Product[] = [];
productCategory$: Observable<ProductSubCategory[]>;
productCategory: ProductSubCategory[] = [];
productAddedToFavourite: Product[];

  constructor(private pservice: ProductService,
              private router: Router,
              private toaster: ToastrService,
              private sharedService: SharedService) { }

  ngOnInit() {
this.productAddedToFavourite = this.pservice.getProductsFromFavourites();
  }

}
