import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCustomerComponent } from './create-customer/create-customer.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container-fluid modern-container">
      <div class="page-header">
        <h1 class="page-title">
          <i class="bi bi-people me-3"></i>Customer Management
        </h1>
        <p class="page-subtitle">Manage your banking customers efficiently</p>
      </div>
      
      <div class="action-bar">
        <div class="search-container">
          <div class="input-group modern-search">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input 
              type="text" 
              class="form-control" 
              placeholder="Search customers by name, email, or phone..." 
              [(ngModel)]="searchTerm"
            >
            <button class="btn btn-outline-secondary" type="button" *ngIf="searchTerm" (click)="searchTerm = ''">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
        
        <button class="btn btn-primary modern-btn-primary" (click)="openCreateCustomerModal()">
          <i class="bi bi-plus-circle me-2"></i>Add New Customer
        </button>
      </div>
      
      <div class="alert alert-danger modern-alert" *ngIf="errorMessage">
        <i class="bi bi-exclamation-triangle me-2"></i>{{ errorMessage }}
      </div>
      
      <div class="data-card">
        <div class="card-header">
          <h5 class="mb-0">
            <i class="bi bi-table me-2"></i>Customers List
            <span class="badge bg-light text-dark ms-2">{{ filteredCustomers.length }}</span>
          </h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover modern-table mb-0">
              <thead>
                <tr>
                  <th><i class="bi bi-hash me-1"></i>ID</th>
                  <th><i class="bi bi-person me-1"></i>Name</th>
                  <th><i class="bi bi-envelope me-1"></i>Email</th>
                  <th><i class="bi bi-telephone me-1"></i>Phone</th>
                  <th><i class="bi bi-gear me-1"></i>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let customer of filteredCustomers" class="table-row">
                  <td class="fw-semibold">{{ customer.id }}</td>
                  <td>
                    <div class="customer-name">
                      <i class="bi bi-person-circle me-2"></i>{{ customer.name }}
                    </div>
                  </td>
                  <td>{{ customer.email }}</td>
                  <td>{{ customer.phone || 'N/A' }}</td>
                  <td>
                    <div class="action-buttons">
                      <a [routerLink]="['/customers', customer.id]" class="btn btn-sm btn-info me-1" title="View Details">
                        <i class="bi bi-eye"></i>
                      </a>
                      <button class="btn btn-sm btn-warning me-1" (click)="openEditCustomerModal(customer)" title="Edit">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="deleteCustomer(customer.id)" title="Delete">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="filteredCustomers.length === 0">
                  <td colspan="5" class="text-center py-5">
                    <div class="empty-state">
                      <i class="bi bi-inbox display-4 text-muted"></i>
                      <h5 class="mt-3 text-muted">No customers found</h5>
                      <p class="text-muted">Try adjusting your search terms</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modern-container {
      background: linear-gradient(135deg, #F5F5DC 0%, rgba(245, 245, 220, 0.5) 100%);
      min-height: 100vh;
      padding: 2rem 1rem;
    }

    .page-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .page-title {
      color: #654321;
      font-weight: 700;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .page-subtitle {
      color: #8B4513;
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .action-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .search-container {
      flex: 1;
      max-width: 400px;
    }

    .modern-search .input-group-text {
      background: linear-gradient(135deg, #D2B48C 0%, #A0522D 100%);
      color: #FFFFFF;
      border: none;
    }

    .modern-search .form-control {
      border-left: none;
    }

    .modern-btn-primary {
      background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
      border: none;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(139, 69, 19, 0.2);
    }

    .data-card {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 10px 15px -3px rgba(139, 69, 19, 0.1), 0 4px 6px -2px rgba(139, 69, 19, 0.05);
      overflow: hidden;
    }

    .modern-table thead th {
      background: linear-gradient(135deg, #654321 0%, #8B4513 100%);
      color: #F5F5DC;
      font-weight: 600;
      padding: 1.25rem 1rem;
      border: none;
    }

    .table-row {
      transition: all 0.3s ease;
    }

    .table-row:hover {
      background: linear-gradient(135deg, rgba(245, 245, 220, 0.5) 0%, rgba(210, 180, 140, 0.3) 100%);
      transform: scale(1.01);
    }

    .customer-name {
      font-weight: 500;
      color: #654321;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .btn-sm {
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
    }

    .empty-state {
      padding: 3rem;
    }

    .modern-alert {
      border-radius: 12px;
      border: none;
      box-shadow: 0 4px 6px rgba(205, 92, 92, 0.2);
    }

    @media (max-width: 768px) {
      .action-bar {
        flex-direction: column;
        align-items: stretch;
      }
      
      .search-container {
        max-width: none;
      }
      
      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;
  
  constructor(
    private customerService: CustomerService,
    private modalService: NgbModal
  ) {}
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customers';
        console.error(err);
      }
    });
  }
  
  openCreateCustomerModal(): void {
    const modalRef = this.modalService.open(CreateCustomerComponent);
    modalRef.result.then((result) => {
      if (result) {
        this.loadCustomers();
      }
    }, () => {});
  }
  
  openEditCustomerModal(customer: Customer): void {
    // Implement edit customer functionality if needed
    console.log('Edit customer:', customer);
  }
  
  deleteCustomer(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err: any) => {
          this.errorMessage = 'Error deleting customer';
          console.error(err);
        }
      });
    }
  }
  
  get filteredCustomers(): Customer[] {
    if (!this.searchTerm) {
      return this.customers;
    }
    
    const term = this.searchTerm.toLowerCase();
    return this.customers.filter(customer => 
      customer.name.toLowerCase().includes(term) || 
      customer.email.toLowerCase().includes(term) || 
      (customer.phone ? customer.phone.toLowerCase().includes(term) : false)
    );
  }
}
