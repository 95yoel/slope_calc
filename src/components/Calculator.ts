import calculatorTemplate from '../templates/calculator.html?raw'
import { Analytics, type SegmentData } from "../analytics/Analytics"
import "./Form"
import "./Result"
import type { HTMLSlopeResultElement } from "./Result"

export class Calculator extends HTMLElement {
  private analytics!: Analytics
  private result!: HTMLSlopeResultElement
  private formEl?: HTMLElement

  private segmentHandler = async (ev: Event) => this.onSegment(ev)
  private clearAllHandler = async () => this.onClearAll()

  async connectedCallback() {
    
    this.innerHTML = calculatorTemplate

    this.analytics = await Analytics.create()

    const bottom = this.querySelector('.bottom-section')!
    this.result = document.createElement('slope-result') as HTMLSlopeResultElement
    bottom.appendChild(this.result)
    this.result.init()

    this.analytics.getSegments().forEach(() => {
      this.result.addSegment(this.analytics)
    })

    this.formEl = document.createElement('slope-form')
    this.formEl.addEventListener('segment-submitted', this.segmentHandler)
    this.formEl.addEventListener('clear-all', this.clearAllHandler)
    this.querySelector('.top-section')!.appendChild(this.formEl)
  }

  disconnectedCallback() {
    if (this.formEl) {
      this.formEl.removeEventListener('segment-submitted', this.segmentHandler)
      this.formEl.removeEventListener('clear-all', this.clearAllHandler)
    }
  }

  private async onSegment(ev: Event) {
    const { detail } = ev as CustomEvent<SegmentData>
    await this.analytics.addSegment(detail)
    this.result.addSegment(this.analytics)
  }

  private async onClearAll() {
    await this.analytics.clearSegments()
    this.result.reset()
  }
}

customElements.define('slope-calculator', Calculator)
