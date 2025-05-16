import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-create-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Create New Customer</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="customerForm">
        <div class="mb-3">
          <label for="customerName" class="form-label">Full Name</label>
          <input 
            type="text" 
            class="form-control" 
            id="customerName" 
            name="customerName" 
            formControlName="name" 
            placeholder="Enter full name"
          >
          <div *ngIf="customerForm.get('name')?.invalid && customerForm.get('name')?.touched" class="text-danger">
            <small *ngIf="customerForm.get('name')?.errors?.['required']">Name is required</small>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="customerEmail" class="form-label">Email</label>
          <input 
            type="email" 
            class="form-control" 
            id="customerEmail" 
            name="customerEmail" 
            formControlName="email" 
            placeholder="Enter email address"
          >
          <div *ngIf="customerForm.get('email')?.invalid && customerForm.get('email')?.touched" class="text-danger">
            <small *ngIf="customerForm.get('email')?.errors?.['required']">Email is required</small>
            <small *ngIf="customerForm.get('email')?.errors?.['email']">Please enter a valid email</small>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="customerPhone" class="form-label">Phone Number</label>
          <input 
            type="tel" 
            class="form-control" 
            id="customerPhone" 
            name="customerPhone" 
            formControlName="phone" 
            placeholder="Enter phone number"
          >
          <div *ngIf="customerForm.get('phone')?.invalid && customerForm.get('phone')?.touched" class="text-danger">
            <small *ngIf="customerForm.get('phone')?.errors?.['required']">Phone number is required</small>
          </div>
        </div>
      </form>
      
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="customerForm.invalid || isSubmitting" (click)="saveCustomer()">
        <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Save Customer
      </button>
    </div>
  `
})
export class CreateCustomerComponent {
  customerForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private customerService: CustomerService
  ) {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }
  
  saveCustomer(): void {
    if (this.customerForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    this.customerService.createCustomer(this.customerForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.activeModal.close(true);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred while creating the customer.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
