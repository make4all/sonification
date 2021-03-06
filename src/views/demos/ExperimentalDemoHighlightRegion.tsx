import React from 'react'

import { IDemoView } from './IDemoView'
import { FilterRangeHandler } from '../../sonification/handler/FilterRangeHandler'
import { NoiseSonify } from '../../sonification/output/NoiseSonify'
import { NoteHandler } from '../../sonification/handler/NoteHandler'
import { DataSink } from '../../sonification/DataSink'
import { map, take, timer } from 'rxjs'
import { Datum } from '../../sonification/Datum'
import { OutputEngine } from '../../sonification/OutputEngine'
import { OutputStateChange } from '../../sonification/OutputConstants'
import { TextField } from '@mui/material'
import { NoteSonify } from '../../sonification/output/NoteSonify'

export interface ExperimentalDemoHighlightRegionState {
    // dataSummary: any
}
export interface ExperimentalDemoHighlightRegionProps {
    dataSummary: any
}

// I don't know react well enough -- can this extend demosimple instead? Would be much simpler...
// would still need to get the highlightRegionProps...
// there is a lot of duplication between this and DemoSimple right now...
export class ExperimentalDemoHighlightRegion<ExperimentalDemoHighlightRegionProps, ExperimentalDemoHighlightRegionState>
    extends React.Component<ExperimentalDemoHighlightRegionProps, ExperimentalDemoHighlightRegionState>
    implements IDemoView
{
    /**
     * @todo implement pausing
     * The index into our data set that we were at when we were paused
     */
    protected current = 0

    /**
     * Holder for the current data sink object
     */
    protected sink: DataSink | undefined

    /**
     * The filter object
     */
    filter: FilterRangeHandler | undefined

    public getSink(): DataSink {
        if (this.sink) return this.sink
        else return this.initializeSink()
    }

    /**
     * Holder for data set to sonify
     */
    protected data: number[] | undefined

    /**
     * the minimum number.
     * @todo needs to be changed to become a state variable. defaults to -1 to test if the sign demo works.
     */
    protected min: number

    /**
     * the maximum number.
     * @todo needs to be changed to become a state variable. defaults to 10 to test if the sign demo works.
     */
    protected max: number

    // filter: FilterRangeTemplate | undefined

    /**
     * constructor
     * gets a sonifier.
     * @todo need to handel state better.
     * @param props
     */
    constructor(props: ExperimentalDemoHighlightRegionProps) {
        super(props)

        this.min = -1
        this.max = 10
    }
    /**
     * The play button has been pressed and data set specified. Time to start sonificatino
     *
     * First, since we now know what data we are playing, this adds a max/min calculator
     * to our data sink. The calculation is based on the full data set and always returns the
     * same value as a result
     * @todo think about how to set up static calculations so they don't run over and over again.
     *
     * Second, we make a callback to the sonifierInstance to let it know to shift into play mode
     * Third, we call playDataSlowly() to simulate streaming data
     *
     * @param data The data set to be played
     */
    public onPlay = (data: any) => {
        console.log(`in onPlay ${this.sink}`)

        if (!this.sink) this.initializeSink()

        // SONIFICATION INITIALIZATION
        OutputEngine.getInstance().next(OutputStateChange.Play)

        // SONIFICATION INITIALIZATION
        OutputEngine.getInstance().next(OutputStateChange.Play)

        let id = this.sink ? this.sink.id : 0
        let source = timer(0, 200).pipe(
            map((val) => new Datum(id, data[val])),
            take(data.length),
        )

        console.log('setStream in demo')
        OutputEngine.getInstance().setStream(id, source)
    }

    public onPause = (data: any) => {
        OutputEngine.getInstance().next(OutputStateChange.Pause)
    }

    /**
     * Garbage collect our data stream.
     */
    public componentWillUnmount() {
        OutputEngine.getInstance().next(OutputStateChange.Stop)
        if (this.sink) {
            OutputEngine.getInstance().deleteSink(this.sink)
        }
    }

    public render() {
        // const { minValue, maxValue } = this.state

        return (
            <div>
                <TextField
                    id="text-min-value"
                    aria-label="Enter minimum value"
                    label="Min"
                    variant="outlined"
                    type="number"
                    value={isNaN(this.min) ? '' : this.min}
                    onChange={(e) => this._handleValueChange(parseFloat(e.target.value), 'min')}
                />
                <TextField
                    id="text-max-value"
                    aria-label="Enter maximum value"
                    label="Max"
                    variant="outlined"
                    type="number"
                    value={isNaN(this.max) ? '' : this.max}
                    onChange={(e) => this._handleValueChange(parseFloat(e.target.value), 'max')}
                />
            </div>
        )
    }

    private _handleValueChange = (value: number, which: string) => {
        switch (which) {
            case 'min':
                this.min = value
                break
            case 'max':
                this.max = value
                break
        }
        if (this.filter) this.filter.domain = [this.min, this.max]
    }

    ////////// HELPER METHODS ///////////////
    public initializeSink() {
        this.sink = OutputEngine.getInstance().addSink('HighlightRegionDemo')
        /**
         * @todo vpotluri to understand: where is the update datum method for this being called?
         */

        this.sink.addDataHandler(new NoteHandler(undefined, new NoteSonify()))
        this.filter = new FilterRangeHandler([this.min, this.max], new NoiseSonify())
        this.sink.addDataHandler(this.filter)
        return this.sink
    }
}
