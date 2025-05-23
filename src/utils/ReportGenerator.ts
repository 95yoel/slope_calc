export class ReportGenerator {
  private title: string

  constructor(title = 'Informe Desnivel') {
    this.title = title
  }

  public openPrintWindow(htmlContent: string) {
    const win = window.open('', '_blank', 'width=800,height=600')
    if (!win) return
    win.document.write(htmlContent)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  public generateHtml(summaryHtml: string, tableHtml: string): string {
    return `
      <html>
        <head>
          <title>${this.title}</title>
          <style>
            body { font-family: Inter, sans-serif; padding: 1rem; }
            .summary p { margin: .5rem 0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: .5rem; border: 1px solid #ccc; }
            thead { background: #1e3a8a; color: #fff; }
          </style>
        </head>
        <body>
          <h1>${this.title}</h1>
          ${summaryHtml}
          ${tableHtml}
        </body>
      </html>
    `
  }

  public export(summaryHtml: string, tableHtml: string) {
    const content = this.generateHtml(summaryHtml, tableHtml)
    this.openPrintWindow(content)
  }
}
