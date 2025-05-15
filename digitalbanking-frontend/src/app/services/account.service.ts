import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BankAccount, CurrentAccount, SavingAccount } from '../models/account.model';
import { AccountHistory, AccountOperation } from '../models/operation.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/accounts`;

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getAccount(id: string): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  getAccountOperations(id: string): Observable<AccountOperation[]> {
    return this.http.get<AccountOperation[]>(`${this.apiUrl}/${id}/operations`);
  }

  getAccountHistory(id: string, page: number = 0, size: number = 5): Observable<AccountHistory> {
    return this.http.get<AccountHistory>(`${this.apiUrl}/${id}/pageOperations?page=${page}&size=${size}`);
  }

  saveCurrentAccount(initialBalance: number, overDraft: number, customerId: number): Observable<CurrentAccount> {
    return this.http.post<CurrentAccount>(
      `${this.apiUrl}/current?initialBalance=${initialBalance}&overDraft=${overDraft}&customerId=${customerId}`, 
      {}
    );
  }

  saveSavingAccount(initialBalance: number, interestRate: number, customerId: number): Observable<SavingAccount> {
    return this.http.post<SavingAccount>(
      `${this.apiUrl}/saving?initialBalance=${initialBalance}&interestRate=${interestRate}&customerId=${customerId}`, 
      {}
    );
  }

  debit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${accountId}/debit?amount=${amount}&description=${description}`, 
      {}
    );
  }

  credit(accountId: string, amount: number, description: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/${accountId}/credit?amount=${amount}&description=${description}`, 
      {}
    );
  }

  transfer(sourceAccountId: string, destinationAccountId: string, amount: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/transfer?accountSourceId=${sourceAccountId}&accountDestinationId=${destinationAccountId}&amount=${amount}`, 
      {}
    );
  }
}
