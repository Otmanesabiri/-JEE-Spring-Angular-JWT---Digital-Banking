export enum OperationType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
}

export interface AccountOperation {
  id: number;
  operationDate: Date;
  amount: number;
  description: string;
  type: 'CREDIT' | 'DEBIT';
  bankAccountId: string;
  customerName?: string;
  accountId?: string;
}

export interface AccountHistory {
  accountId: string;
  balance: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  accountOperationDTOS: AccountOperation[];
}
