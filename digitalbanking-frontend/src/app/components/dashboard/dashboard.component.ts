import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { BankAccount } from '../../models/account.model';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Dashboard</h1>
      
      <div class="row">
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card bg-primary text-white h-100">
            <div class="card-body">
              <h5 class="card-title">Customers</h5>
              <p class="card-text display-4">{{ customers.length }}</p>
              <a routerLink="/customers" class="btn btn-light mt-auto">View Customers</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card bg-success text-white h-100">
            <div class="card-body">
              <h5 class="card-title">Accounts</h5>
              <p class="card-text display-4">{{ accounts.length }}</p>
              <a routerLink="/accounts" class="btn btn-light mt-auto">View Accounts</a>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card bg-info text-white h-100">
            <div class="card-body">
              <h5 class="card-title">Current Accounts</h5>
              <p class="card-text display-4">{{ currentAccountsCount }}</p>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-lg-3 mb-4">
          <div class="card bg-warning text-white h-100">
            <div class="card-body">
              <h5 class="card-title">Saving Accounts</h5>
              <p class="card-text display-4">{{ savingAccountsCount }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Recent Customers</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li *ngFor="let customer of customers.slice(0, 5)" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ customer.name }}
                  <a [routerLink]="['/customers', customer.id]" class="btn btn-sm btn-outline-primary">Details</a>
                </li>
                <li *ngIf="customers.length === 0" class="list-group-item text-center">
                  No customers found
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 mb-4">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Recent Accounts</h5>
            </div>
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li *ngFor="let account of accounts.slice(0, 5)" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ account.id }} ({{ account.type === 'CurrentAccount' ? 'Current' : 'Saving' }})
                  <a [routerLink]="['/accounts', account.id]" class="btn btn-sm btn-outline-primary">Details</a>
                </li>
                <li *ngIf="accounts.length === 0" class="list-group-item text-center">
                  No accounts found
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  accounts: BankAccount[] = [];
  customers: Customer[] = [];
  
  constructor(
    private accountService: AccountService,
    private customerService: CustomerService
  ) {}
  
  ngOnInit(): void {
    this.loadAccounts();
    this.loadCustomers();
  }
  
  loadAccounts(): void {
    this.accountService.getAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
      },
      error: (err) => console.error('Error loading accounts', err)
    });
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => console.error('Error loading customers', err)
    });
  }
  
  get currentAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'CurrentAccount').length;
  }
  
  get savingAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'SavingAccount').length;
  }
}
