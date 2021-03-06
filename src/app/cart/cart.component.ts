import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, Output, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { IAlert } from './../interfaces/ialert';
import { ProductService } from './../shared/product.service';
import { Router, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../shared/shared.service';
import { Product } from '../interfaces/product';
import { OrderDetail } from './../interfaces/order-detail';
import { OrderItem } from '../interfaces/order-item';
import { UserService } from '../shared/user.service';
import { Registration } from '../interfaces/registration';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject, ReplaySubject} from 'rxjs';
import { filter } from 'rxjs/operators';
import { ResourceLoader } from '../../../node_modules/@angular/compiler';
import { OrderService } from '../shared/order.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  dafualtQuantity: number;
  productAddedTocart: Product[];
  allTotal: number;
  StringallTotal: string;
  DisplayPrice: number;
  StoreDisplayPrice: string;
  currentUser$: Observable<Registration[]>;
  currentUser: Registration[] = [];
  mycurrentUser: Registration[];
  orderDetail: OrderDetail;
  orderItem: OrderItem[];
  UserName: string;
  Phone: string;
  Email: string;
  ltotal: number[] = [];
  cartItemCount: number;
  userData: string[] = [];
  userDetails: any;
  // @ViewChild('trollyTemplate', {static: true}) cartmodal: TemplateRef<any>;
  // Modal properties
  modalMessage: string;
  modalRef: BsModalRef;
  selected: boolean[] = [];
  myuser: any;

  public globalResponse: any;
  public alerts: Array<IAlert> = [];


  deliveryForm: FormGroup;

  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private modalService: BsModalService,
              private pservice: ProductService,
              private uservice: UserService,
              private sharedService: SharedService,
              private orderService: OrderService) {

                router.events
                .subscribe((event: NavigationStart) => {
                  if (event.navigationTrigger === 'popstate') {
                    // Perform actions
                    // works
                    // alert(this.cartItemCount);
                    this.selected = [];
                    this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
                  }
                });

                router.events
                .pipe(
                    // The "events" stream contains all the navigation events. For this demo,
                    // though, we only care about the NavigationStart event as it contains
                    // information about what initiated the navigation sequence.
                    filter(
                        ( event: NavigationEvent ) => {

                            return( event instanceof NavigationStart );

                        }
                    )
                )
                .subscribe(
                    ( event: NavigationStart ) => {

                        console.group( 'NavigationStart Event' );
                        // Every navigation sequence is given a unique ID. Even "popstate"
                        // navigations are really just "roll forward" navigations that get
                        // a new, unique ID.
                        console.log( 'navigation id:', event.id );
                        console.log( 'route:', event.url );
                        // The "navigationTrigger" will be one of:
                        // --
                        // - imperative (ie, user clicked a link).
                        // - popstate (ie, browser controlled change such as Back button).
                        // - hashchange
                        // --
                        // NOTE: I am not sure what triggers the "hashchange" type.
                        console.log( 'trigger:', event.navigationTrigger );

                        if (event.navigationTrigger === 'popstate') {
                          // Perform actions
                          this.selected = [];
                          this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
                          // alert(this.cartItemCount);
                        }

                        // This "restoredState" property is defined when the navigation
                        // event is triggered by a "popstate" event (ex, back / forward
                        // buttons). It will contain the ID of the earlier navigation event
                        // to which the browser is returning.
                        // --
                        // CAUTION: This ID may not be part of the current page rendering.
                        // This value is pulled out of the browser; and, may exist across
                        // page refreshes.
                        if ( event.restoredState ) {

                            console.warn(
                                'restoring navigation id:',
                                event.restoredState.navigationId
                            );

                        }

                        console.groupEnd();

                    });
               }

  ngOnInit() {

    this.productAddedTocart = this.pservice.getProductFromCart();

    this.productAddedTocart.forEach((item, index) => {
    this.ltotal[index] = item.UnitPrice * this.productAddedTocart.find(p => p.Id === item.Id).Quantity;
    });

    this.productAddedTocart.forEach((item, index) => {
      this.selected[index] = false;
    });
    // tslint:disable-next-line:forin
    // for (const i in this.productAddedTocart) {
      // this.productAddedTocart[i].Quantity = 1;

      // console.log(this.productAddedTocart);
      // working on modal
      // this.modalService.config.class = 'modal-lg';
      // this.modalRef = this.modalService.show(this.cartmodal);
      // this.modalRef.setClass('fullscreen');
      // this.modalService.open(this.cartmodal, { windowClass: 'fullscreen' }); // old
    // }
    // load user profile details
    this.currentUser$ = this.uservice.getUsers();
    this.currentUser$.subscribe(
      res => {
        this.currentUser = res;
        this.globalResponse = res;
        this.userDetails = res;
        localStorage.setItem('userInfo', JSON.stringify(this.globalResponse));
        console.log(this.currentUser);
      },
      err => {
        console.log(err);
      },
      () => {
        this.currentUser = JSON.parse(JSON.stringify(this.globalResponse));
        console.log(this.globalResponse);
      }
    );

    this.mycurrentUser = JSON.parse(JSON.stringify(this.pservice.getUserFromLC()));
    // this.myuser = JSON.parse(JSON.stringify(this.pservice.getUserFromLC()));
    // this.currentUser = this.mycurrentUser;
    this.myuser = Object.assign({}, this.mycurrentUser);
    console.log(this.myuser.FullName);

    this.UserName = this.myuser.FullName;
    this.Phone = this.myuser.Phone;
    this.Email = this.myuser.Email;
    // alert(this.myuser.FullName);
    /*this.mycurrentUser.forEach((item, index) => {
      this.UserName = item.UserName;
      this.Phone = item.Phone;
      this.Email = item.Email;
   });*/

    this.pservice.removeAllProductFromCart();
    this.pservice.addProductToCart(this.productAddedTocart);
    this.calculteAllTotal(this.productAddedTocart);

    this.GetLoggedinUserDetails();

    this.deliveryForm = this.fb.group({
      UserName: ['', [Validators.required]],
      DeliveryAddress: ['', [Validators.required]],
      Phone: ['', [Validators.required]],
      Email: ['', [Validators.required]],
      Message: ['', []],
      Amount: ['', [Validators.required]],

    });

    this.deliveryForm.controls.UserName.setValue(this.UserName);
    this.deliveryForm.controls.Phone.setValue(this.Phone);
    this.deliveryForm.controls.Email.setValue(this.Email);
    this.deliveryForm.controls.Amount.setValue(this.allTotal);
  }
  onAddQuantity(product: Product) {
    // Get Product
    this.productAddedTocart = this.pservice.getProductFromCart();
    if (Number(this.productAddedTocart.find(p => p.Id === product.Id).Quantity) >= 1) {
      this.productAddedTocart.find(p => p.Id === product.Id).Quantity = product.Quantity + 1;
      this.productAddedTocart.find(p => p.Id === product.Id).isDisabled = true;
    // Find produc for which we want to update the quantity
    // let tempProd= this.productAddedTocart.find(p=>p.Id==product.Id);
    // tempProd.Quantity=tempProd.Quantity+1;

    // this.productAddedTocart=this.productAddedTocart.splice(this.productAddedTocart.indexOf(product), 1)
    // Push the product for cart
    // this.productAddedTocart.push(tempProd);

      this.pservice.removeAllProductFromCart();
      this.pservice.addProductToCart(this.productAddedTocart);
      this.calculteAllTotal(this.productAddedTocart);
      this.calcAllTotPrice(this.productAddedTocart, product.Id);
      this.deliveryForm.controls.Amount.setValue(this.allTotal);

      const CartProductscheckId = JSON.parse(JSON.stringify(this.pservice.getProductFromCart()));
      const mytempCheck = CartProductscheckId.find(p => p.Id === product.Id);

      let idFromCart = null;
      CartProductscheckId.forEach((item, index) => {
      if (product.Id === item.Id) {
        idFromCart = item.Id;
      }
    });
  }
    if (Number(this.productAddedTocart.find(p => p.Id === product.Id).Quantity) === 1) {
    this.productAddedTocart.find(p => p.Id === product.Id).Quantity = 1;
    // this.isDisabled[Number(id)] = false;
    this.productAddedTocart.find(p => p.Id === product.Id).isDisabled = false;
  }
    // console.log('tempIdval: ' + idFromCart);
    // Get Product to add quantity
   /* if (idFromCart !== null) {
        if (idFromCart === product.Id) {
          // console.log('Product exist');

          CartProductscheckId.forEach((item, index) => {
            if (product.Id === item.Id) {
              item.Quantity = product.Quantity;
              item.UnitPrice = product.UnitPrice;
            }
          });

        // Save the new item with updated value
          localStorage.setItem('product', JSON.stringify(CartProductscheckId));
        }
    }*/

    // update product
    // this.pservice.getProductFromCart.

  }
  onRemoveQuantity(product: Product) {
    if (Number(this.productAddedTocart.find(p => p.Id === product.Id).Quantity) >= 2) {
      this.productAddedTocart.find(p => p.Id === product.Id).isDisabled = true;
      this.productAddedTocart = this.pservice.getProductFromCart();
      this.productAddedTocart.find(p => p.Id === product.Id).Quantity = product.Quantity - 1;
      this.pservice.removeAllProductFromCart();
      this.pservice.addProductToCart(this.productAddedTocart);
      this.calculteAllTotal(this.productAddedTocart);
      this.deliveryForm.controls.Amount.setValue(this.allTotal);
    }
    if (Number(this.productAddedTocart.find(p => p.Id === product.Id).Quantity) === 1) {
      this.productAddedTocart.find(p => p.Id === product.Id).Quantity = 1;
      this.productAddedTocart.find(p => p.Id === product.Id).isDisabled = false;
    }
  }
  calculteAllTotal(allItems: Product[]) {
    let total = 0;
    let storeString: string;
    // tslint:disable-next-line:forin
    for (const i in allItems) {
      total = total + (allItems[i].Quantity * allItems[i].UnitPrice);
    }
    const res = (String(total)).split('.');
    // If there is no decimal point or only one decimal place found.
    if (res.length === 1 || res[1].length < 3) {
    // Set the number to two decimal places
    console.log(String(total.toFixed(2)));
    storeString = String(total.toFixed(2));
    total = parseFloat(storeString);
    console.log(total);
    this.allTotal = total;
    this.StringallTotal = total.toFixed(2);
    }
  }

  calcAllTotPrice(product: Product[], pid: number) {

    let storeString: string;
    // tslint:disable-next-line:forin
    const CartProductscheckId = JSON.parse(JSON.stringify(this.pservice.getProductFromCart()));
    const id = this.productAddedTocart.find(p => p.Id === pid).Id;
    // console.log(Object.keys(product)[0]);
    let idFromCart = null;

    // obtain key of an object and values
    const key = Object.keys(product)[pid - 1];
    const val = product[key];
    // works
    idFromCart = val.Id;
    console.log('IDs are: ' + idFromCart + ' ' + id + ' pid: ' + pid + ' val is: ');
    let ff = [];
     // console.log(key); //  'object keys'
    // console.log(val); //  'object values'
    const dd = JSON.parse(JSON.stringify(key));
    ff = JSON.parse(JSON.stringify(key));

//     dd.forEach((item, index) => {
//       console.log(dd[index]); // console.log(item);
// /*
//       if (index === 0 && product[index].Id === item.Id) {
//         idFromCart = item.Id;  console.log(product[index].Id);
//       }*/
//     });

//     Object.keys(val).forEach((item, index) => {
//       console.log(item[index]);
//        // console.log(val[0]); // console.log(item);
// /*
//       if (index === 0 && product[index].Id === item.Id) {
//         idFromCart = item.Id;  console.log(product[index].Id);
//       }*/
//     });

    this.productAddedTocart.forEach((item, index) => {
      // done in ngOnInit
      // total = total + (product[0].Quantity * product[0].UnitPrice);
      // works console.log(item.Id);  console.log(this.productAddedTocart[index].Id);
      // extract object val console.log(this.productAddedTocart[index]);
      // this.ltotal[pid - 1] = item.UnitPrice; console.log(item.UnitPrice);
    });
    // this.ltotal[pid - 1] = 0;
    // tslint:disable-next-line:forin
    for (const i in product) {
      // total = total + (product[0].Quantity * product[0].UnitPrice);
    }
    this.ltotal[idFromCart - 1] = 0;
    this.ltotal[idFromCart - 1] = this.ltotal[idFromCart - 1]
    + (this.productAddedTocart.find(p => p.Id === pid).Quantity * this.productAddedTocart.find(p => p.Id === pid).UnitPrice);
    this.ltotal.splice(idFromCart - 1, 1, this.ltotal[idFromCart - 1]);
    console.log(this.ltotal);
    // insert in specific index using slpice
    // this.ltotal.splice(pid - 1, 1, (this.ltotal[pid - 1]
    //   + (this.productAddedTocart.find(p => p.Id === pid).Quantity * this.productAddedTocart.find(p => p.Id === pid).UnitPrice)));
    // console.log(this.ltotal);
    // console.log(this.ltotal[pid - 1]);
    const res = (String(this.ltotal[idFromCart - 1])).split('.');
    // If there is no decimal point or only one decimal place found.
    if (res.length === 1 || res[1].length < 3) {
    // Set the number to two decimal places
    // console.log(String(this.ltotal[pid - 1].toFixed(2)));
    storeString = String(this.ltotal[idFromCart - 1].toFixed(2));
    this.ltotal[idFromCart - 1] = parseFloat(storeString);
    // console.log(this.ltotal[pid - 1]);
    // this.DisplayPrice = this.ltotal[idFromCart].UnitPrice;
    // this.StoreDisplayPrice = this.ltotal[idFromCart].UnitPrice.toFixed(2);
    }
  }

  GetLoggedinUserDetails() {
    // this.currentUser = this.authService.getRole();
  }

  ConfirmOrder() {
     const date: Date = new Date();
     const id = this.myuser.Id;
     const name = this.myuser.FullName;
     const day = date.getDate();
     const monthIndex = date.getMonth();
     const year = date.getFullYear();
     const minutes = date.getMinutes();
     const hours = date.getHours();
     const seconds = date.getSeconds();
     const dateTimeStamp = day.toString() + monthIndex.toString()
                          + year.toString() + minutes.toString()
                          + hours.toString() + seconds.toString();
     const orderDetail: any = {}; // = {};

     // Orderdetail is object which hold all the value, which needs to be saved into database
     orderDetail.CustomerId = this.myuser.Id;
     orderDetail.CustomerName = this.myuser.FullName;
     orderDetail.DeliveryAddress = this.deliveryForm.controls.DeliveryAddress.value;
     orderDetail.Phone = this.deliveryForm.controls.Phone.value;

     orderDetail.PaymentRefrenceId = id + '-' + name + dateTimeStamp;
     orderDetail.OrderPayMethod = 'Cash On Delivery';

     // Assigning the ordered item details
     this.orderItem = [];
     // tslint:disable-next-line:forin
     for (const i in this.productAddedTocart) {
       this.orderItem.push({
         ID: 0,
         ProductID: this.productAddedTocart[i].Id,
         SellerID: this.productAddedTocart[i].SellerId,
         ProductName: this.productAddedTocart[i].ProductName,
         OrderedQuantity: this.productAddedTocart[i].Quantity,
         PerUnitPrice: this.productAddedTocart[i].UnitPrice,
         OrderID: 0,
       }) ;
    }

       // So now compelte object of order is
     orderDetail.OrderItems = this.orderItem;

     this.orderService.PlaceOrder(orderDetail)
             .subscribe((result) => {
               this.globalResponse = result;
             },
             error => { // This is error part
               console.log(error.message);
               this.alerts.push({
                 id: 2,
                 type: 'danger',
                 message: 'Something went wrong while placing the order, Please try after sometime.'
               });
             },
             () => {
                 //  This is Success part
                 // console.log(this.globalResponse);
                 this.alerts.push({
                   id: 1,
                   type: 'success',
                   message: 'Order has been placed succesfully.',
                 });

                 }
               );

  }
  onRemoveSelected(product: Product) {
    if (this.productAddedTocart.find(p => p.Id === product.Id).Id) {
      // const key = Object.keys(product)[product.Id - 1];
      // const val = product[key];
      // delete all:
      // delete this.productAddedTocart;
      // delete myArray[key];  -- leaves undefined space
      // this.pservice.addProductToCart(this.productAddedTocart);

      /*
      onDelete(id: number) {
    this.service.delete(id).then(() => {
        let index = this.documents.findIndex(d => d.id === id); //find index in your array
        this.documents.splice(index, 1);//remove element from array
    });

    event.stopPropagation();
}
      */
      /*
      syntax:
      0 -- doesn't replace
      1... -- replace how many from start
      elements --- add text e.g "text"
      array.splice(start,number,elements_list)

      var fstarry = ['C', 'Sharp', 'Corner', 'Dot', 'Net', 'Heaven', 'Modeling', 'Corner'];
      var removeelemet = fstarry.splice(2, 1, 'Nitin').toString();
      After add element, Array is -> C,Sharp,Nitin,Dot,Net,Heaven,Modeling,Corner

      var fruits = ["Banana", "Orange", "Apple", "Mango", "Mike"];
      fruits.splice(2, 3, "Lemon", "Kiwi");

      Results: Banana,Orange,Lemon,Kiwi

      const index = myArray.indexOf(key, 0);
      if (index > -1) {
        myArray.splice(index, 1);
      }
      */
     // deleting an array of an object
      const key = Object.keys(this.productAddedTocart)[Number(product.Id)];
      const val = product[key];
      this.productAddedTocart.splice(Number(key), 1);
      this.pservice.addProductToCart(this.productAddedTocart);

      this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
      setTimeout(() => {
        // window.location.reload();
    }, 100);
    }
  }

  // tslint:disable-next-line:align
  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  onChange(product: Product, isChecked: boolean) {
    if (isChecked === true) {
      this.selected[product.Id] = true;
    } else {
      this.selected[product.Id] = false;
    }
  }

  SelectAll() {
    const numOfKeys = Object.keys(this.productAddedTocart).length;

    if (numOfKeys > -1 ) {
      const x = document.getElementById('SelectorDeselect').innerText;
      if (x === 'Select All Items') {
          document.getElementById('SelectorDeselect').innerText  = 'Remove All Selected Items';

          this.selected.forEach((v, i, a) => {
            a[i] = true;
            });
      } else {
          document.getElementById('SelectorDeselect').innerText  = 'Select All Items';

          this.selected.forEach((v, i, a) => {
            a[i] = false;
            });
      }
    }
  }

  RemoveAllSelected() {

    const numOfKeys = Object.keys(this.productAddedTocart).length;
    // this.productAddedTocart = [];
    // this.pservice.addProductToCart(this.productAddedTocart);

    /*this.selected.forEach((v, i, a) => {

      if (a[i] === true) {
      // a[i] = !v
      //this.productAddedTocart.splice(i);
      this.productAddedTocart.splice(i, 1);
      //var key = Object.keys(this.productAddedTocart)[i];
      //delete this.productAddedTocart[key];
      }
    });*/

    for (let i = 0; i <= numOfKeys; i++) {
        if (this.selected[i] === true) {
        const key = Object.keys(this.productAddedTocart)[Number(i)];
        this.productAddedTocart.splice(Number(key), 1);
        this.pservice.addProductToCart(this.productAddedTocart);
        }
    }

    this.pservice.addProductToCart(this.productAddedTocart);

    /*this.productAddedTocart.forEach((item, index) => {
      this.productAddedTocart.splice(Number(index), 1);
      this.pservice.addProductToCart(this.productAddedTocart);
     });
*/

   /* for (let i = 0; i < numOfKeys; i++) {
      this.productAddedTocart.splice(Number(i), 1);
      this.pservice.addProductToCart(this.productAddedTocart);
    }*/

    this.sharedService.currentMessage.subscribe(msg => this.cartItemCount = msg);
  // delete this.productAddedTocart;
  // this.pservice.addProductToCart(this.productAddedTocart);

    this.selected.forEach((v, i, a) => {
    a[i] = false;
    });

    this.calculteAllTotal(this.productAddedTocart);

  }
}
