import type { Kilometers, Meters, Percent } from "../models/units"

export class Formatters {

    static toMeters(value: number): Meters {
        return `${Number(value.toFixed(2))} m`
    }

    static toKilometers(value: number): Kilometers {
        return `${Number(value.toFixed(2))} km`
    }

    static toPercent(value: number): Percent {
     return `${Number((value * 100).toFixed(2))} %`
    }


}