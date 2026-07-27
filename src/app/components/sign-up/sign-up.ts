import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from '../../core/auth/auth-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  standalone: true
})
export class SignUp {
  signUpForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
    ){
    this.signUpForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit(){
    if (this.signUpForm.valid){
      const formData = this.signUpForm.value;
      console.log("Form Data: ", formData);
      this.authService.register(formData).subscribe({
        next: (response) => {
          console.log('Signup successful', response);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Signup failed', err);
        }
      })
    }
    else {
      console.log('Form is invalid');
    }
  }
}
  
