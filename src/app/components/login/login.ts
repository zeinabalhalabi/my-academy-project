import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../core/auth/auth-service';
import { RouterLink, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm: FormGroup;
  errorMessage: string | null = null;
    
    constructor(
      private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router
    ){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    }); 
  } 
    
  onSubmit(){
    this.errorMessage = null;
    if (this.loginForm.valid){
      const {email, password} = this.loginForm.value;
      this.authService.authentication(email, password).subscribe({
        next: (token) => {
          console.log ('Login successful, token:', token);
          this.router.navigate(['/home']);
      },
    error: (err) => {
      console.error('Login failed', err);
      this.errorMessage = 'Invalid email or password.';
    }
    });  
  } else {
    console.log('Form is invalid');
  }
}

}
