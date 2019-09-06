import { ToastrService } from 'ngx-toastr';
import { UserService } from './../../shared/user.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName: '',
    Password: ''
  };

  returnUrl: string;
  ErrorMessage: string;
  invalidLogin: boolean;

  constructor(private fb: FormBuilder, private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/home');
    }
  }

  onSubmit(form: NgForm) {
    this.service.login(form.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigateByUrl('/home');
        this.invalidLogin = false;
      },
      err => {
        if (err.status === 400) {
          this.toastr.error('Incorrect username or password.', 'Authentication failed.');
          this.invalidLogin = true;
          this.ErrorMessage = err.err.loginError;
          console.log(this.ErrorMessage);
        } else {
          console.log(err);
        }
      }
    );
  }

}
