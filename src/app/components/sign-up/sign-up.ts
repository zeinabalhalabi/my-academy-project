import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidationErrors, AbstractControl} from '@angular/forms';
import { AuthService } from '../../core/auth/auth-service';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  imports: [ReactiveFormsModule, RouterLink],
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
      confirmPassword: ['', [Validators.required]]
    },
  { validators: this.passwordMatchValidator

  });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
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

          if(err.status === 409 || err.error?.message?.toLowerCase().includes('email')){
            this.signUpForm.get('email')?.setErrors({ emailInUse: true});
          }
          else {
            alert('Registration failed. Please try again later.')
          }
        }
      })
    }
    else {
      console.log('Form is invalid');
    }
  }
}
  
