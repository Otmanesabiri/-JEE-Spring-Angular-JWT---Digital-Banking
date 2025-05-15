import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BankAccount, CurrentAccount, SavingAccount } from '../../models/account.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditOperationComponent } from '../operations/credit-operation/credit-operation.component';
import { DebitOperationComponent } from '../operations/debit-operation/debit-operation.component';

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, DatePipe],
  templateUrl: './account-details.component.html',
  styleUrl: './account-details.component.css'
})
export class AccountDetailsComponent implements OnInit {
  accountId: string = '';
  account: BankAccount | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['id'];
      this.loadAccountDetails();
    });
  }

  loadAccountDetails(): void {
    this.isLoading = true;
    this.accountService.getAccount(this.accountId).subscribe({
      next: (data) => {
        this.account = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading account details';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'CREATED': return 'bg-info';
      case 'ACTIVATED': return 'bg-success';
      case 'SUSPENDED': return 'bg-warning';
      case 'BLOCKED': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  getAccountType(): string {
    if (!this.account) return '';
    
    if (this.account.type === 'CurrentAccount') {
      return 'Current Account';
    } else {
      return 'Saving Account';
    }
  }

  getSpecificAccountDetails(): string {
    if (!this.account) return '';
    
    if (this.account.type === 'CurrentAccount') {
      return `Overdraft: $${(this.account as CurrentAccount).overDraft}`;
    } else {
      return `Interest Rate: ${(this.account as SavingAccount).interestRate}%`;
    }
  }

  openDebitModal(): void {
    if (!this.account) return;
    
    const modalRef = this.modalService.open(DebitOperationComponent);
    modalRef.componentInstance.accountId = this.account.id;
    modalRef.result.then((result) => {
      if (result) {
        this.loadAccountDetails();
      }
    }, () => {});
  }

  openCreditModal(): void {
    if (!this.account) return;
    
    const modalRef = this.modalService.open(CreditOperationComponent);
    modalRef.componentInstance.accountId = this.account.id;
    modalRef.result.then((result) => {
      if (result) {
        this.loadAccountDetails();
      }
    }, () => {});
  }
}
