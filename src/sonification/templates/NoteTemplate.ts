import { DatumDisplay } from "../displays/DatumDisplay";
import { NoteSonify } from "../displays/NoteSonify";
import * as d3 from 'd3'
import { DataSource } from "../DataSource";
import { Datum } from "../Datum";
import { Template } from "./Template";


/**
 * A template that displays a Datum as a note in the audible range.
 * Assumes a note should be played in the general range of 80 to 500 Hz to sound nice
 */
export class NoteTemplate extends Template {
    targetRange: [number, number]

    /**
     * Sets up a default target range that is audible 
     * @param targetRange The audible range the note should be in
     * @param sourceRange The range of the incoming data 
     * @param exceedRange 
     * @param duration 
     * @param volume 
     */
    constructor(display?: DatumDisplay, targetRange?: [number, number], duration?: number, volume?: number) {
        super(new NoteSonify(duration, volume, undefined, true));
        this.targetRange = (targetRange) ? targetRange : [90, 450];
    }

    handleDatum(datum: Datum, source: DataSource): boolean {
        let sourcemax = source.getStat("max");
        let sourcemin = source.getStat("min");
        console.log(`mapping ranges: ${this.targetRange}, ${[sourcemin, sourcemax]}`)

        datum.adjustedValue = d3.scaleLinear().domain([sourcemin, sourcemax]).range(this.targetRange)(datum.value);
        return super.handleDatum(datum, source);
    }

    public toString(): string {
        return `NoteTemplate: Converting to ${this.targetRange[0]},${this.targetRange[1]}`
    }
}