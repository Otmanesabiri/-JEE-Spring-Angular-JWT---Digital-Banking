import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { CustomerService } from '../../services/customer.service';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { BankAccount } from '../../models/account.model';
import { Customer } from '../../models/customer.model';
import { Chart, registerables } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accounts: BankAccount[] = [];
  customers: Customer[] = [];
  stats: any = {};
  userStats: any = {};
  isLoading = true;
  isAdmin = false;
  errorMessage: string | null = null;

  constructor(
    private accountService: AccountService,
    private customerService: CustomerService,
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadCustomers();

    this.isAdmin = this.authService.isAdmin();
    
    if (this.isAdmin) {
      this.loadAdminDashboard();
    } else {
      this.loadUserDashboard();
    }
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
  
  loadAdminDashboard(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
        
        // Load chart data after stats
        this.loadAccountTypeChart();
      },
      error: (err) => {
        this.errorMessage = 'Error loading dashboard statistics';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadUserDashboard(): void {
    this.dashboardService.getUserStatistics().subscribe({
      next: (data) => {
        this.userStats = data;
        this.isLoading = false;
        
        // Load user specific charts
        this.loadUserOperationChart();
      },
      error: (err) => {
        this.errorMessage = 'Error loading user statistics';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  loadOperationCharts(): void {
    this.dashboardService.getMonthlyOperationStats().subscribe({
      next: (data) => {
        const months = data.map((item: any) => item.month);
        const creditOps = data.map((item: any) => item.creditOperations);
        const debitOps = data.map((item: any) => item.debitOperations);
        
        const ctx = document.getElementById('operationsChart') as HTMLCanvasElement;
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Credit Operations',
                data: creditOps,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                tension: 0.1
              },
              {
                label: 'Debit Operations',
                data: debitOps,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                tension: 0.1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    });
  }

  loadAccountTypeChart(): void {
    const ctx = document.getElementById('accountTypesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Current Accounts', 'Saving Accounts'],
        datasets: [{
          data: [this.stats.currentAccounts, this.stats.savingAccounts],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true
      }
    });
  }

  loadUserOperationChart(): void {
    if (!this.userStats.operationsByType) return;
    
    const operationTypes = Object.keys(this.userStats.operationsByType);
    const operationCounts = Object.values(this.userStats.operationsByType);
    
    const ctx = document.getElementById('userOperationsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: operationTypes,
        datasets: [{
          label: 'Operations Performed',
          data: operationCounts,
          backgroundColor: [
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  get currentAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'CurrentAccount').length;
  }
  
  get savingAccountsCount(): number {
    return this.accounts.filter(a => a.type === 'SavingAccount').length;
  }
}
