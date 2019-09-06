import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {

  constructor(private uservice: UserService) { }

  LoginStatus$: Observable<boolean>;

  UserName$: Observable<string>;


  ngOnInit() {

      this.LoginStatus$ = this.uservice.isLoggesIn;

      this.UserName$ = this.uservice.currentUserName;
}

  onLogout() {

     this.uservice.logout();
  }

}
