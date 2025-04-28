package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import ma.digitbank.jeespringangularjwtdigitalbanking.enums.OperationType;

import java.util.Date;

@Data
public class AccountOperationDTO {
    private Long id;
    private Date operationDate;
    private double amount;
    private String description;
    private OperationType type;
    private String bankAccountId;
}
