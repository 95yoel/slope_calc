import { Analytics } from '../analytics/Analytics'

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
            <th>Long. ini</th><th>Long. fin</th><th>Alt. ini</th><th>Alt. fin</th>
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
      <td>${segment.initialLength} km</td>
      <td>${segment.finalLength} km</td>
      <td>${segment.initialElevation} m</td>
      <td>${segment.finalElevation} m</td>
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
    (this.querySelector('.total-dist')! as HTMLElement).textContent =
      analytics.getTotalDistance().toFixed(2) + " m";
    (this.querySelector('.total-desn')! as HTMLElement).textContent =
      analytics.getTotalDesnivel().toFixed(2)+ " m";
    (this.querySelector('.avg-slope')! as HTMLElement).textContent =
      (analytics.getAverageSlope() * 100).toFixed(2) + ' %'
  }
}

customElements.define('slope-result', Result)