import { Customer } from './customer.model';

export enum AccountStatus {
    CREATED = 'CREATED',
    ACTIVATED = 'ACTIVATED',
    SUSPENDED = 'SUSPENDED',
    BLOCKED = 'BLOCKED'
}

export interface BankAccount {
    id: string;
    balance: number;
    createdAt: Date;
    status: AccountStatus;
    customerDTO: Customer;
    type: string;
}

export interface CurrentAccount extends BankAccount {
    overDraft: number;
}

export interface SavingAccount extends BankAccount {
    interestRate: number;
}
