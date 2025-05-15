package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.*;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BalanceNotSufficientException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.BankAccountNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@AllArgsConstructor
@RequestMapping("/api/accounts")
@Tag(name = "Bank Account Management")
public class BankAccountRestController {
    private BankAccountService bankAccountService;
    
    @GetMapping
    @Operation(summary = "Get all bank accounts")
    public List<BankAccountDTO> bankAccounts() {
        return bankAccountService.listBankAccounts();
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get bank account by ID")
    public BankAccountDTO getBankAccount(@PathVariable String id) throws BankAccountNotFoundException {
        return bankAccountService.getBankAccount(id);
    }
    
    @GetMapping("/{id}/operations")
    @Operation(summary = "Get operations for a specific account")
    public List<AccountOperationDTO> getAccountOperations(@PathVariable String id){
        return bankAccountService.accountOperationHistory(id);
    }
    
    @GetMapping("/{id}/pageOperations")
    @Operation(summary = "Get paged operations for a specific account")
    public AccountHistoryDTO getAccountOperations(
            @PathVariable String id,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size) throws BankAccountNotFoundException {
        return bankAccountService.accountHistory(id, page, size);
    }
    
    @PostMapping("/current")
    @Operation(summary = "Create new current account")
    public CurrentAccountDTO createCurrentAccount(
            @RequestParam double initialBalance,
            @RequestParam double overDraft,
            @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(initialBalance, overDraft, customerId);
    }
    
    @PostMapping("/saving")
    @Operation(summary = "Create new saving account")
    public SavingAccountDTO createSavingAccount(
            @RequestParam double initialBalance,
            @RequestParam double interestRate,
            @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(initialBalance, interestRate, customerId);
    }
    
    @PostMapping("/{id}/credit")
    @Operation(summary = "Credit an account")
    public void credit(
            @PathVariable String id,
            @RequestParam double amount,
            @RequestParam String description) throws BankAccountNotFoundException {
        bankAccountService.credit(id, amount, description);
    }
    
    @PostMapping("/{id}/debit")
    @Operation(summary = "Debit an account")
    public void debit(
            @PathVariable String id,
            @RequestParam double amount,
            @RequestParam String description) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.debit(id, amount, description);
    }
    
    @PostMapping("/transfer")
    @Operation(summary = "Transfer money between accounts")
    public void transfer(
            @RequestParam String accountSourceId,
            @RequestParam String accountDestinationId,
            @RequestParam double amount) throws BankAccountNotFoundException, BalanceNotSufficientException {
        bankAccountService.transfer(accountSourceId, accountDestinationId, amount);
    }
}
