import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../../services/account.service';
import { BankAccount } from '../../../models/account.model';

@Component({
  selector: 'app-transfer-operation',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="modal-header bg-primary text-white">
      <h4 class="modal-title">Transfer Money</h4>
      <button type="button" class="btn-close btn-close-white" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form [formGroup]="transferForm">
        <div class="mb-3">
          <label for="sourceAccountId" class="form-label">From Account</label>
          <select 
            id="sourceAccountId" 
            class="form-select" 
            formControlName="sourceAccountId"
          >
            <option value="">-- Select source account --</option>
            <option *ngFor="let account of accounts" [value]="account.id">
              {{ account.id }} - {{ account.type }} (Balance: {{ account.balance | currency }})
            </option>
          </select>
          <div *ngIf="transferForm.get('sourceAccountId')?.invalid && transferForm.get('sourceAccountId')?.touched" class="text-danger">
            <small *ngIf="transferForm.get('sourceAccountId')?.errors?.['required']">Source account is required</small>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="destinationAccountId" class="form-label">To Account</label>
          <select 
            id="destinationAccountId" 
            class="form-select" 
            formControlName="destinationAccountId"
          >
            <option value="">-- Select destination account --</option>
            <option *ngFor="let account of accounts" [value]="account.id">
              {{ account.id }} - {{ account.type }} (Balance: {{ account.balance | currency }})
            </option>
          </select>
          <div *ngIf="transferForm.get('destinationAccountId')?.invalid && transferForm.get('destinationAccountId')?.touched" class="text-danger">
            <small *ngIf="transferForm.get('destinationAccountId')?.errors?.['required']">Destination account is required</small>
          </div>
          <div *ngIf="transferForm.errors?.['sameAccount']" class="text-danger">
            <small>Source and destination accounts cannot be the same</small>
          </div>
        </div>
        
        <div class="mb-3">
          <label for="amount" class="form-label">Amount</label>
          <div class="input-group">
            <span class="input-group-text">$</span>
            <input 
              type="number" 
              id="amount" 
              class="form-control" 
              formControlName="amount" 
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
            >
          </div>
          <div *ngIf="transferForm.get('amount')?.invalid && transferForm.get('amount')?.touched" class="text-danger">
            <small *ngIf="transferForm.get('amount')?.errors?.['required']">Amount is required</small>
            <small *ngIf="transferForm.get('amount')?.errors?.['min']">Amount must be positive</small>
          </div>
        </div>
      </form>
      
      <div *ngIf="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" [disabled]="transferForm.invalid || isSubmitting" (click)="submitTransfer()">
        <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Transfer
      </button>
    </div>
  `
})
export class TransferOperationComponent implements OnInit {
  @Input() accounts: BankAccount[] = [];
  
  transferForm: FormGroup;
  errorMessage: string | null = null;
  isSubmitting: boolean = false;
  
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private accountService: AccountService
  ) {
    this.transferForm = this.formBuilder.group({
      sourceAccountId: ['', Validators.required],
      destinationAccountId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    }, { validators: this.sameAccountValidator });
  }
  
  ngOnInit(): void {}
  
  sameAccountValidator(group: FormGroup) {
    const sourceAccountId = group.get('sourceAccountId')?.value;
    const destinationAccountId = group.get('destinationAccountId')?.value;
    
    if (sourceAccountId && destinationAccountId && sourceAccountId === destinationAccountId) {
      return { sameAccount: true };
    }
    
    return null;
  }
  
  submitTransfer(): void {
    if (this.transferForm.invalid) return;
    
    this.isSubmitting = true;
    this.errorMessage = null;
    
    const sourceAccountId = this.transferForm.get('sourceAccountId')?.value;
    const destinationAccountId = this.transferForm.get('destinationAccountId')?.value;
    const amount = this.transferForm.get('amount')?.value;
    
    this.accountService.transfer(sourceAccountId, destinationAccountId, amount).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.activeModal.close(true);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred while processing your transfer. Please check your balance.';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }
}
