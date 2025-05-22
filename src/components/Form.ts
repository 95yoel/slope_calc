import { Utils } from "../Utils"
import type { CustomInput } from "./CustomInput"

export class Form extends HTMLElement {
  private submitHandler = (e: Event) => this.onSubmit(e)
  private clearFieldsHandler = () => this.onClearFields()
  private clearAllHandler = () => this.onClearAll()

  async connectedCallback() {
    const html = await Utils.fetchUrl("form.html")
    this.innerHTML = html

    const formEl = this.querySelector<HTMLFormElement>('#form')!
    const inputs = Array.from(
      formEl.querySelectorAll<CustomInput>('custom-input')
    )

    // Asign Validators
    inputs.forEach(inp => {
      if (inp.hasAttribute('required')) {
        inp.validator = value => ({
          valid: value.trim().length > 0,
          message: "Este campo es obligatorio"
        })
      }
      const rule = inp.getAttribute('data-validate')
      if (rule === 'nonEmpty') {
        const msg = inp.getAttribute('data-error') || 'No puede quedar vacío'
        inp.validator = value => ({
          valid: value.trim() !== '',
          message: msg
        })
      }
    })

    // Asign Listeners
    formEl.addEventListener('submit', this.submitHandler)
    const btnClear = formEl.querySelector<HTMLButtonElement>('.form-button-delete')!
    btnClear.addEventListener('click', this.clearFieldsHandler)
    const btnDeleteAll = formEl.querySelector<HTMLButtonElement>('#deleteAll')!
    btnDeleteAll.addEventListener('click', this.clearAllHandler)
  }

  disconnectedCallback() {
    const formEl = this.querySelector<HTMLFormElement>('#form')
    if (formEl) {
      formEl.removeEventListener('submit', this.submitHandler)
      const btnClear = formEl.querySelector<HTMLButtonElement>('.form-button-delete')
      if (btnClear) btnClear.removeEventListener('click', this.clearFieldsHandler)
      const btnDeleteAll = formEl.querySelector<HTMLButtonElement>('#deleteAll')
      if (btnDeleteAll) btnDeleteAll.removeEventListener('click', this.clearAllHandler)
    }
  }

  private onSubmit(e: Event) {
    e.preventDefault()
    const formEl = this.querySelector<HTMLFormElement>('#form')!
    const inputs = Array.from(
      formEl.querySelectorAll<CustomInput>('custom-input')
    )

    let allValid = true
    inputs.forEach(inp => {
      if (!inp.validate()) allValid = false
    })
    if (!allValid) {
      alert('No puede haber campos vacíos.')
      return
    }

    // Get values
    const [l0, l1, e0, e1] = inputs.map(inp => Number(inp.value))
    // Throw event
    this.dispatchEvent(
      new CustomEvent('segment-submitted', {
        bubbles: true,
        composed: true,
        detail: { initialLength: l0, finalLength: l1, initialElevation: e0, finalElevation: e1 }
      })
    )

    // Clear inputs
    this.clearFields()
  }

  private onClearFields() {
    const formEl = this.querySelector<HTMLFormElement>('#form')!
    const inputs = Array.from(
      formEl.querySelectorAll<CustomInput>('custom-input')
    )
    this.clearFields(inputs)
  }

  private clearFields(inputs?: CustomInput[]) {
    const inns = inputs ?? Array.from(
      this.querySelector<HTMLFormElement>('#form')!
        .querySelectorAll<CustomInput>('custom-input')
    )
    inns.forEach(inp => {
      inp.value = ''
      const native = inp.shadowRoot?.querySelector<HTMLInputElement>('input')
      if (native) native.style.borderColor = '#ccc'
    })
  }

  private onClearAll() {
    this.clearFields()
    // Global reset
    this.dispatchEvent(
      new CustomEvent('clear-all', {
        bubbles: true,
        composed: true
      })
    )
  }
}

customElements.define('slope-form', Form)
