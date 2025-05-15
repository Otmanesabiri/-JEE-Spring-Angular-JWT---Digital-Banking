import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  searchTerm: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;
  
  constructor(private customerService: CustomerService) {}
  
  ngOnInit(): void {
    this.loadCustomers();
  }
  
  loadCustomers(): void {
    this.isLoading = true;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error loading customers';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  searchCustomers(): void {
    if (!this.searchTerm.trim()) {
      this.loadCustomers();
      return;
    }
    
    this.isLoading = true;
    this.customerService.searchCustomers(this.searchTerm).subscribe({
      next: (data) => {
        this.customers = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Error searching customers';
        console.error(err);
        this.isLoading = false;
      }
    });
  }
  
  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          this.loadCustomers();
        },
        error: (err) => {
          this.errorMessage = 'Error deleting customer';
          console.error(err);
        }
      });
    }
  }
}
