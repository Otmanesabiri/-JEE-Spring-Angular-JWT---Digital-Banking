package ma.digitbank.jeespringangularjwtdigitalbanking.dtos;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class CurrentAccountDTO extends BankAccountDTO {
    private double overDraft;
}
