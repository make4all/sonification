import React from 'react'

import { TextField } from '@mui/material'
import { IDemoView } from './IDemoView'
import { RunningExtremaHandler } from '../../sonification/handler/RunningExtremaHandler'
import { DemoSimple, DemoSimpleProps, DemoSimpleState } from './DemoSimple'
import { NoteHandler } from '../../sonification/handler/NoteHandler'
import { OutputEngine } from '../../sonification/OutputEngine'
import { Box, Button, Input } from '@mui/material'
import { Speech } from '../../sonification/output/Speech'
import { NoteSonify } from '../../sonification/output/NoteSonify'

const DEBUG = true

export interface DemoRunningExtremaProps extends DemoSimpleProps {
    dataSummary: any
}

export class DemoRunningExtrema
    extends DemoSimple<DemoRunningExtremaProps, DemoSimpleState>
    implements IDemoView
{
    minimumTracker: RunningExtremaHandler | undefined
    maximumTracker: RunningExtremaHandler | undefined

    constructor(props: DemoRunningExtremaProps) {
        super(props)
    }

    ////////// HELPER METHODS ///////////////
    public initializeSink() {
        this.sink = OutputEngine.getInstance().addSink('DemoSlopeParity')
        this.maximumTracker = new RunningExtremaHandler(1, new Speech())
        this.minimumTracker = new RunningExtremaHandler(-1, new Speech())
        if (DEBUG) console.log("sink initialized")
        this.sink.addDataHandler(this.maximumTracker)
        this.sink.addDataHandler(this.minimumTracker)
        this.sink.addDataHandler(new NoteHandler(undefined, new NoteSonify()))
        return this.sink
    }
}
