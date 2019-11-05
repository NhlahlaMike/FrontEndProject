import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Registration } from '../interfaces/registration';
import { flatMap, first, shareReplay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router, private fb: FormBuilder, private http: HttpClient) { }
  readonly BaseURI = 'http://localhost:54277/api';
  private	user$: Observable<Registration[]>;
  // subject type multicast the value among components
    // User related properties
    private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
    private UserName    = new BehaviorSubject<string>(localStorage.getItem('username'));
    // private UserRole    = new BehaviorSubject<string>(localStorage.getItem('userRole'));

    registrationInputs: Registration[];
  // user properties
  formModel = this.fb.group({
    UserName: ['', Validators.required],
    Email: ['', Validators.compose([Validators.required, Validators.email])],
    FullName: ['', Validators.required],
    Passwords: this.fb.group({
      Password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      ConfirmPassword: ['', Validators.required]
    }, { validator: this.comparePasswords })

  });
  // this.loginstatus = false;
  comparePasswords(fb: FormGroup) {
    const confirmPswrdCtrl = fb.get('ConfirmPassword');
    // passwordMismatch
    // confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      if (fb.get('Password').value !== confirmPswrdCtrl.value) {
        confirmPswrdCtrl.setErrors({ passwordMismatch: true });
      } else {
        confirmPswrdCtrl.setErrors(null);
      }
    }
  }

  register() {
    this.registrationInputs = this.formModel.value;
    const body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURI + '/ApplicationUser/Register', body);
  }

  login(formData) {

    return this.http.post<any>(this.BaseURI + '/ApplicationUser/Login', formData).pipe(

      map(result => {

          // login successful if there's a jwt token in the response
          if (result && result.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
              this.loginStatus.next(true);
              localStorage.setItem('loginStatus', '1');
              localStorage.setItem('token', result.token);
              localStorage.setItem('username', result.username);
              this.UserName.next(localStorage.getItem('username'));
          }

          return result;
          // console.log('my result' + result);
          })

      );
  }

  getUserProfile() {
    return this.http.get(this.BaseURI + '/UserProfile');
  }
    getUsers(): Observable<Registration[]> {
    if (!this.user$) {
      this.user$ = this.http.get < Registration[] > (this.BaseURI + '/UserProfile').pipe(shareReplay());
    }
    return this.user$;
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

  checkLoginStatus(): boolean {

    const loginCookie = localStorage.getItem('loginStatus');

    if (loginCookie === '1') {
      if (localStorage.getItem('token') === null || localStorage.getItem('token') === undefined) {
          return false;
      }

       // Get and Decode the Token
      const token = localStorage.getItem('token');
      const decoded = jwt_decode(token);
      // Check if the cookie is valid

      if (decoded.exp === undefined) {
          return false;
      }

      // Get Current Date Time
      const date = new Date(0);

       // Convert EXp Time to UTC
      const tokenExpDate = date.setUTCSeconds(decoded.exp);

      // If Value of Token time greter than

      if (tokenExpDate.valueOf() > new Date().valueOf()) {
          return true;
      }

      console.log('NEW DATE ' + new Date().valueOf());
      console.log('Token DATE ' + tokenExpDate.valueOf());

      return false;
    }

    return false;
  }

  logout() {
    this.loginStatus.next(false);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.setItem('loginStatus', '0');
    this.router.navigate(['/home']);
    location.reload();
    console.log('Logged Out Successfully');
  }

  get isLoggesIn() {
      return this.loginStatus.asObservable();
  }

  get currentUserName() {
      return this.UserName.asObservable();
  }

}
