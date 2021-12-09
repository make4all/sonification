import React from 'react';

import { TextField } from '@mui/material';
import { IDemoView } from './IDemoView';
import { Sonifier } from '../../sonifier';

export interface DemoHighlightRegionState {
    minValue: number;
    maxValue: number;
};

export interface DemoHighlightRegionProps {
    dataSummary: any;
};

export class DemoHighlightRegion extends React.Component<DemoHighlightRegionProps, DemoHighlightRegionState> implements IDemoView {
    constructor(props: DemoHighlightRegionProps) {
        super(props);
        this.state = {
            minValue: this.props.dataSummary.min,
            maxValue: this.props.dataSummary.max,
        };
    }

    public onPause = (data: any) => {
        
    };

    public onPlay = (data: any) => {
        let sonifierInstance  = Sonifier.getSonifierInstance();
        let { minValue, maxValue } = this.state;
        sonifierInstance.playHighlightedRegionWithTones(data, minValue, maxValue);
    };

    public render() {
        const { minValue, maxValue } = this.state;

        return (
            <div>
                <TextField
                    id="text-min-value"
                    aria-label="Enter minimum value"
                    label="Min"
                    variant="outlined"
                    type="number"
                    value={ (isNaN(minValue) ? '' : minValue ) }
                    onChange={ (e) => (this._handleValueChange(parseFloat(e.target.value), 'min')) }
                    />
                <TextField
                    id="text-max-value"
                    aria-label="Enter maximum value"
                    label="Max"
                    variant="outlined"
                    type="number"
                    value={ (isNaN(maxValue) ? '' : maxValue ) }
                    onChange={ (e) => (this._handleValueChange(parseFloat(e.target.value), 'max')) }
                    />
            </div>
        );
    }

    public componentDidUpdate(prevProps: DemoHighlightRegionProps) {
        // When the data summary changes, update the min & max value
        if (this.props.dataSummary.min !== prevProps.dataSummary.min
            || this.props.dataSummary.max !== prevProps.dataSummary.max) {
            let minValue = this.props.dataSummary.min,
                maxValue = this.props.dataSummary.max;
            this.setState({ minValue, maxValue });
        }
    }

    // componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
    // Initialization that requires DOM nodes should go here. If you need to load data from a remote endpoint,
    // this is a good place to instantiate the network request.
    public componentDidMount() {
        
    }

    // componentWillUnmount() is invoked immediately before a component is unmounted and destroyed.
    // Perform any necessary cleanup in this method, such as invalidating timers, canceling network requests,
    // or cleaning up any subscriptions
    public componentWillUnmount() {
        
    }

    private _handleValueChange = (value: number, which: string) => {
        switch(which) {
            case 'min':
                this.setState({ minValue: value });
                break;
            case 'max':
                this.setState({ maxValue: value });
                break;
        }
    }
}