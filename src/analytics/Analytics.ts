import { SegmentStore } from '../db/segments-db'

export interface SegmentData {
  initialLength: number
  finalLength: number
  initialElevation: number
  finalElevation: number
}

export interface Segment extends SegmentData {
  id: number
  distance: number
  desnivel: number
  slope: number
}

export class Analytics {
  private segments: Segment[] = []

  private constructor(initial: Segment[]) {
    this.segments = initial
  }

  static async create(): Promise<Analytics> {
    const stored = await SegmentStore.getAll()  
    return new Analytics(stored)
  }

  async addSegment(data: SegmentData) {
    const { initialLength, finalLength, initialElevation, finalElevation } = data
    const distance = (finalLength - initialLength) * 1000
    const desnivel = finalElevation - initialElevation
    const slope = distance !== 0 ? desnivel / distance : 0

    const segment: Segment = {
      id: this.segments.length + 1,
      initialLength,
      finalLength,
      initialElevation,
      finalElevation,
      distance,
      desnivel,
      slope
    }

    this.segments.push(segment)
    await SegmentStore.save(segment)              
  }

  getSegments(): Segment[] {
    return [...this.segments]
  }

  getTotalDesnivel(): number {
    return this.segments.reduce((sum, s) => sum + s.desnivel, 0)
  }

  getTotalDistance(): number {
    return this.segments.reduce((sum, s) => sum + s.distance, 0)
  }

  getAverageSlope(): number {
    const totalDist = this.getTotalDistance()
    return totalDist !== 0 ? this.getTotalDesnivel() / totalDist : 0
  }

  async clearSegments() {
    this.segments = []
    await SegmentStore.clear()
  }
}