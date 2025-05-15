package ma.digitbank.jeespringangularjwtdigitalbanking.web;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.BankAccountDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.dtos.CustomerDTO;
import ma.digitbank.jeespringangularjwtdigitalbanking.exceptions.CustomerNotFoundException;
import ma.digitbank.jeespringangularjwtdigitalbanking.services.BankAccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
@RequestMapping("/api/customers")
@Tag(name = "Customer Management")
@CrossOrigin("*")
public class CustomerRestController {
    private BankAccountService bankAccountService;
    
    @GetMapping
    @Operation(summary = "Get all customers")
    public List<CustomerDTO> customers() {
        return bankAccountService.listCustomers();
    }
    
    @GetMapping("/search")
    @Operation(summary = "Search customers by keyword")
    public List<CustomerDTO> searchCustomers(@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        return bankAccountService.searchCustomers(keyword);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get customer by ID")
    public CustomerDTO getCustomer(@PathVariable(name = "id") Long customerId) throws CustomerNotFoundException {
        return bankAccountService.getCustomer(customerId);
    }
    
    @GetMapping("/{id}/accounts")
    @Operation(summary = "Get customer accounts by customer ID")
    public List<BankAccountDTO> getCustomerAccounts(@PathVariable(name = "id") Long customerId) {
        return bankAccountService.getCustomerAccounts(customerId);
    }
    
    @PostMapping
    @Operation(summary = "Save new customer")
    public CustomerDTO saveCustomer(@RequestBody CustomerDTO customerDTO) {
        return bankAccountService.saveCustomer(customerDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update customer")
    public CustomerDTO updateCustomer(@PathVariable Long id, @RequestBody CustomerDTO customerDTO) {
        customerDTO.setId(id);
        return bankAccountService.updateCustomer(customerDTO);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete customer by ID")
    public void deleteCustomer(@PathVariable Long id) {
        bankAccountService.deleteCustomer(id);
    }
}
