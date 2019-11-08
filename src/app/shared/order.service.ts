import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, pipe} from 'rxjs';
import { map, filter, catchError, mergeMap, shareReplay } from 'rxjs/operators';
import { OrderDetail } from '../interfaces/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public apiURL = 'http://localhost:54277/api/OrderDetails';
  constructor(private http: HttpClient) { }

  PlaceOrder(orderDetail: OrderDetail) {
    return this.http.post(this.apiURL, orderDetail);
    /*var reqHeader = new HttpHeaders({ 'Authorization':'Bearer '+ this.authService.getToken()});
        reqHeader.append('Content-Type', 'application/json');

    return this.httpClient.post(this.apiURL, orderDetail,{ headers: reqHeader })
    .pipe(
      map(res => res),
       catchError( this.errorHandler)
      );*/
  }

  /*errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
}*/
}
