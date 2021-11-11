
import * as vega from "vega"

import * as vegaEmbed from "vega-embed"
import { SupportedFormats, SupportedSpecs } from "./constents"
import { validateVegaSpec } from "./sonificationUtils"
import * as fs from "fs";
import csv from "csv-parser";
import { resourceLimits } from "worker_threads";


//import * as tone from "tone"
// import { View } from "vega";

console.log("test2")

export function hello() {
    return "please enter comma separated numeric values in the editor and press play. Please note that we currently do not have error checking and handeling for invalid inputs so please make sure to enter comma separated numbers only."
}

// let wrongSpec: vega.Spec  =  {
//   $schema: "https://vega.github.io/schema/vega-lite/v2.json",
//   data: {name: "table"},
//   width: 1152,
//   height: 720,
//   autosize: "fit",
//   mark:  {type: "line", interpolate: "monotone"},
//     encoding: {
//         x: { field: 'x', type: 'quantitative', scale: { zero: false} },
//         y: {field: 'y', type: 'quantitative'}}
// }
// Tried moving this to a separate file, into a string, but nothing worked. I need help understanding why this is the case.
let rankSpec: vega.Spec = {
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description:
        'A bar graph showing the scores of the top 5 students. This shows an example of the window transform, for how the top K (5) can be filtered, and also how a rank can be computed for each student.',
    width: 500,
    height: 200,
    padding: 5,
    autosize: 'pad',
    data: [
        {
            name: 'ranks',
            values: [
                { student: 'A', score: 100 },
                { student: 'B', score: 56 },
                { student: 'C', score: 88 },
                { student: 'D', score: 65 },
                { student: 'E', score: 45 },
                { student: 'F', score: 23 },
                { student: 'G', score: 66 },
                { student: 'H', score: 67 },
                { student: 'I', score: 13 },
                { student: 'J', score: 12 },
                { student: 'K', score: 50 },
                { student: 'L', score: 78 },
                { student: 'M', score: 66 },
                { student: 'N', score: 30 },
                { student: 'O', score: 97 },
                { student: 'P', score: 75 },
                { student: 'Q', score: 24 },
                { student: 'R', score: 42 },
                { student: 'S', score: 76 },
                { student: 'T', score: 78 },
                { student: 'U', score: 21 },
                { student: 'V', score: 46 },
            ],
            "transform": [
                { "type": "filter", "expr": "datum.score > 50" }
            ]
        },
    ],
}

// an other dataset. loads data from file. tried moving this also to file.
let carSpec: vega.Spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 400,
    "height": 200,
    "padding": 5,
  
    "data": [
      {
        "name": "cars",
        "url": "https://raw.githubusercontent.com/vega/vega/master/docs/data/cars.json"
      }
    ],
  
    "scales": [
      {
        "name": "xscale",
        "domain": {"data": "cars", "field": "Acceleration"},
        "range": "width"
      },
      {
        "name": "yscale",
        "domain": {"data": "cars", "field": "Miles_per_Gallon"},
        "range": "height"
      }
    ],
    "axes": [
      {"orient": "bottom", "scale": "xscale", "grid": true},
      {"orient": "left", "scale": "yscale", "grid": true}
    ],
    "marks": [
      {
        "type": "symbol",
        "from": {"data":"cars"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "Acceleration"},
            "y": {"scale": "yscale", "field": "Miles_per_Gallon"}
          }
        }
      }
    ]
  }

  export function validateSpec(specType:SupportedSpecs, spec: vega.Spec): boolean // need to decide if we want to expose validation to the frontend.
  {
    var isValid:boolean = false;
    if(specType == SupportedSpecs.vegaSpec){ // refactor to switch case when we have more specs supported.
      try{
        isValid = validateVegaSpec(spec) // need to change to spec. Also function always returns true.
      } catch {
        console.log("Validation error"); // doesn't seem to enter this code block.
      }

  }
  return isValid;
  }

  export function  parseVegaSpec(spec: vega.Spec)
  {
    const chart = new vega.View(vega.parse(spec),
    { renderer: 'none' }) // creating the vega.view object. setting renderer as none as we are not interested in viewing the output visualization.
var data;
var dataSetName:string; 
chart.runAsync().then(() =>{
  if(spec['data']){
for (let dataset of spec['data'])
dataSetName = dataset['name'];
data = chart.data(dataSetName);
  }  

   } ) // running so that the transforms happen
  return  data // todo. make sure this return happens after the promise.
  }
  // var dataSetName:string = '';
  var parsedChart = parseVegaSpec(carSpec);
  // console.log("chart.data:",carSpec['data'])
  // console.log("data",parsedChart);
  if(parsedChart)
  {
    // for(var dataSet of parsedChart){
    //   console.log("dataset name",dataSet['name'])
    //   dataSetName = dataSet['name']
    //   // console.log("dataset",parsedChart.data(dataSetName))
    // }
  }
  // console.log("data set name",carSpec['data']['name'])
  // console.log("car spec data",carSpec.data)
// let vegaSpec = vega.compile(rankSpec); // compiling to vega spec.

// console.log("is vega spec valid?",validateVegaSpec(carSpec));

export function parseInput(fileName: string | undefined, format: SupportedFormats) {
  console.log("in parseInput function");
  const results: any[] = []
  if(format == SupportedFormats.CSV)
  {
    console.log("format is CSV")
    if(fileName){
console.log("file name",fileName)
      var rs = fs.createReadStream(fileName)
rs.pipe(csv()).on('data',(data) => results.push(data) )
// .pipe(csv()).on('data',(data) => results.push(data)); 
console.log("parsed CSV data:",results);
  }
}
}

 

// console.log(chart)
/******resolved****** 
WebAudio now seems to work as it is being picked up from the type definitions of react.dom.ts. We will need to make sure we don't break this when we move away from react eventually.
Here is an example of WebAudio without react that is supposed to work, but didn't for me:
tutorial: https://itnext.io/building-a-synthesizer-in-typescript-5a85ea17e2f2
Code (we don't need to implement the tutorial)
https://github.com/kenreilly/typescript-synth-demo. We used a third-party library, refer to code in jen-audio branch if we need to in the future.
*/

//function that takes an array of numbers and sonifies them. This will evolve as we keep implementing more sonification features.
export function playTone(dummyData:number[]){
    console.log("playTone: sonifying data", dummyData)
    const audioCtx = new AudioContext(); // works without needing additional libraries. need to check this when we move away from react as it is currently pulling from react-dom.d.ts.
    let startTime = audioCtx.currentTime;
    
    let pointSonificationLength:number = 0.3;
    var previousFrequencyOfset = 50;
    for (let i = 0; i < dummyData.length; i++)
      {
        
        var frequencyOfset = 2* dummyData[i];
        // frequencyOfset = frequencyOfset%1000;
        
        console.log("frequency ofset", frequencyOfset);
        var osc = audioCtx.createOscillator();
        osc.frequency.value = previousFrequencyOfset;
        var endTime = startTime+pointSonificationLength;
        // console.log("start time ",startTime);
        // const wave = audioCtx.createPeriodicWave(wavetable.real, wavetable.imag); //keeping this line for future reference if we wish to use custom wavetables.
        // osc.setPeriodicWave(wave);
        osc.frequency.linearRampToValueAtTime(frequencyOfset,startTime+pointSonificationLength);
        // console.log(osc.frequency.value);
        // console.log(audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start(startTime)
        // console.log("started");
        osc.stop(endTime);
        // console.log("stopping");
        // console.log(audioCtx.currentTime);
        startTime = endTime;
        previousFrequencyOfset = frequencyOfset;

      }

}




function processData(data: { (name: string): any[]; (name: string, tuples: any): vega.View }): any {
  
  // data('hello');
  throw new Error("Function not implemented.")
}

