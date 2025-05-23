import { Analytics } from '../analytics/Analytics'
import { Formatters } from '../utils/Formatters'
import { ReportGenerator } from '../utils/ReportGenerator'
import ResultTemplate from '../templates/result.html?raw'
import type { CustomInput } from './CustomInput'

export interface HTMLSlopeResultElement extends HTMLElement {
  init: () => void
  addSegment: (analytics: Analytics) => void
  reset: () => void
}

export class Result extends HTMLElement implements HTMLSlopeResultElement {
  private tbody!: HTMLTableSectionElement
  private exportBtn!: HTMLButtonElement
  private titleInput!: CustomInput
  private toggleDefault!: HTMLInputElement
  private titleControl!: HTMLElement

  async init() {
    
    this.innerHTML = ResultTemplate

    this.exportBtn = this.querySelector('.export-btn') as HTMLButtonElement
    this.titleControl = this.querySelector('.title-control') as HTMLElement
    this.titleInput = this.querySelector('custom-input.title-input') as CustomInput
    this.toggleDefault = this.querySelector('.toggle-default') as HTMLInputElement
    this.tbody = this.querySelector('.segments-body') as HTMLTableSectionElement

    this.toggleDefault.addEventListener('change', () => {
      const useDefault = this.toggleDefault.checked
      this.titleInput.hidden = useDefault
      if (useDefault) {
        this.titleInput.value = ''
      }
    })

    this.exportBtn.addEventListener('click', () => this.exportPdf())
  }

  addSegment(analytics: Analytics) {
    const segments = analytics.getSegments()
    const segment = segments[segments.length - 1]
    if (!segment) return

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${segment.id}</td>
      <td>${Formatters.toMeters(segment.distance)}</td>
      <td>${Formatters.toMeters(segment.desnivel)}</td>
      <td>${Formatters.toPercent(segment.slope)}</td>
      <td class="hide-mobile">${Formatters.toKilometers(segment.initialLength)}</td>
      <td class="hide-mobile">${Formatters.toKilometers(segment.finalLength)}</td>
      <td class="hide-mobile">${Formatters.toMeters(segment.initialElevation)}</td>
      <td class="hide-mobile">${Formatters.toMeters(segment.finalElevation)}</td>
    `
    this.tbody.appendChild(row)

    this.updateSummary(analytics)

    this.showExportControls()
  }

  reset() {
    this.tbody.innerHTML = ''
    this.updateSummary({
      getTotalDistance: () => 0,
      getTotalDesnivel: () => 0,
      getAverageSlope: () => 0
    } as Analytics)

    this.exportBtn.hidden = true
    this.titleControl.hidden = true

    this.toggleDefault.checked = true
    this.titleInput.value = ''
    this.titleInput.hidden = true

  }

  private updateSummary(analytics: Analytics) {
    const summary = {
      dist: Formatters.toMeters(analytics.getTotalDistance()),
      desn: Formatters.toMeters(analytics.getTotalDesnivel()),
      slope: Formatters.toPercent(analytics.getAverageSlope())
    }

    this.querySelector('.total-dist')!.textContent = summary.dist
    this.querySelector('.total-desn')!.textContent = summary.desn
    this.querySelector('.avg-slope')!.textContent = summary.slope
  }

  private exportPdf() {
    const summaryHTML = (this.querySelector('.summary') as HTMLElement).outerHTML
    const tableHTML = (this.querySelector('table') as HTMLElement).outerHTML
    const title = this.toggleDefault.checked
      ? ''
      : this.titleInput.value || ''
    const reportGen = new ReportGenerator(title)
    reportGen.export(summaryHTML, tableHTML)
  }

  private showExportControls() {
    this.exportBtn.hidden = false
    this.titleControl.hidden = false
    this.titleInput.hidden = this.toggleDefault.checked
  }
}

customElements.define('slope-result', Result)
