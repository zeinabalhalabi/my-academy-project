import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../core/auth/auth-service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
    
    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService
    ){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    }); 
  } 
    
  onSubmit(){
    if (this.loginForm.valid){
      const {email, password} = this.loginForm.value;
      this.authService.authentication(email, password).subscribe({
        next: (token) => {
          console.log ('Login successful, token:', token);
      },
    error: (err) => {
      console.error('Login failed', err);
    }
    });  
  } else {
    console.log('Form is invalid');
  }
}
}
