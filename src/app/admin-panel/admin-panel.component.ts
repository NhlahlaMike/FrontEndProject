import { UserService } from './../shared/user.service';
import { Product } from './../interfaces/product';
import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { ProductService } from '../shared/product.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  userDetails;
  myproducts;
  LoginStatus$: Observable<boolean>;
  UserName$: Observable<string>;
  Categories: string;

  // Datatables Properties
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  @ViewChild(DataTableDirective, { static: false }) dtElement: DataTableDirective;

  // For the FormControl - Adding products
  insertForm: FormGroup;
  // Id: FormControl;
  Barcode: FormControl;
  ProductName: FormControl;
  ProductType: FormControl;
  Quantity: FormControl;
  Description: FormControl;
  UnitPrice: FormControl;
  Features: FormControl;
  Usage: FormControl;
  BillingAddress: FormControl;
  TC: FormControl;
  ImageUrl: FormControl;
  Category: FormControl;
  ProductSubCategoryID: FormControl;

  // Updating the Product
  updateForm: FormGroup;
  // tslint:disable-next-line:variable-name
  _Id: FormControl;
  // tslint:disable-next-line:variable-name
  _Barcode: FormControl;
  // tslint:disable-next-line:variable-name
  _ProductName: FormControl;
  // tslint:disable-next-line:variable-name
  _ProductType: FormControl;
  // tslint:disable-next-line:variable-name
  _Quantity: FormControl;
  // tslint:disable-next-line:variable-name
  _Description: FormControl;
  // tslint:disable-next-line:variable-name
  _UnitPrice: FormControl;
  // tslint:disable-next-line:variable-name
  _Features: FormControl;
  // tslint:disable-next-line:variable-name
  _Usage: FormControl;
  // tslint:disable-next-line:variable-name
  _BillingAddress: FormControl;
  _TC: FormControl;
  // tslint:disable-next-line:variable-name
  _ImageUrl: FormControl;
  // tslint:disable-next-line:variable-name
  _Category: FormControl;
  // tslint:disable-next-line:variable-name
  _ProductSubCategoryID: FormControl;

  // Add Modal
  @ViewChild('addTemplate', { static: false }) addmodal: TemplateRef<any>;
  // Update Modal
  @ViewChild('editTemplate', { static: false }) editmodal: TemplateRef<any>;
  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selectedProduct: Product;
  products$: Observable<Product[]>;
  products: Product[] = [];
  userRoleStatus: string;

  constructor(private fb: FormBuilder,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private router: Router,
              private chRef: ChangeDetectorRef,
              private pservice: ProductService,
              private uservice: UserService) { }

  ngOnInit() {

    // datatable initialization
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 9,
      autoWidth: true,
      order: [[0, 'asc']]
    };


    this.products$ = this.pservice.getProducts();

    this.products$.subscribe(result => {
      this.products = result;

      this.chRef.detectChanges();

      this.dtTrigger.next();
    });

    this.modalMessage = 'All Fields Are Mandatory';
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
        console.log(res);
      },
      err => {
        console.log(err);
      },
    );

    // validation for products input properties
    // this.Id = new FormControl();
    this.Barcode = new FormControl('', [Validators.required]);
    this.ProductName = new FormControl('', [Validators.required]);
    this.ProductType = new FormControl('', [Validators.required]);
    this.Quantity = new FormControl('', [Validators.required]);
    this.Description = new FormControl('', [Validators.required]);
    this.UnitPrice = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.Features = new FormControl('', [Validators.required]);
    this.Usage = new FormControl('', [Validators.required]);
    this.BillingAddress = new FormControl('', [Validators.required]);
    this.TC = new FormControl('', [Validators.required]);
    this.ImageUrl = new FormControl('', [Validators.required]);
    this.Category = new FormControl('', [Validators.required]);
    this.ProductSubCategoryID = new FormControl('', [Validators.required]);

    // inserting input values
    this.insertForm = this.fb.group({
      Barcode: this.Barcode,
      ProductName: this.ProductName,
      ProductType: this.ProductType,
      Quantity: this.Quantity,
      Description: this.Description,
      UnitPrice: this.UnitPrice,
      Features: this.Features,
      Usage: this.Usage,
      BillingAddress: this.BillingAddress,
      TC: this.TC,
      ImageUrl: this.ImageUrl,
      Category: this.Category,
      ProductSubCategoryID: this.ProductSubCategoryID
    });

    // validation for products input properties
    this._Id = new FormControl();
    this._Barcode = new FormControl('', [Validators.required]);
    this._ProductName = new FormControl('', [Validators.required]);
    this._ProductType = new FormControl('', [Validators.required]);
    this._Quantity = new FormControl('', [Validators.required]);
    this._Description = new FormControl('', [Validators.required]);
    this._UnitPrice = new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._Features = new FormControl('', [Validators.required]);
    this._Usage = new FormControl('', [Validators.required]);
    this._BillingAddress = new FormControl('', [Validators.required]);
    this._TC = new FormControl('', [Validators.required]);
    this._ImageUrl = new FormControl('', [Validators.required]);
    this._Category = new FormControl('', [Validators.required]);
    this._ProductSubCategoryID = new FormControl('', [Validators.required]);

    // inserting input values
    this.updateForm = this.fb.group({
      Id: this._Id,
      Barcode: this._Barcode,
      ProductName: this._ProductName,
      ProductType: this._ProductType,
      Quantity: this._Quantity,
      Description: this._Description,
      UnitPrice: this._UnitPrice,
      Features: this._Features,
      Usage: this._Usage,
      BillingAddress: this._BillingAddress,
      TC: this._TC,
      ImageUrl: this._ImageUrl,
      Category: this._Category,
      ProductSubCategoryID: this._ProductSubCategoryID
    });

  }

  // Modal Message

  onLogout() {
    this.uservice.logout();
  }

  decodeToken() {
    this.uservice.checkLoginStatus();
  }

  onUpdate() {
      const editProduct = this.updateForm.value;
      this.pservice.updateProduct(editProduct.Id, editProduct).subscribe(
      result => {
          console.log('Product Updated');
          this.toastr.success('User updated successfully!');
          this.pservice.clearCache();
          this.products$ = this.pservice.getProducts();
          this.products$.subscribe(updatedlist => {
          this.products = updatedlist;

          this.modalRef.hide();
          this.rerender();
          });
      },
          error => {
            console.log('Could Not Update Product');
            this.toastr.error('User update failed');
          }
      );
  }

  // Update an Existing Product
  onUpdateModal(productEdit: Product): void {
    this._Id.setValue(productEdit.Id);
    this._Barcode.setValue(productEdit.Barcode);
    this._ProductName.setValue(productEdit.ProductName);
    this._ProductType.setValue(productEdit.ProductType);
    this._Quantity.setValue(productEdit.Quantity);
    this._Description.setValue(productEdit.Description);
    this._UnitPrice.setValue(productEdit.UnitPrice);
    this._Features.setValue(productEdit.Features);
    this._Usage.setValue(productEdit.Usage);
    this._BillingAddress.setValue(productEdit.BillingAddress);
    this._TC.setValue(productEdit.TC);
    this._ImageUrl.setValue(productEdit.ImageUrl);
    this._Category.setValue(productEdit.Category);
    this._ProductSubCategoryID.setValue(productEdit.ProductSubCategoryID);

    this.updateForm.setValue({
      Id: this._Id.value,
      Barcode: this._Barcode.value,
      ProductName: this._ProductName.value,
      ProductType: this._ProductType.value,
      Quantity: this._Quantity.value,
      Description: this._Description.value,
      UnitPrice: this._UnitPrice.value,
      Features: this._Features.value,
      Usage: this._Usage.value,
      BillingAddress: this._BillingAddress.value,
      TC: this._TC.value,
      ImageUrl: this._ImageUrl.value,
      Category: this._Category.value,
      ProductSubCategoryID: this._ProductSubCategoryID.value
    });

    this.modalRef = this.modalService.show(this.editmodal);
    this.modalRef.setClass('modal-lg');

  }

    /// Load Add New product Modal
    onAddProduct() {
        this.modalRef = this.modalService.show(this.addmodal);
        this.modalRef.setClass('modal-lg');
    }

    onSubmit() {
    const newProduct = this.insertForm.value;
    console.log(newProduct);
    this.pservice.insertProduct(newProduct).subscribe(
      (res: any) => {
        if (res.succeeded) {
          this.modalRef.hide();
          this.toastr.success('New user created!', 'Registration successful.');
          this.insertForm.reset();
          this.rerender();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  // Method to Delete the product
  onDelete(product: Product): void {
      this.pservice.deleteProduct(product.Id).subscribe(result => {
      this.pservice.clearCache();
      this.products$ = this.pservice.getProducts();
      this.products$.subscribe(newlist => {
      this.products = newlist;
      this.rerender();
      });
    });
  }

  rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first in the current context
      dtInstance.destroy();

      // Call the dtTrigger to rerender again
      this.dtTrigger.next();

    });
  }

}
