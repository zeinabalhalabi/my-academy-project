import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart-service';
import { AuthService } from '../../core/auth/auth-service';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

  private fb = inject(FormBuilder);
  private router = inject(Router);

  cartService = inject(CartService);
  authService = inject(AuthService);

  // Reactive checkout form
  readonly checkoutForm = this.fb.nonNullable.group({
    country: ['Lebanon', Validators.required],
    address: ['', [Validators.required, Validators.minLength(5)]],
    city: ['', Validators.required],
    postalCode: ['', Validators.required],

    cardNumber: ['',[Validators.required, Validators.pattern(/^[0-9 ]{13,19}$/)]],
    expiration: ['',[Validators.required,Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
    cvc: ['',[Validators.required,Validators.pattern(/^[0-9]{3,4}$/)]],
    cardholderName: ['',[Validators.required,Validators.minLength(2)]]
  });

  /**
   * Returns the number of items currently in the cart.
   */
  get cartItemCount(): number {
    return this.cartService.cartItems()
      .reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Checks if the checkout form field has an error
   * and the user has interacted with it.
   */
  isInvalid(controlName: string): boolean {
    const control = this.checkoutForm.get(controlName);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  /**
   * Returns a useful validation message for a form field.
   */
  getErrorMessage(controlName: string): string {
    const control = this.checkoutForm.get(controlName);

    if (!control || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['minlength']) {
      return 'Please enter a valid value.';
    }

    if (control.errors['pattern']) {
      switch (controlName) {
        case 'cardNumber':
          return 'Enter a valid card number.';
        case 'expiration':
          return 'Use MM/YY format.';
        case 'cvc':
          return 'Enter a valid security code.';
        default:
          return 'Please enter a valid value.';
      }
    }

    return 'Please enter a valid value.';
  }

  /**
   * Places the order after validating the form.
   */
  placeOrder(): void {

    // Prevent checkout with an empty cart
    if (this.cartService.cartItems().length === 0) {
      alert('Your cart is empty. Please add products before checking out.');
      this.router.navigate(['/cart']);
      return;
    }

    // Validate the checkout form
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    // In a real application, this is where you would
    // send the order to your backend API.
    const order = {
      user: this.authService.currentUser,
      items: this.cartService.cartItems(),
      shipping: {
        country: this.checkoutForm.controls.country.value,
        address: this.checkoutForm.controls.address.value,
        city: this.checkoutForm.controls.city.value,
        postalCode: this.checkoutForm.controls.postalCode.value
      },
      payment: {
        cardNumber: this.checkoutForm.controls.cardNumber.value,
        expiration: this.checkoutForm.controls.expiration.value,
        cvc: this.checkoutForm.controls.cvc.value,
        cardholderName: this.checkoutForm.controls.cardholderName.value
      },
      subtotal: this.cartService.subtotal(),
      total: this.cartService.grandTotal()
    };

    console.log('Order:', order);

    alert('Order placed successfully! Thank you for shopping with ELÉGANCE.');

    // Clear the cart
    this.cartService.cartItems.set([]);

    // Navigate to home
    this.router.navigate(['/']);
  }

  /**
   * Returns to the cart page.
   */
  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}

