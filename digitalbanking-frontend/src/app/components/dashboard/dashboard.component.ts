import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { AccountService } from '../../services/account.service';
import { Customer } from '../../models/customer.model';
import { BankAccount } from '../../models/account.model';
import { AccountOperation } from '../../models/operation.model';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalCustomers: number = 0;
  totalAccounts: number = 0;
  totalBalance: number = 0;
  totalOperations: number = 0;
  
  customers: Customer[] = [];
  accounts: BankAccount[] = [];
  recentActivities: AccountOperation[] = [];
  
  // Chart data
  accountTypesData: any = {
    labels: ['Current Accounts', 'Saving Accounts'],
    datasets: [{
      data: [0, 0],
      backgroundColor: [
        'rgba(139, 69, 19, 0.8)',
        'rgba(160, 82, 45, 0.8)'
      ],
      borderColor: [
        'rgba(139, 69, 19, 1)',
        'rgba(160, 82, 45, 1)'
      ],
      borderWidth: 2
    }]
  };
  
  accountStatusData: any = {
    labels: ['Created', 'Activated', 'Suspended', 'Blocked'],
    datasets: [{
      label: 'Account Status',
      data: [0, 0, 0, 0],
      backgroundColor: [
        'rgba(184, 134, 11, 0.8)',
        'rgba(143, 188, 143, 0.8)',
        'rgba(222, 184, 135, 0.8)',
        'rgba(205, 92, 92, 0.8)'
      ],
      borderColor: [
        'rgba(184, 134, 11, 1)',
        'rgba(143, 188, 143, 1)',
        'rgba(222, 184, 135, 1)',
        'rgba(205, 92, 92, 1)'
      ],
      borderWidth: 2
    }]
  };
  
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#654321',
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    }
  };
  
  errorMessage: string | null = null;
  isLoading: boolean = true;
  
  constructor(
    private customerService: CustomerService,
    private accountService: AccountService
  ) {}
  
  ngOnInit(): void {
    this.loadDashboardData();
  }
  
  loadDashboardData(): void {
    this.isLoading = true;
    
    // Load customers
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
        this.totalCustomers = customers.length;
        this.updateCharts();
      },
      error: (err) => {
        console.error('Error loading customers:', err);
        this.errorMessage = 'Error loading customers data';
      }
    });
    
    // Load accounts
    this.accountService.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.totalAccounts = accounts.length;
        this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
        this.updateCharts();
        this.loadRecentActivities();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.errorMessage = 'Error loading accounts data';
        this.isLoading = false;
      }
    });
  }
  
  loadRecentActivities(): void {
    // For now, create mock data. In a real app, you'd call an API
    this.recentActivities = this.generateMockActivities();
    this.totalOperations = this.recentActivities.length;
  }
  
  generateMockActivities(): AccountOperation[] {
    const activities: AccountOperation[] = [];
    const types = ['CREDIT', 'DEBIT'];
    const descriptions = [
      'ATM Withdrawal',
      'Online Transfer',
      'Salary Deposit',
      'Bill Payment',
      'Purchase',
      'Interest Credit'
    ];
    
    // Generate 10 mock activities
    for (let i = 0; i < 10 && i < this.accounts.length * 2; i++) {
      const account = this.accounts[i % this.accounts.length];
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Math.random() * 1000 + 50;
      
      activities.push({
        id: i + 1,
        operationDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        amount: amount,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        type: type as 'CREDIT' | 'DEBIT',
        bankAccountId: account.id,
        customerName: account.customerDTO.name,
        accountId: account.id
      });
    }
    
    // Sort by operationDate descending
    return activities.sort((a, b) => new Date(b.operationDate).getTime() - new Date(a.operationDate).getTime());
  }
  
  updateCharts(): void {
    if (this.accounts.length > 0) {
      // Update account types chart
      const currentCount = this.accounts.filter(a => a.type === 'CurrentAccount').length;
      const savingCount = this.accounts.filter(a => a.type === 'SavingAccount').length;
      
      this.accountTypesData = {
        ...this.accountTypesData,
        datasets: [{
          ...this.accountTypesData.datasets[0],
          data: [currentCount, savingCount]
        }]
      };
      
      // Update account status chart
      const statusCounts = {
        CREATED: this.accounts.filter(a => a.status === 'CREATED').length,
        ACTIVATED: this.accounts.filter(a => a.status === 'ACTIVATED').length,
        SUSPENDED: this.accounts.filter(a => a.status === 'SUSPENDED').length,
        BLOCKED: this.accounts.filter(a => a.status === 'BLOCKED').length
      };
      
      this.accountStatusData = {
        ...this.accountStatusData,
        datasets: [{
          ...this.accountStatusData.datasets[0],
          data: [statusCounts.CREATED, statusCounts.ACTIVATED, statusCounts.SUSPENDED, statusCounts.BLOCKED]
        }]
      };
    }
  }
  
  getOperationTypeClass(type: string): string {
    switch (type) {
      case 'CREDIT':
        return 'bg-success';
      case 'DEBIT':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}
