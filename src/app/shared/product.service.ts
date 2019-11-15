import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, pipe } from 'rxjs';
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

  getmyProducts(): Observable<ProductSubCategory[]> {
    if (!this.myproduct$) {
      this.myproduct$ = this.http.get < ProductSubCategory[] > (this.BaseURI + '/GetProducts').pipe(shareReplay());
    }
    return this.myproduct$;
  }
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
  // Get All Products
  getProductsById(id: number): Observable<Product> {
    return this.getProducts().pipe(flatMap(result => result), first(product => product.Id === id));
  }
  // Get All Products
  insertProduct(NewProduct: Product): Observable<Product> {
    return this.http.post <Product> (this.BaseURI + '/PostProducts', NewProduct);
  }
  // Get All Products
 updateProduct(id: number, editProduct: Product): Observable<Product> {
  return this.http.put <Product> (this.BaseURI + '/UpdateProduct/' + id, editProduct);
  }
  // Get All Products
  deleteProduct(id: number): Observable<any> {
    return this.http.delete <Product> (this.BaseURI + '/DeleteProduct/' + id);
  }
  clearCache() {
    this.product$ = null;
  }
  addProductToCart(products: any) {
    localStorage.setItem('product', JSON.stringify(products));
  }
  getProductFromCart() {
    // return localStorage.getItem("product");
    return JSON.parse(localStorage.getItem('product'));
  }
  removeAllProductFromCart() {
    return localStorage.removeItem('product');
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
  getUserFromLC() {
    // return localStorage.getItem("product");
    return JSON.parse(localStorage.getItem('userInfo'));
  }
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
