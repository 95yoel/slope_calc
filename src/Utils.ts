export class Utils {
  static async fetchUrl(path: string): Promise<string> {
    const url = import.meta.env.BASE_URL + path.replace(/^\/+/, '')
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status} at ${url}`)
      return await res.text()
    } catch (err) {
      console.error(`[Utils.fetchUrl] Error fetching "${url}":`, err)
      throw err
    }
  }
}
