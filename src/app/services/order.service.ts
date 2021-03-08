import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ArrayHelper } from '../helpers/array.helper';
import { ConfigHelper } from '../helpers/config.helper';
import { HttpResult } from '../models/http-result.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private url: string = environment.apiUrl;

  private currentOrderSubject: BehaviorSubject<any>;

  public currentOrder: Observable<any>;

  constructor(
    private http: HttpClient
  ) {
    this.prepareCurrentOrder();
  }

  private get companyId() {
    const company = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentCompany));
    return company.id;
  }

  public getCurrentOrder() {
    return this.currentOrderSubject.value;
  }

  public getAll() {
    return this.http.get<HttpResult>(`${this.url}/company/${this.companyId}/order`);
  }

  public create(data: any) {
    return this.http.post<HttpResult>(`${this.url}/company/${this.companyId}/order`, data);
  }

  public addProductCurrentOrder(product: any) {
    const order = this.currentOrderSubject.value;
    order.products.push(product);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public updateProductCurrentOrder(index: number, product: any) {
    const order = this.currentOrderSubject.value;
    order.products[index] = product;
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public removeProductCurrentOrder(index: any) {
    const order = this.currentOrderSubject.value;
    order.products = ArrayHelper.removeItem(order.products, index);
    localStorage.setItem(ConfigHelper.Storage.CurrentOrder, JSON.stringify(order));
    this.currentOrderSubject.next(order);
  }

  public removeAllProductsCurrentOrder() {
    const order = this.currentOrderSubject.value;
    order.products = [];
    localStorage.removeItem(ConfigHelper.Storage.CurrentOrder);
    this.currentOrderSubject.next(order);
  }

  private prepareCurrentOrder() {
    const currentOrder = JSON.parse(localStorage.getItem(ConfigHelper.Storage.CurrentOrder));
    if (currentOrder == null) {
      this.currentOrderSubject = new BehaviorSubject<any>({
        products: []
      });
      this.currentOrder = this.currentOrderSubject.asObservable();
    }
    else {
      this.currentOrderSubject = new BehaviorSubject<any>(currentOrder);
      this.currentOrder = this.currentOrderSubject.asObservable();
    }
  }

}
