import { filter, Observable, tap } from 'rxjs'
import { DatumOutput } from '../output/DatumOutput'
import { getSonificationLoggingLevel, OutputStateChange, SonificationLoggingLevel } from '../OutputConstants'
import { DataHandler } from './DataHandler'

const DEBUG = false

/**
 * A DataHandler that filters out things which are not betwen min and max (inclusive)
 * @todo change this to take a function that decides how to filter?
 */
export class FilterRangeHandler extends DataHandler {
    /**
     * The domain to accept points within. Defaults to 0,0 if not defined in constructor
     */
    private _domain: [number, number]
    public get domain(): [number, number] {
        return this._domain

    }
    public set domain(value: [number, number]) {
        this._domain = value
    }

    public insideDomain(num: number): boolean {
        debugStatic(SonificationLoggingLevel.DEBUG, `checking if ${num} is inside ${this.domain}`)
        return num >= this.domain[0] && num <= this.domain[1]
    }

    /**
     * Constructor
     *
     * @param sink. DataSink that is providing data to this Handler.
     * @param output. Optional output for this data
     * @param domain [min, max]. Defaults to 0, 0 if not provided
     */
    constructor(domain?: [number, number], output?: DatumOutput) {
        super(output)
        debugStatic(SonificationLoggingLevel.DEBUG, "setting up filter range handeler")
        if (domain){
            debugStatic(SonificationLoggingLevel.DEBUG, `setting up filter range handeler with domain ${domain}`)
            this._domain = domain

        } 

        else this._domain = [0, 0]
    }

    /**
     * Set up a subscription so we are notified about events
     * Override this if the data needs to be modified in some way
     *
     * @param sink The sink that is producing data for us
     */
    public setupSubscription(sink$: Observable<OutputStateChange | Datum>) {
        debugStatic (SonificationLoggingLevel.DEBUG, `setting up subscription for ${this} ${sink$}`)
        super.setupSubscription(
            sink$.pipe(
                filter((val) => {
                    if (val instanceof Datum){
                        debugStatic(SonificationLoggingLevel.DEBUG, `checking if ${val} is inside ${this.domain}`)
                        return this.insideDomain(val.value)
                    }
                    else return true
                }),
            ),
        )
    }

    /**
     * @returns A string describing this class including its range.
     */
    public toString(): string {
        return `FilterRangeHandler: Keeping only data in ${this.domain[0]},${this.domain[1]}`
    }
}

//////////// DEBUGGING //////////////////
import { tag } from 'rxjs-spy/operators/tag'
import { Datum } from '../Datum'
const debug = (level: number, message: string, watch: boolean) => (source: Observable<any>) => {
    if (watch) {
        return source.pipe(
            tap((val) => {
                debugStatic(level, message + ': ' + val)
            }),
            tag(message),
        )
    } else {
        return source.pipe(
            tap((val) => {
                debugStatic(level, message + ': ' + val)
            }),
        )

    }
}

const debugStatic = (level: number, message: string) => {
    if (DEBUG) {
        if (level >= getSonificationLoggingLevel()) {
            console.log(message)
        }// else console.log('debug message dumped')

    }
}


