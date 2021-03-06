import assert from 'assert'
import { Datum } from '../Datum'
import { Sonify } from './Sonify'
/**
 * Abstract class for sonifying a data point as a pitch.
 * @extends Sonify
 * @todo only plays noise once. investigate further. probably have to create new noise nodes for each point.
 *
 */
export abstract class SonifyFixedDuration extends Sonify {
    /** duration in seconds */
    protected duration = 0.1

    /** StartTime is undefined if the node isn't playing */
    private startTime: number | undefined = undefined

    /**
     * Creates a Fixed Duration sound output.
     * @param volume The level to play at
     * @param audioNode An audio node to connect up to make sounds
     * @param duration How long the node should play for
     */
    constructor(audioNode?: AudioScheduledSourceNode, duration?: number,pan:number=0) {
        super(audioNode,pan)
        if (duration) this.duration = duration
    }

    /**
     * Set the audio node.
     */
    protected set audioNode(value: AudioNode | undefined) {
        if (value as AudioScheduledSourceNode) this.audioNode = value
        else throw new Error('Fixed duration nodes must be AudioScheduledSourceNode')
    }

    /**
     * Call extend if the audio node is still playing
     * Otherwise just show this data point
     */
    output(datum: Datum): void {
        if (this.startTime) {
            let timePlayed = SonifyFixedDuration.audioCtx.currentTime - this.startTime
            let timeLeft = this.duration - timePlayed
            this.extend(timeLeft + this.duration)
        } else {
            let node = this.create(datum)
            node.onended = () => this.resetAudioNode()
        }
    }

    /**
     * Create a new output for this datum
     */
    protected abstract create(datum: Datum): AudioScheduledSourceNode

    /**
     * Extend the time the audio node is playing for
     * Must be defined for this to work, is node specific
     */
    protected abstract extend(timeAdd: number)

    /**
     * Reset audio node to undefined.
     * useful for sonifications that need a new node every time. e.g. noise and potentially speech.
     */
    public resetAudioNode() {
        this.outputNode = undefined
        this.startTime = undefined
    }
}
