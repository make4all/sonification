import {Sonifier } from './sonifier'

import React, { useState } from 'react';


import { PlaybackState, SonificationLevel, SupportedFormats } from './constents';
import { ImportView } from './views/ImportView';
import { DataView } from './views/DataView';
import { Alert, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { DataManager } from './DataManager';


import { parseInput } from './sonificationUtils';
import { Readable } from 'stream';


export const Demo = () => {
    const [editorText, setEditorText] = useState(
        '100,200,300,400,500,600,700,800,900,800,700,600,500,400,300,200,100,500,400,300,200,900,500,600,700,800,900,300,400,500',
    )
    const [selectedFile, setSelectedFile] = useState<File>()
    const [isFilePicked, setIsFilePicked] = useState(false)

    const [fileName, setFileName] = useState<string>()
    const [sonificationOption, setSonificationOption] = useState<string>('simple')
    const [showHighlightValueEditor, setShowHighlightValueEditor] = useState(false)
    const [showRegionValueEditors, setShowRegionValueEditors] = useState(false)
    const [highlightPoint, setHighlightPoint] = useState(500)
    const [beginRegion, setBeginRegion] = useState(300)
    const [endRegion, setEndRegion] = useState(500)
    const [playButtonLabel, setPlayButtonLabel] = useState('play')

    const handleEditorChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (event.target.value) setEditorText(event.target.value)
    }

    const handelHighlightPointChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (event.target.value) setHighlightPoint(parseInt(event.target.value))
    }

    const handelBeginRegionChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (event.target.value) setBeginRegion(parseInt(event.target.value))
    }

    const handelEndRegionChange: React.ChangeEventHandler<HTMLTextAreaElement> | undefined = (
        event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
        if (event.target.value) setEndRegion(parseInt(event.target.value))
    }

    const playButtonHandeler = () => {
        let table = DataManager.getInstance().table;
        if (table) {
            // Hardcode getting the "Value" column from each data table, this will need to be set by user later
            let data = table.columns()['Value'].data;
        let sonifierInstance = Sonifier.getSonifierInstance()
        if (sonifierInstance) {
            console.log('sonifier instance is present. playback state', sonifierInstance.playbackState)
            if (
                sonifierInstance.playbackState == PlaybackState.Paused ||
                sonifierInstance.playbackState == PlaybackState.Playing
            ) {
                sonifierInstance.pauseToggle()
                return
            }
            if (sonifierInstance.playbackState == PlaybackState.Stopped)
                sonifierInstance.onPlaybackStateChanged = handelPlaybackStateChanged
            if (sonificationOption == 'simple') {
                console.log('playing simple tone')
                sonifierInstance.playSimpleTone(data)
            } else if (sonificationOption == 'highlightNoise') {
                sonifierInstance.playHighlightPointsWithNoise(data, highlightPoint)
            } else if (sonificationOption == 'highlightRegion') {
                sonifierInstance.playHighlightedRegionWithTones(data, beginRegion, endRegion)
            } else {
                throw console.error('not implemented')
            }
        }
    }


            
            
        }  
    


    const handelPushRudeData = () => {
        let sonifierInstance = Sonifier.getSonifierInstance()
        if (sonifierInstance) {
            for (let i = 0; i < 5; i++) {
                let dataPoint: number = Math.random()
                dataPoint = dataPoint * 10000
                sonifierInstance.SonifyPushedPoint(dataPoint, SonificationLevel.rude)
            }
        }
    }
    const handleSonificationSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('changed selection of sonification type', event.target.value)
        setSonificationOption(event.target.value) //help: this value is not updating.
        console.log('sonificationType', sonificationOption)
        if (event.target.value == 'highlightNoise') {
            console.log('debug: setting show highlight edit field')
            setShowHighlightValueEditor(true)
            setShowRegionValueEditors(false)
        } else if (event.target.value == 'highlightRegion') {
            setShowHighlightValueEditor(false)
            setShowRegionValueEditors(true)
        } else if (event.target.value == 'simple') {
            setShowRegionValueEditors(false)
            setShowHighlightValueEditor(false)
        } else {
            setShowRegionValueEditors(false)
            setShowHighlightValueEditor(false)
        }
        setSonificationOption(event.target.value)
    }

    const handelPlaybackStateChanged = (e: PlaybackState) => {
        console.log('handelPlaybackStateChanged', e)
        if (e == PlaybackState.Playing) setPlayButtonLabel('pause')
        else if (e == PlaybackState.Paused) setPlayButtonLabel('resume')
        else setPlayButtonLabel('play')
        console.log('returning. play button label', playButtonLabel)
    }

    return (
        <div>
            <h1> basic sonification demo</h1> 
            <div>
                <ImportView />
            </div>
            
            <div>
                <DataView />
            </div>

            <div>
                <textarea value={editorText}onChange={handleEditorChange}/> 
                {/* <Editor height="90vh" defaultLanguage="javascript" defaultValue={editorText} onChange={handleEditorChange} /> */}
                <FormControl component="fieldset">
                    <FormLabel component="legend">Select type of sonification.</FormLabel>
                    <RadioGroup aria-label="sonification" name="sonificationType" value={sonificationOption} onChange={handleSonificationSelection}>
                        <FormControlLabel value="simple" control={<Radio />} label="simple sonification" />
                        <FormControlLabel value="highlightNoise" control={<Radio />} label="highlight points with noise" />
                        <FormControlLabel value="highlightRegion" control={<Radio />} label="play tones for region" />
                    </RadioGroup>
                </FormControl>
                {showHighlightValueEditor&& (<textarea value={highlightPoint}onChange={handelHighlightPointChange}/>)}
                {showRegionValueEditors && (<textarea value={beginRegion}onChange = {handelBeginRegionChange}/>)}
                {showRegionValueEditors && (<textarea value={endRegion}onChange = {handelEndRegionChange}/>)}
                { !showHighlightValueEditor && !showRegionValueEditors && (<p> press play to hear a simple sonification</p>)}
                <button onClick={playButtonHandeler}>{playButtonLabel}</button>

                <p>Press the interrupt with random data button when a tone is playing to override what is playing with random data.</p>
                <button onClick={handelPushRudeData}>interrupt with random data</button>
            </div>
        </div>
    );

}
