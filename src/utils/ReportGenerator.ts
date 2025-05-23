import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib'
import type { PDFPage } from 'pdf-lib'

export class ReportGenerator {
  private title: string

  constructor(title?: string) {
    this.title = title?.trim() || 'Informe Desnivel'
  }

  private extractSummaryText(summaryHtml: string): string[] {
    const container = document.createElement('div')
    container.innerHTML = summaryHtml
    return Array.from(container.querySelectorAll('p')).map(p => p.textContent?.trim() || '')
  }

  private extractTableData(tableHtml: string): string[][] {
    const container = document.createElement('div')
    container.innerHTML = tableHtml
    const rows = container.querySelectorAll('tr')
    return Array.from(rows).map(tr =>
      Array.from(tr.querySelectorAll('th, td')).map(cell => cell.textContent?.trim() || '')
    )
  }

  private drawTable(
    page: PDFPage,
    data: string[][],
    startX: number,
    startY: number,
    colWidths: number[],
    rowHeight: number,
    font: PDFFont,
    fontSize: number
  ): void {
    let y = startY

    data.forEach((row, rowIndex) => {
      let x = startX

      if (rowIndex === 0) {
        page.drawRectangle({
          x: startX,
          y: y - rowHeight + 2,
          width: colWidths.reduce((a, b) => a + b, 0),
          height: rowHeight,
          color: rgb(0.117, 0.227, 0.541),
        })
      }

      row.forEach((cellText, i) => {
        const textColor = rowIndex === 0 ? rgb(1, 1, 1) : rgb(0.22, 0.22, 0.22)
        page.drawText(cellText, {
          x: x + 5,
          y: y - fontSize - (rowIndex === 0 ? 4 : 2),
          size: fontSize,
          font,
          color: textColor,
          maxWidth: colWidths[i] - 10,
        })
        x += colWidths[i]
      })

      page.drawLine({
        start: { x: startX, y: y - rowHeight + 2 },
        end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: y - rowHeight + 2 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      })

      let lineX = startX
      colWidths.forEach(widthSegment => {
        page.drawLine({
          start: { x: lineX, y: y + 2 },
          end: { x: lineX, y: y - rowHeight + 2 },
          thickness: 1,
          color: rgb(0.85, 0.85, 0.85),
        })
        lineX += widthSegment
      })

      page.drawLine({
        start: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: y + 2 },
        end: { x: startX + colWidths.reduce((a, b) => a + b, 0), y: y - rowHeight + 2 },
        thickness: 1,
        color: rgb(0.85, 0.85, 0.85),
      })

      y -= rowHeight
    })
  }

  public async export(summaryHtml: string, tableHtml: string): Promise<void> {

    const titleToUse = this.title.trim() || 'Informe Desnivel'

    const pdfDoc = await PDFDocument.create()
    const page: PDFPage = pdfDoc.addPage([600, 800])

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica)

    page.drawText(titleToUse, {
      x: 40,
      y: page.getHeight() - 50,
      size: 20,
      font: fontBold,
      color: rgb(0, 0, 0),
    })

    const summaryLines = this.extractSummaryText(summaryHtml)
    let cursorY = page.getHeight() - 80
    for (const line of summaryLines) {
      page.drawText(line, {
        x: 40,
        y: cursorY,
        size: 12,
        font: fontNormal,
        color: rgb(0, 0, 0),
      })
      cursorY -= 18
    }

    const tableData = this.extractTableData(tableHtml)
    const colWidth = 520 / tableData[0].length
    const colWidths = Array(tableData[0].length).fill(colWidth)
    const rowHeight = 24
    const tableStartY = cursorY - 20

    this.drawTable(
      page,
      tableData,
      40,
      tableStartY,
      colWidths,
      rowHeight,
      fontNormal,
      12
    )

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url

    a.download = `${titleToUse.replace(/\s+/g, '_').toLowerCase()}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  }

}
