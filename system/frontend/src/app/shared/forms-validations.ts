import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from "@angular/forms"

export class FormValidations{

  static requiredMinCheckbox(min = 1){
    const validator: ValidatorFn  = (formArray: AbstractControl) => {
      if(formArray instanceof FormArray){
        const totalChecked = formArray.controls
        .map((v: any) => v.value)
        .reduce((total: any, current: any) => current ? total + current : total, 0)

        return totalChecked >= min ? null : { requiredMinCheckbox: min }
      }
      throw new Error('formArray não é uma instância de FormArray')
    }

    return validator
  }

  static cepValidatior(control: FormControl){
    const cep = control.value

    if(cep && cep !== ''){
      const validacep = /^[0-9]{5}-?[0-9]{3}$/

      return validacep.test(cep) ? null : { cepInvalido: true }
    }

    return null
  }

  static telMinLength(control: FormControl){
    let tel = control.value

    if(tel){
      return tel.length < 14 ? { telMinLength: true } : null
    }

    return null
  }

  static telMaxLength(control: FormControl){
    let tel = control.value

    if(tel){
      return tel.length > 15 ? { telMaxLength: true } : null
    }

    return null
  }

  static minCpfCnpj(control: FormControl){
    let valor = control.value

    if (valor.length !== 14 && valor.length !== 18) {
      return { minCpfCnpj: true };
    }

    return null
  }

  static cpfValidator(control: FormControl) {
    const cpf = control.value;

    if (cpf && cpf !== '') {
      // Remove qualquer caractere não numérico do CPF
      const cpfLimpo = cpf.replace(/\D/g, '');

      // Verifica se o CPF tem 11 dígitos
      if (cpfLimpo.length !== 11) {
        return { cpfInvalido: true };
      }

      // Verifica se todos os dígitos são iguais (caso especial)
      if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return { cpfInvalido: true };
      }

      // Calcula o primeiro dígito verificador
      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

      // Calcula o segundo dígito verificador
      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

      // Verifica se os dígitos verificadores estão corretos
      if (
        digitoVerificador1 !== parseInt(cpfLimpo.charAt(9)) ||
        digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))
      ) {
        return { cpfInvalido: true };
      }

      // CPF válido
      return null;
    }

    // Se o campo estiver vazio, considera válido (ou pode mudar para { cpfRequired: true } se for necessário)
    return null;
  }

  static equalsTo(otherField: string){
    const validator: ValidatorFn  = (formControl: AbstractControl) => {
      if(formControl instanceof FormControl){
        if(otherField == null){
          throw new Error('É necessário informar um campo.')
        }

        if(!formControl.root || !(<FormGroup>formControl.root).controls){
          return null
        }

        const field = (<FormGroup>formControl.root).get(otherField)

        if(!field){
          throw new Error('É necessário informar um campo.')
        }

        if(field.value !== formControl.value){
          return { equalsTo: otherField }
        }

        return null
      }
      throw new Error('formControl não é uma instância de FormControl')
    }

    return validator
  }

  static validator_cpf_cnpj(control: FormControl){
    const valor = control.value

    if(valor.length == 14){
      const cpf = valor

      if (cpf && cpf !== '') {
        // Remove qualquer caractere não numérico do CPF
        const cpfLimpo = cpf.replace(/\D/g, '');

        // Verifica se o CPF tem 11 dígitos
        if (cpfLimpo.length !== 11) {
          return { cpfInvalido: true };
        }

        // Verifica se todos os dígitos são iguais (caso especial)
        if (/^(\d)\1{10}$/.test(cpfLimpo)) {
          return { cpfInvalido: true };
        }

        // Calcula o primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
          soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
        }
        let resto = 11 - (soma % 11);
        let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto;

        // Calcula o segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
          soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
        }
        resto = 11 - (soma % 11);
        let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto;

        // Verifica se os dígitos verificadores estão corretos
        if (
          digitoVerificador1 !== parseInt(cpfLimpo.charAt(9)) ||
          digitoVerificador2 !== parseInt(cpfLimpo.charAt(10))
        ) {
          return { cpfInvalido: true };
        }

        // CPF válido
        return null;
      }
    }
    else if(valor.length == 18){
      const cnpj = valor;

      if (cnpj && cnpj !== '') {
        // Remove qualquer caractere não numérico do CNPJ
        const cnpjLimpo = cnpj.replace(/\D/g, '');

        // Verifica se o CNPJ tem 14 dígitos
        if (cnpjLimpo.length !== 14) {
          return { cnpjInvalido: true };
        }

        // Verifica se todos os dígitos são iguais (caso especial)
        if (/^(\d)\1{13}$/.test(cnpjLimpo)) {
          return { cnpjInvalido: true };
        }

        // Calcula o primeiro dígito verificador
        let soma = 0;
        let peso = 5;
        for (let i = 0; i < 12; i++) {
          soma += parseInt(cnpjLimpo.charAt(i)) * peso;
          peso = peso === 2 ? 9 : peso - 1;
        }
        let resto = soma % 11;
        let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;

        // Calcula o segundo dígito verificador
        soma = 0;
        peso = 6;
        for (let i = 0; i < 13; i++) {
          soma += parseInt(cnpjLimpo.charAt(i)) * peso;
          peso = peso === 2 ? 9 : peso - 1;
        }
        resto = soma % 11;
        let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;

        // Verifica se os dígitos verificadores estão corretos
        if (
          digitoVerificador1 !== parseInt(cnpjLimpo.charAt(12)) ||
          digitoVerificador2 !== parseInt(cnpjLimpo.charAt(13))
        ) {
          return { cnpjInvalido: true };
        }

        // CNPJ válido
        return null;
      }
    }

    // Se o campo estiver vazio, considera válido (ou pode mudar para { cpfRequired: true } se for necessário)
    return null;
  }

  static getErrorMsg(fieldName: string, validatorName: string, validatorValue?: any){

    fieldName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1)

    const config: any = {
      'required': `${ fieldName } é obrigatório.`,
      'minlength': `${ fieldName } deve ter no mínimo ${ validatorValue.requiredLength } caracteres.`,
      'maxlength': `${ fieldName } deve ter no máximo ${ validatorValue.requiredLength } caracteres.`,
      'telMinLength': 'Digite um telefone válido.',
      'telMaxLength': 'Digite um telefone válido.',
      'cepInvalido': 'CEP inválido.',
      'email': `${ fieldName } inválido.`,
      'emailJaCadastrado': `${ fieldName } já cadastrado.`,
      'cpfJaCadastrado': `${ fieldName } já cadastrado.`,
      'telJaCadastrado': `${ fieldName } já cadastrado.`,
      'equalsTo': `Campos não são iquais.`,
      'cpfInvalido': `CPF inválido.`,
      'cnpjInvalido': `CNPJ inválido.`,
      'minCpfCnpj': '11 números para CPF ou 14 para CNPJ',
      'requiredMinCheckbox': `Selecione ${ validatorValue } ${ validatorValue > 1 ? 'opções' : 'opção'}.`,
      'pattern': `Você deve concordar antes de enviar.`
    }

    return config[validatorName]
  }
}