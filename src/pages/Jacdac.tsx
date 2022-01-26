import React, { FC, useState, useEffect } from 'react'
// import ConnectButton from "../../jacdac-docs/src/components/buttons/ConnectButton"

// import { JDBus } from "jacdac-ts/src/jdom/bus"

import { JDBus, JDDevice, SRV_ACCELEROMETER, REPORT_UPDATE, throttle, startDevTools, inIFrame } from 'jacdac-ts'
import { useServices, useChange, useBus } from 'react-jacdac'
import { Button } from '@mui/material'
import { Sonifier } from '../sonification/Sonifier'
import { JacdacProvider } from 'react-jacdac'
import { bus } from '../bus'
import { DataSource } from '../sonification/DataSource'
import { SettingsOverscanTwoTone } from '@mui/icons-material'
import { NoteTemplate } from '../sonification/templates/NoteTemplate'
import { FilterRangeTemplate } from '../sonification/templates/FilterRangeTemplate'
import { NoiseSonify } from '../sonification/displays/NoiseSonify'

const TONE_THROTTLE = 100

function ConnectButton() {
    const bus = useBus()
    const connected = useChange(bus, (_) => _.connected)
    const services = useServices({ serviceClass: SRV_ACCELEROMETER })
    const [sonifier, setSonifier] = useState<Sonifier>()
    const [streaming, setStreaming] = useState(false)
    const [source, setSource] = useState<DataSource>()

    useEffect(() => {
        if (!inIFrame() && window.location.hash === '#dbg') startDevTools()
    }, [])

    // register for accelerometer data events
    useEffect(() => {
        if (!services || services.length === 0) return
        const accelService = services[0]

        console.log(accelService.specification)
        const unsubs = accelService.readingRegister.subscribe(
            REPORT_UPDATE,
            // don't trigger more than every 100ms
            throttle(async () => {
                if (!streaming || !sonifier || !source) return
                const [x, y, z] = accelService.readingRegister.unpackedValue
                console.log('vpotluri: calling PushPoint.')
                sonifier.pushPoint(x, source.id)
            }, TONE_THROTTLE),
        )

        // cleanup callback
        return () => unsubs?.()
    }, [services])

    const handleConnect = async () => {
        if (connected) {
            console.log('DISCONNECT')
            await bus.disconnect()
        } else {
            console.log('connect')
            await bus.connect()
        }
    }

    const handleStartStreaming = () => {
        let son = sonifier
        let src = source
        if (!streaming) {
            if (!son) {
                son = Sonifier.getSonifierInstance()
                setSonifier(son)
            }

            if (!src) {
                src = son.addSource('jacdac demo')
                src.addTemplate(new NoteTemplate())
                // src.addTemplate(new FilterRangeTemplate(new NoiseSonify(), [-1, 0]))
                // dummy stats. Do we know the min and max for accelerometer?
                src.setStat('max', 1.0)
                src.setStat('min', -1.0)
                setSource(src)
            }

            son.onPlay()
        } else {
            son?.onStop()
        }

        setStreaming(!streaming)
    }

    return (
        <>
            <Button onClick={handleConnect}>{bus?.connected ? 'Disconnect' : 'Connect'}</Button>
            {bus && (
                <Button onClick={handleStartStreaming} disabled={services.length === 0}>
                    {streaming ? 'Stop streaming' : 'Start streaming'}
                </Button>
            )}
        </>
    )
}

export default function Page() {
    return (
        <JacdacProvider initialBus={bus}>
            <ConnectButton />
        </JacdacProvider>
    )
}
