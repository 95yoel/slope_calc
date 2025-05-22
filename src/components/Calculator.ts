import { Utils } from "../Utils"
import { Analytics, type SegmentData } from "../analytics/Analytics"
import "./Form"
import "./Result"
import type { HTMLSlopeResultElement } from "./Result"

export class Calculator extends HTMLElement {
  private analytics = new Analytics()
  private result!: HTMLSlopeResultElement
  private formEl?: HTMLElement
  private segmentHandler = (ev: Event) => this.onSegment(ev)
  private clearAllHandler = () => this.onClearAll()

  async connectedCallback() {
    const frag = await Utils.fetchUrl('calculator.html')
    this.innerHTML = frag
    const topSection = this.querySelector('.top-section')
    const bottomSection = this.querySelector('.bottom-section')
    if (!topSection || !bottomSection) return

    this.result = document.createElement('slope-result') as HTMLSlopeResultElement
    bottomSection.appendChild(this.result)
    this.result.init()

    this.formEl = document.createElement('slope-form')
    this.formEl.addEventListener('segment-submitted', this.segmentHandler)
    this.formEl.addEventListener('clear-all', this.clearAllHandler)
    topSection.appendChild(this.formEl)
  }

  disconnectedCallback() {
    if (this.formEl) {
      this.formEl.removeEventListener('segment-submitted', this.segmentHandler)
      this.formEl.removeEventListener('clear-all', this.clearAllHandler)
    }
  }

  private onSegment(ev: Event) {
    const { detail } = ev as CustomEvent<SegmentData>
    this.analytics.addSegment(detail)
    this.result.addSegment(this.analytics)
  }

  private onClearAll() {
    this.analytics.clearSegments()
    this.result.reset()
  }
}

customElements.define('slope-calculator', Calculator)