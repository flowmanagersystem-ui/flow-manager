export class TextFormatted {

  static telFormat(numero: string): string{
    const digitsOnly = numero.replace(/\D/g, '')

    if(digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  static cpfFormat(numero: string): string{
    const digitsOnly = numero.replace(/\D/g, '')

    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static cpfCpnjFormat(numero: string): string{

    const digitsOnly = numero.replace(/\D/g, '')

    if(digitsOnly.length == 11){
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    return digitsOnly.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  static capitalizarTexto(texto: string) {
    texto = texto.trim()

    let palavras = texto.split(' ')

    for(let i = 0; i < palavras.length; i++){
      palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1).toLowerCase()
    }

    return palavras.join(' ')
  }

  static removerNaoNumericos(valor: string): string {
    valor = valor.replace(/\D/g, '').trim()

    return valor
  }

  static toTitleCase(value: string): string {
    return value
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
  }

  // Formato Horas e minutos (HH:mm)
  static timeFormat(value: string): string {
    const digitsOnly = value.replace(/\D/g, '')
    const [hours, minutes] = digitsOnly.match(/(\d{2})(\d{2})/)?.slice(1).map(Number) || [0, 0]
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }
}

