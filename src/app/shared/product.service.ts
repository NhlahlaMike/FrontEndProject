import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError, pipe } from 'rxjs';
import { Product } from '../interfaces/Product';
import { flatMap, first, shareReplay } from 'rxjs/operators';
import { ProductSubCategory } from '../interfaces/product-sub-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }

  readonly BaseURI = 'http://localhost:54277/api/Product';

  private	product$: Observable<Product[]>;
  private	myproduct$: Observable<ProductSubCategory[]>;
  private categories$: Observable<ProductSubCategory[]>;
  public isActive: boolean[] = [];
  private obsisActive = new BehaviorSubject<boolean[]>([]);
  isActiveValue =  this.obsisActive.asObservable();

  heartToggle(product: Product) {
    if (this.isActive[product.Id] === undefined || this.isActive[product.Id] === null) {
      this.isActive[product.Id] = false;
    }

    this.isActive[product.Id] = !this.isActive[product.Id];
    localStorage.setItem('favToggle', JSON.stringify(this.isActive));
    // works
    // this.isActive.splice(product.Id, 1, !this.isActive[product.Id]);
    console.log(this.isActive[product.Id]);
  }

  getHeartToggle(): boolean[] {
    return JSON.parse(localStorage.getItem('favToggle'));
  }

  getnewheart() {
   this.obsisActive.next(JSON.parse(localStorage.getItem('favToggle')));
  }

  getmyProducts(): Observable<ProductSubCategory[]> {
    if (!this.myproduct$) {
      this.myproduct$ = this.http.get < ProductSubCategory[] > (this.BaseURI + '/GetProducts').pipe(shareReplay());
    }
    return this.myproduct$;
  }

  // Get All Categories
  getCategories(): Observable<ProductSubCategory[]> {
    if (!this.categories$) {
      this.categories$ = this.http.get < ProductSubCategory[] > (this.BaseURI + '/GetCategories').pipe(shareReplay());
    }
    return this.categories$;
  }

  // Get All Products
  getProducts(): Observable<Product[]> {
    if (!this.product$) {
      this.product$ = this.http.get < Product[] > (this.BaseURI + '/GetProducts').pipe(shareReplay());
    }
    return this.product$;
  }

  // Get Product by Id
  getProductsById(id: number): Observable<Product> {
    return this.getProducts().pipe(flatMap(result => result), first(product => product.Id === id));
  }

  // Insert Product
  insertProduct(NewProduct: Product): Observable<Product> {
    return this.http.post <Product> (this.BaseURI + '/PostProducts', NewProduct);
  }

  // Update Product
 updateProduct(id: number, editProduct: Product): Observable<Product> {
  return this.http.put <Product> (this.BaseURI + '/UpdateProduct/' + id, editProduct);
  }

  // Delete Product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete <Product> (this.BaseURI + '/DeleteProduct/' + id);
  }

  // Clear Products Cache
  clearCache() {
    this.product$ = null;
  }

  // Add Products to cart
  addProductToCart(products: any) {
    localStorage.setItem('product', JSON.stringify(products));
  }

  // Get Products from Cart
  getProductFromCart() {
    return JSON.parse(localStorage.getItem('product'));
  }

  // Remove product from cart
  removeAllProductFromCart() {
    return localStorage.removeItem('product');
  }

  // Add product to favourites
  addProductsFromFavourites(product: any) {
    localStorage.setItem('favProduct', JSON.stringify(product));
  }
  // Get Products from favourites cache
  getProductsFromFavourites() {
    return JSON.parse(localStorage.getItem('favProduct'));
  }
  errorHandler(error: Response) {
    console.log(error);
    return throwError(error);
  }
  addDisplayProduct(products: any) {
    localStorage.setItem('ProductsOnView', JSON.stringify(products));
  }
  getDisplayedProduct() {
    return JSON.parse(localStorage.getItem('ProductsOnView'));
  }

  // Get user from local storage
  getUserFromLC() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  // Match roles
  roleMatch(allowedRoles): boolean {
    let isMatch = false;
    const payLoad = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
    const userRole = payLoad.role;
    allowedRoles.forEach(element => {
      if (userRole === element) {
        isMatch = true;
        return false;
      }
    });
    return isMatch;
  }
}
