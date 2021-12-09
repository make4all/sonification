export enum SupportedSpecs { // types of data and sonification specification.
    vegaSpec,
}

export enum SupportedFormats { // support formats of input data.
    CSV,
}

export enum SonificationLevel { // similating aria-live ="polite","rude", etc. for sonification
    polite, //does not interrupt previously sonifying data.
    rude, // cancels all current sonifications and plays the current point
}
export enum SonificationType {
    Tone, // plays tone
    Noise, // plays noise
    NoiseHighlight, // plays both tone and noise for a point
}

export enum PlaybackState { // different states of the audio context.
    Playing,
    Paused, //when the context is suspended
    Stopped, //when playback ends. We can close the context once playback stops if necessary.
}