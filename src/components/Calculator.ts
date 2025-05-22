export class Calculator extends HTMLElement {
  async connectedCallback() {
    const res = await fetch('/calculator.html')
    const html = await res.text()
    this.innerHTML = html

    this.querySelector('.calc-btn')?.addEventListener('click', () => {
      const ki = parseFloat((this.querySelector('.km-inicio') as HTMLInputElement).value)
      const kf = parseFloat((this.querySelector('.km-fin') as HTMLInputElement).value)
      const ai = parseFloat((this.querySelector('.alt-inicio') as HTMLInputElement).value)
      const af = parseFloat((this.querySelector('.alt-fin') as HTMLInputElement).value)

      const distancia = (kf - ki) * 1000
      const desnivel = af - ai
      const pendiente = (desnivel / distancia) * 100;

      (this.querySelector('.resultado') as HTMLElement).textContent =
        `Distancia: ${distancia.toFixed(1)} m, Desnivel: ${desnivel} m, Pendiente: ${pendiente.toFixed(2)} %`
    })
  }
}

customElements.define('slope-calculator', Calculator)
