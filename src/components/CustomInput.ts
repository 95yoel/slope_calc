type ValidationResult = { valid: boolean; message?: string }

export class CustomInput extends HTMLElement {
  private _input: HTMLInputElement
  private _validator?: (value: string) => ValidationResult

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    const style = document.createElement('style')
    style.textContent = `
      input {
        width: 100%;
        box-sizing: border-box;
        padding: 8px 16px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 0.4rem;
        outline: none;
        transition: border-color .2s;
      }
      input:focus {
        border-color: #888;
      }
    `

    this._input = document.createElement('input')
    shadow.append(style, this._input)
  }

  // Observed attributes
  static get observedAttributes(): string[] {
    return ['type', 'placeholder', 'value', 'required']
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    switch (name) {
      case 'type':
        this._input.type = newValue ?? 'text'
        break
      case 'placeholder':
        this._input.placeholder = newValue ?? ''
        break
      case 'value':
        this._input.value = newValue ?? ''
        break
      case 'required':
        this._input.required = newValue !== null
        break
    }
  }

  connectedCallback(): void {
  
    for (const attr of CustomInput.observedAttributes) {
      if (this.hasAttribute(attr)) {
        const val = this.getAttribute(attr)
        this.attributeChangedCallback(attr, null, val)
      }
    }
  }

  get value(): string {
    return this._input.value
  }
  set value(val: string) {
    this._input.value = val
    this.setAttribute('value', val)
  }

  
  set validator(fn: (value: string) => ValidationResult) {
    this._validator = fn
  }
  get validator(): ((value: string) => ValidationResult) | undefined {
    return this._validator
  }


  validate(): boolean {
    let result: ValidationResult = { valid: true }

    if (this._validator) {
      result = this._validator(this.value) || { valid: true }
    } else {
      result.valid = this._input.checkValidity()
    }

    this._input.style.borderColor = result.valid ? '#ccc' : 'red'
    return result.valid
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-input': CustomInput
  }
}

customElements.define('custom-input', CustomInput)
