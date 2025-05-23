import { Analytics } from '../analytics/Analytics'
import { Formatters } from '../utils/Formatters'


export interface HTMLSlopeResultElement extends HTMLElement {
  init: () => void
  addSegment: (analytics: Analytics) => void
  reset: () => void
}

export class Result extends HTMLElement implements HTMLSlopeResultElement {
  private tbody!: HTMLTableSectionElement

  init() {
    this.innerHTML = `
      <div class="summary">
        <p><strong>Distancia total:</strong> <span class="total-dist">0.00 m</span></p>
        <p><strong>Desnivel total:</strong> <span class="total-desn">0.00 m</span></p>
        <p><strong>Pendiente media:</strong> <span class="avg-slope">0.00 %</span></p>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th><th>Dist.</th><th>Desn.</th><th>Pend.</th>
            <th class="hide-mobile">Long. ini</th><th class="hide-mobile">Long. fin</th><th class="hide-mobile">Alt. ini</th class="hide-mobile"><th>Alt. fin</th>
          </tr>
        </thead>
        <tbody class="segments-body"></tbody>
      </table>
    `
    this.tbody = this.querySelector('.segments-body') as HTMLTableSectionElement
  }

  addSegment(analytics: Analytics) {
    const segments = analytics.getSegments()
    const segment = segments[segments.length - 1]
    if (!segment) return

    const row = document.createElement('tr')
    row.innerHTML = `
      <td>${segment.id}</td>
      <td>${segment.distance.toFixed(2)} m</td>
      <td>${segment.desnivel.toFixed(2)} m</td>
      <td>${(segment.slope * 100).toFixed(2)}%</td>
      <td class="hide-mobile">${segment.initialLength} km</td>
      <td class="hide-mobile">${segment.finalLength} km</td>
      <td class="hide-mobile">${segment.initialElevation} m</td>
      <td class="hide-mobile">${segment.finalElevation} m</td>
    `
    this.tbody.appendChild(row)

    this.updateSummary(analytics)
  }

  reset() {
    this.tbody.innerHTML = ''
    this.updateSummary({
      getTotalDistance: () => 0,
      getTotalDesnivel: () => 0,
      getAverageSlope: () => 0
    } as Analytics)
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

}

customElements.define('slope-result', Result)