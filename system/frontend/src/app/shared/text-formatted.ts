export class TextFormatted {

  static telFormat(numero: string): string{
    // Entrada -> "11987654321" -- Saída: "(11) 98765-4321"
    const digitsOnly = numero.replace(/\D/g, '')

    if(digitsOnly.length === 10) {
      return digitsOnly.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }

    return digitsOnly.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  static cpfFormat(numero: string): string{
    // Entrada -> "12345678901" -- Saída: "123.456.789-01"
    const digitsOnly = numero.replace(/\D/g, '')

    return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  static cpfCpnjFormat(numero: string): string{
    // Entrada -> "12345678901234" -- Saída: "12.345.678/9012-34"

    const digitsOnly = numero.replace(/\D/g, '')

    if(digitsOnly.length == 11){
      return digitsOnly.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    }

    return digitsOnly.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  static capitalizarTexto(texto: string) {
    // Entrada -> "joão da silva" -- Saída: "João da Silva"
    return texto
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/(?:^|\s)\S/g, char => char.toUpperCase());
  }

  static removerNaoNumericos(valor: string): string {
    // Entrada -> "(11) 98765-4321" -- Saída: "11987654321"
    return valor
      .replace(/\D/g, '')
      .trim()    
  }

  static textToHourMinute(value: string): string {
    // Entrada -> "2359" -- Saída: "23:59"
    const digitsOnly = value.replace(/\D/g, '')
    const [hours, minutes] = digitsOnly.match(/(\d{2})(\d{2})/)?.slice(1).map(Number) || [0, 0]
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
  }

  static secondsToTime(totalMinutes: number): string {
    if (totalMinutes < 60) {
      return `${totalMinutes} min`
    }

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if(minutes === 0) {
      return `${hours} h`
    }    

    return `${hours}:${minutes.toString().padStart(2, '0')} h`
  }

  static textToCurrency(value: number): string {
    // Entrada -> 150.5 -- Saída: "R$ 150,50"
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  static textToDateTime(value: string): string {
    // Entrada -> "2024-06-30T14:30:00" -- Saída: "30/06/2024 14:30"
    const date = new Date(value)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }
}

