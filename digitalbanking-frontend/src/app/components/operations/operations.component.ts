import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { BankAccount } from '../../models/account.model';
import { AccountHistory, AccountOperation, OperationType } from '../../models/operation.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-operations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css'
})
export class OperationsComponent implements OnInit {
  accountId: string = '';
  account: BankAccount | null = null;
  accountHistory: AccountHistory | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  
  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['accountId'];
      this.loadAccountDetails();
      this.loadOperations();
    });
  }
  
  loadAccountDetails(): void {
    this.accountService.getAccount(this.accountId).subscribe({
      next: (data) => {
        this.account = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading account details';
        console.error(err);
      }
    });
  }
  
  loadOperations(): void {
    this.isLoading = true;
    this.accountService.getAccountHistory(this.accountId, this.currentPage, this.pageSize).subscribe({
      next: (data) => {
        this.accountHistory = data;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading operations history';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  gotoPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadOperations();
    }
  }
  
  getOperationTypeClass(type: OperationType): string {
    return type === OperationType.CREDIT ? 'text-success' : 'text-danger';
  }
  
  getOperationTypeIcon(type: OperationType): string {
    return type === OperationType.CREDIT ? 'bi-plus-circle' : 'bi-dash-circle';
  }
  
  getOperationTypeText(type: OperationType): string {
    return type === OperationType.CREDIT ? 'Deposit' : 'Withdrawal';
  }
  
  get pagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
