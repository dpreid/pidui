<template>
<div class='container-sm m-2 bg-white border rounded'>
    <div class="row m-0 justify-content-center" id="chart-canvas">
        <div class="col-12">
            <canvas :id="id" @mousedown="startLine" @mouseup="endDrag" @mousemove="endLine"></canvas>
        </div>
    </div>

    <div class="row mb-2 justify-content-center align-items-center" id="chart-functions">
        <div class='form-group col-3'>
            <label class='m-2' for="unitSelect">Units:</label>
            <select class='col-sm' name="unitSelect" id="unitSelect" v-model="unit" @change="getAllData">
                <option v-if='getGraphParameter == "theta"' value="rad">rad</option>
                <option v-if='getGraphParameter == "theta"' value="deg">deg</option>
                <option v-if='getGraphParameter == "omega"' value="rpm">RPM</option>
                <option v-if='getGraphParameter == "omega"' value="rad/s">rad/s</option>
            </select> 
        </div>

        <div class='form-group col-3'>
            <label class='m-2' for="gradient">Gradient:</label>
            <input class='col-sm' id="gradient" :value="gradient" readonly> 
        </div>
       
        
        <div class='form-group col-6'>
            <label class='m-2' for="graph">Plot function: </label>
            <select class='col-sm-4' name="function" id="function" v-model="currentFunction">
                <option value="linear">Linear</option>
                <option value="quadratic">Quadratic</option>
                <option value="trigonometric">Trigonometric</option>
                <option value="exponential">Exponential</option>
                <option v-if='getGraphParameter == "omega"' value="step">Step (1st Order)</option>
                <option v-if='getGraphParameter == "omega"' value="ramp">Ramp (1st Order)</option>
                <option v-if='getGraphParameter == "theta"' value="step2nd">Step (2nd Order)</option>
            </select> 

            <div v-if="currentFunction === 'linear'">
               
                <div class='row justify-content-center'>
                    <img id='linear_function' src='../../public/images/LinearFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">a = </label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input id="func_b" v-model="func_b" size="3">                
                    </div>
                </div>

                <!-- <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">x + </label>
                <input id="func_b" v-model="func_b" size="3">  -->


                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(linear)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
                <div v-else-if="currentFunction === 'quadratic'">

                    <div class='row justify-content-center'>
                    <img id='linear_function' src='../../public/images/QuadraticFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">a = </label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input id="func_b" v-model="func_b" size="3">                
                    </div>
                </div>

                <!-- <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">x<sup>2</sup> + </label>
                <input id="func_b" v-model="func_b" size="3">  -->
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(quadratic)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'trigonometric'">

                <div class='row justify-content-center'>
                    <img id='trig_function' src='../../public/images/TrigFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">A</label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    
                    <div>
                        <label class='m-2' for="func_b">&omega;</label>
                        <input id="func_b" v-model="func_b" size="3">
                    </div>

                    <div>
                        <label class='m-2' for="func_c">&phi;</label>
                        <input id="func_c" v-model="func_c" size="3">                
                    </div>
                </div>

                <!-- <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="2">
                <label class='m-2' for="func_b">sin(</label>
                <input id="func_b" v-model="func_b" size="2"> 
                <label class='m-2' for="func_c"> t + </label>
                <input id="func_c" v-model="func_c" size="2"> 
                <label class='m-2'> ) </label> -->
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(trigonometric)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'exponential'">

                 <div class='row justify-content-center'>
                    <img id='linear_function' src='../../public/images/ExpFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">A = </label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_b">b = </label>
                        <input id="func_b" v-model="func_b" size="3">                
                    </div>
                </div>

                <!-- <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">exp(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> t)</label> -->
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(exponential)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'step'">
                
                 <div class='row justify-content-center'>
                    <label class='m-2' for="func_b">Step size, A<sub>v</sub></label>
                    <input id="func_b" v-model="func_b" size="3">
                </div>

                <div class='row justify-content-center'>
                    <img id='transfer_function' src='../../public/images/VoltSpeedTransferFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">K</label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_c">&tau;</label>
                        <input id="func_c" v-model="func_c" size="3">                
                    </div>

                    <div>
                        <label class='m-2' for="func_d">t<sub>0</sub></label>
                        <input id="func_d" v-model="func_d" size="3">                
                    </div>
                </div>
                <!-- <label class='m-2' for="func_a">Y(s)=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">/s(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> s+1)</label>
                
                <label class='m-2' for='func_c'> t0 = </label>
                <input id="func_c" v-model="func_c" size="3">  -->
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(step)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
                
            </div>
            <div v-else-if="currentFunction === 'step2nd'">
                
                 <div class='row justify-content-center'>
                    <label class='m-2' for="func_a">Step size, A</label>
                    <input id="func_a" v-model="func_a" size="3">
                </div>

                <div class='row justify-content-center'>
                    <img id='second_order_transfer_function' src='../../public/images/TransferFunction2ndOrder.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_b">&zeta;</label>
                        <input id="func_b" v-model="func_b" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_c">&omega;<sub>n</sub></label>
                        <input id="func_c" v-model="func_c" size="3">                
                    </div>

                    <div>
                        <label class='m-2' for="func_d">t<sub>0</sub></label>
                        <input id="func_d" v-model="func_d" size="3">                
                    </div>
                </div>
               
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(stepSecondOrder)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
                
            </div>
            <div v-else-if="currentFunction === 'ramp'">

                <div class='row justify-content-center'>
                    <label class='m-2' for="func_b">Ramp gradient, A<sub>v</sub></label>
                    <input id="func_b" v-model="func_b" size="3">
                </div>

                <div class='row justify-content-center'>
                    <img id='transfer_function' src='../../public/images/VoltSpeedTransferFunction.png'>
                </div>


                <div class='row justify-content-center'>
                    <div>
                        <label class='m-2' for="func_a">K</label>
                        <input id="func_a" v-model="func_a" size="3">
                    </div>
                    

                    <div>
                        <label class='m-2' for="func_c">&tau;</label>
                        <input id="func_c" v-model="func_c" size="3">                
                    </div>

                    <div>
                        <label class='m-2' for="func_d">&omega;<sub>0</sub></label>
                        <input id="func_d" v-model="func_d" size="3">                
                    </div>
                </div>

                <!-- <label class='m-2' for="func_a">Y(s)=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">/s^2(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> s+1)</label>
                <label class='m-2' for='func_c'> t0 = </label>
                <input id="func_c" v-model="func_c" size="3"> 
                <label class='m-2' for='func_d'> w0 = </label>
                <input id="func_d" v-model="func_d" size="3">  -->
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs m-1" id="plotFunctionButton" @click="plotFunc(ramp)">Plot</button>
                    <button class="btn btn-default btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
        </div>

    </div>
</div>

</template>

<script>
import { store } from "../simplestore.js";
import { Chart } from 'chart.js';
import { eventBus } from "../main.js";

export default {
    
    name: 'GraphOutput',
    props: ['type', 'id'],
    data(){
        return{
            dataStore: store,
            chart: null,
            chartData: [],
            gradient_start_point: {x:0, y:0},
            gradient_end_point: {x:0, y:0},
            gradient: 0,
            mouseDragging: false,
            currentFunction: "linear",
            func_a: 0,
            func_b: 0,
            func_c: 0,
            func_d:0,
            funcTimeStep: 0.01,
            YAxisMax: 0,
            YAxisMin: 0,
            XAxisMax: 0,
            XAxisMin: 0,
            unit: '',
            maxDataPoints: 1200,
            current_data_index: 0,
            data_index_interval: 100,
            latest_index: 0,
            max_reached: false,
        }
    },
    computed:{
            getCurrentMode(){
                //console.log(this.dataStore.state.currentMode);
                let data = this.dataStore.state.currentMode;
                return data;
            },
            getGraphParameter(){
                return store.state.graphDataParameter;
            },
            // newData(){
            //     return this.dataStore.state.data;
            // }

      },
      mounted() {
        this.createChart();
        this.getAllData();

        this.updateChart();
        //setInterval(this.updateChart, 20);                //TESTING

        //set default unit
        if(store.state.graphDataParameter == 'theta'){
            this.unit = 'rad';
        } else{
            this.unit = 'rad/s';
        }
      },
      created(){
        eventBus.$on('newgraphadded', this.chartAdded);
        eventBus.$on('clearalldata', this.clearData )
        

      },
    watch:{
        getGraphParameter(){
            if(store.state.graphDataParameter == 'theta'){
                this.unit = 'rad';
            } else{
                this.unit = 'rad/s';
            }
        },
        // newData(){
        //     if(store.getNumData() <= this.maxDataPoints){
        //         this.getLatestData();
        //     } else{
        //         eventBus.$emit('maxdatapointsreached');
        //     }
            
        // }
    },
    methods: {
        // updateChart(){
        //     let max_index = store.getNumData() - 1;
        //     if(max_index < this.maxDataPoints){
        //         if(this.latest_index < max_index && store.state.isRecording){
        //             this.getLatestData();
        //             //this.getDataAtIndex(this.latest_index);
        //             this.latest_index = max_index;
        //             //this.latest_index++;
        //         } 
        //     } else if(!this.max_reached){
        //         eventBus.$emit('maxdatapointsreached');
        //         console.log('max reached');
        //         this.max_reached = true;
        //     }

        //     setTimeout(this.updateChart, 20);
        // },
         updateChart(){
            let max_index = store.getNumData() - 1;
            if(max_index < this.maxDataPoints){
                if(this.latest_index < max_index && store.state.isRecording){
                    for(let i=this.latest_index; i < max_index; i++){
                        this.getDataAtIndex(i);
                    }
                    this.latest_index = max_index;
                    this.chart.update(0);                       //actually updating the chart moved to here!
                    this.chart.options.scales.yAxes[0].scaleLabel.labelString = store.state.graphDataParameter;
                } 
            } else if(!this.max_reached){
                eventBus.$emit('maxdatapointsreached');
                console.log('max reached');
                this.max_reached = true;
            }

            setTimeout(this.updateChart, 20);
        },
        createChart() {
            const canvas = document.getElementById(this.id);
            const ctx = canvas.getContext('2d');
            var scatterChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: this.type,
                    data: this.chartData,
                    pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                }]
            },
            options: {
                animation: false,
                parsing: false,
                legend:{
                    display: false
                },
                scales: {
                    xAxes: [{
                        scaleLabel:{
                            display: true,
                            labelString: 'time/s'
                        },
                        type: 'linear',
                        position: 'bottom',
                        ticks: {
                            callback : (value,index,values) => {
                                this.updateXAxisMax(value, index, values);
                                this.updateXAxisMin(value, index);
                                return value;
                            },
                            
                        },
                        minRotation: 20,
                        maxRotation: 20,
                        sampleSize: 2,
                    }],
                    yAxes: [{
                        scaleLabel:{
                            display: true,
                            labelString: store.state.graphDataParameter
                        },
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            callback : (value,index,values) => {
                                this.updateYAxisMax(value, index);
                                this.updateYAxisMin(value, index, values);
                                return value;
                            }
                        },
                        sampleSize: 2,
                    }],
                },
                responsive: true
            }
        });
            this.chart = scatterChart;

            canvas.onclick = function(event){
                let active_points = scatterChart.getElementsAtEvent(event);
                if(active_points[0]){
                    eventBus.$emit('newselectedobject', active_points[0]._index);       //data point selected so send event to let other elements know.
                }
                
            };
        },
        updateYAxisMax(value, index){
            if(index == 0){
                this.YAxisMax = value;
            }
            
        },
        updateYAxisMin(value,index,values){
            if(index == values.length - 1){
                this.YAxisMin = value;
            }
        },
        updateXAxisMin(value, index){
            if(index == 0){
                this.XAxisMin = value;
            }
            
        },
        updateXAxisMax(value,index,values){
            if(index == values.length - 1){
                this.XAxisMax = value;
            }
        },
        addDataToChart(data) {
            // this.chart.data.datasets.forEach((dataset) => {
            //     dataset.data.push(data);
            // });
            this.chart.data.datasets[0].data.push(data);
            //this.chart.update(0);       //instantly update with 0 parameter, no animation - moved from here to the chart update
            // this.chart.options.scales.yAxes[0].scaleLabel.labelString = store.state.graphDataParameter;
        },
        clearData(){
            this.latest_index = 0;          //NEW
            this.max_reached = false;          //NEW
            this.chartData = [];
            this.chart.data.datasets[0].data = this.chartData;
            //this.chart.reset();
            this.chart.update();
        },
        // getData(){
        //         this.clearData();
                
        //         //for(let i=0; i<this.$store.getters.getNumData;i++){
        //         for(let i=0; i<store.state.data.length;i++){
        //             //let data = this.$store.getters.getData[i];
        //             let x_data = store.state.data[i].t;
        //             let y_data;
        //             //let x_data = data.t;
        //             switch(store.state.graphDataParameter){
        //                 case 'theta':
        //                     if(this.unit == 'deg'){
        //                         y_data = store.state.data[i].theta_deg;
        //                     } else {
        //                         y_data = store.state.data[i].theta;
        //                     }
        //                     break;
        //                 case 'omega':
        //                     if(this.unit == 'rpm'){
        //                         y_data = store.state.data[i].omega;
        //                     } else{
        //                         y_data = store.state.data[i].omega_rad;
                                
        //                     }
        //                     break;

        //             }
        //             this.addDataToChart({x: x_data, y: y_data});
                    
        //         }
                
        //     },
            getAllData(){
                if(this.current_data_index == 0){
                    this.clearData();
                    
                }
                
                
                //for(let i=0; i<this.$store.getters.getNumData;i++){
                for(let i=this.current_data_index; i<store.getNumData();i++){
                    
                    let x_data = store.state.data[i].t;
                    let y_data;
                    switch(store.state.graphDataParameter){
                        case 'theta':
                            if(this.unit == 'deg'){
                                y_data = store.state.data[i].theta_deg;
                            } else {
                                y_data = store.state.data[i].theta;
                            }
                            break;
                        case 'omega':
                            if(this.unit == 'rpm'){
                                y_data = store.state.data[i].omega;
                            } else{
                                y_data = store.state.data[i].omega_rad;
                                
                            }
                            break;

                    }
                    this.addDataToChart({x: x_data, y: y_data});

                    if(i >= this.current_data_index + this.data_index_interval || i == store.getNumData() - 1){
                        this.current_data_index = i + 1;
                        //console.log("broke from get data");
                        break;
                    }
                    
                }

                    if(this.current_data_index < store.getNumData() && this.current_data_index <= this.maxDataPoints){
                        setTimeout(this.getAllData, 20);
                        this.chart.update(0);
                    } else{
                        if(this.current_data_index > this.maxDataPoints){
                            eventBus.$emit('maxdatapointsreached');
                        }
                        this.chart.update(0);
                        console.log('finished loading graph data');
                        this.count = 0;
                        this.current_data_index = 0;
                    }
                    
                
            },
            getLatestData(){
                let index = store.getNumData() - 1;
                let y_data;
                if(index >= 0){
                    
                    let x_data = store.state.data[index].t;
    
                    switch(store.state.graphDataParameter){
                            case 'theta':
                            if(this.unit == 'deg'){
                                y_data = store.state.data[index].theta_deg;
                            } else {
                                y_data = store.state.data[index].theta;
                                
                            }
                            break;
                        case 'omega':
                            if(this.unit == 'rpm'){
                                y_data = store.state.data[index].omega;
                            } else{
                                y_data = store.state.data[index].omega_rad;
                            }
                            break;

                        }
                        this.addDataToChart({x: x_data, y: y_data});
                    } else{
                        //console.log("no data");
                    }
                
            },
            getDataAtIndex(index){
                let y_data;
                if(index >= 0){
                   
                    let x_data = store.state.data[index].t;
                
                    switch(store.state.graphDataParameter){
                            case 'theta':
                            if(this.unit == 'deg'){
                                y_data = store.state.data[index].theta_deg;
                            } else {
                                y_data = store.state.data[index].theta;
                                
                            }
                            break;
                        case 'omega':
                            if(this.unit == 'rpm'){
                                y_data = store.state.data[index].omega;
                            } else{
                                y_data = store.state.data[index].omega_rad;
                            }
                            break;

                        }
                        this.addDataToChart({x: x_data, y: y_data});
                    } else{
                        //console.log("no data");
                    }
            },
            removeChart(){
                this.chart.destroy();
            },
            startLine(event){
                this.gradient_start_point.x = event.offsetX;
                this.gradient_start_point.y = event.offsetY;

                this.mouseDragging = true;
                
            },
            endDrag(){
                this.mouseDragging = false;
            },
            endLine(event){
                if(this.mouseDragging){
                    //get ratio of y axis to x axis scales, get ratio of y difference in mouse positions and x difference in mouse positions.
                    this.gradient_end_point.x = event.offsetX;
                    this.gradient_end_point.y = event.offsetY;

                    let pointer_ratio = (this.gradient_start_point.y - this.gradient_end_point.y) / (this.gradient_end_point.x - this.gradient_start_point.x);  //pointer ratio

                    let canvas_offset = 32;         //might need to change/check this 
                    let canvas = document.getElementById(this.id);
                    let canvas_height = canvas.clientHeight - canvas_offset;
                    let canvas_width = canvas.clientWidth;
                    let canvas_ratio = canvas_height/canvas_width;      //canvas ratio
                    
                    let y_diff = this.YAxisMax - this.YAxisMin;
                    let x_diff = this.XAxisMax - this.XAxisMin;
                    let axis_ratio = y_diff/x_diff;         //axis ratio

                    if(this.chartData.length > 1){
                        this.gradient = axis_ratio*pointer_ratio/canvas_ratio;
                        this.drawLine(this.gradient_start_point, this.gradient_end_point);
                    }
                }
                
            },
            drawLine(from, to){
                
                //draw the gradient line
                //only draw anything if at least 2 data points have been plotted
                let canvas = document.getElementById(this.id);
                const context = canvas.getContext('2d');
                context.clearRect(0, 0, canvas.width, canvas.height);
                this.chart.update(0);       //instantly update with no animation

                context.beginPath(); 
                // Staring point 
                context.moveTo(from.x, from.y);
                // End point 
                context.lineTo(to.x, to.y);
                context.lineWidth = 5;
                // set line color
                context.strokeStyle = 'red';
                // Make the line visible
                context.stroke();
                
            },
            plotFunc(func){
                // let min = store.getMinTime();
                // let max = store.getMaxTime();
                let min = this.XAxisMin;
                let max = this.XAxisMax;
                let t_delta = max-min;
                let num_plots = t_delta/this.funcTimeStep;
                let new_data = [];
                let new_t;
                let new_y;
                for(let i=0; i<num_plots;i++){
                    new_t = min + i*this.funcTimeStep;
                    new_y = func(new_t);
                    let data = {
                        x: new_t,
                        y: new_y
                    };
                    new_data.push(data);
                }
                
                this.addNewDataSet('rgba(255, 0, 0, 0.5)', new_data);
            },
            linear(t){
                return (parseFloat(this.func_a)*t + parseFloat(this.func_b));
            },
            quadratic(t){
                return parseFloat(this.func_a)*t*t + parseFloat(this.func_b);
            },
            trigonometric(t){
                return parseFloat(this.func_a)*Math.sin(parseFloat(this.func_b)*t + parseFloat(this.func_c));
            },
            exponential(t){
                return parseFloat(this.func_a)*Math.exp(parseFloat(this.func_b)*t);
            },
            step(t){
                //let A = parseFloat(store.state.step.step_size);
                let t0 = parseFloat(this.func_d);
                //let t0 = 0.0;
                //let w0 = -parseFloat(this.func_a)*A*(1-Math.exp(t0/parseFloat(this.func_b)));
                //let t0 = 0;
                let expterm = 1 - Math.exp(-(t-t0)/parseFloat(this.func_c));

                if(t < t0){
                    return 0;
                } else{
                    return parseFloat(this.func_a)*parseFloat(this.func_b)*expterm; 
                }
                
            },
            stepSecondOrder(t){
                let t0 = parseFloat(this.func_d);
                let t_norm = t - t0;
                let zeta = parseFloat(this.func_b);
                let omega = parseFloat(this.func_c);
                let step = parseFloat(this.func_a);
                let phi = Math.acos(zeta);

                let root_term = Math.sqrt(1-zeta*zeta);
                let exp_term = Math.exp(-zeta*omega*t_norm);
                let sin_term = Math.sin(root_term*omega*t_norm + phi);

                if(t < t0){
                    return 0;
                } else{
                    return step*(1 - exp_term*sin_term/root_term);
                }
                
            },
            ramp(t){
                //let A = parseFloat(store.state.ramp.ramp_gradient);
                let tau = parseFloat(this.func_c);
                let K = parseFloat(this.func_a)*parseFloat(this.func_b);
                //let t0 = parseFloat(this.func_c);
                let t0 = 0.0;
                let w0 = parseFloat(this.func_d);
                
                if(t < t0){
                    return w0;
                } else{
                    return K*((t-t0) - tau + tau*Math.exp(-(t-t0)/tau)) + w0;
                }
                
            },
            addNewDataSet(colour, data){
                this.chart.data.datasets.push({
                    label:"plotted function",
                    pointBackgroundColor: colour,
                    data: data
                    });
                this.chart.update(0);
            },
            deleteFunctionDataset(){
                this.chart.data.datasets = this.chart.data.datasets.filter(set => set.label !== "plotted function");
                this.chart.update(0);
            },
            

      },
      
}
</script>



<style scoped>

#transfer_function{
    width: 120px;
    height: 50px;
}

#second_order_transfer_function{
    width: 160px;
    height: 50px;
}

#linear_function{
    width: 120px;
    height: 30px;
}

#trig_function{
    width: 150px;
    height: 30px;
}

#plotFunctionButton       {background-color: #4CAF50FF; color: rgb(255, 255, 255)}
#plotFunctionButton:hover {background-color: #3e8e41} 

#clearFunctionButton        {background-color: #e13131ff; color: rgb(255, 255, 255)}
#clearFunctionButton:hover {background-color: #cc1e1eff;}

#clearButton  {background-color: #e17a31ff;}
#clearButton:hover  {background-color: #cc661eff;}

#outputButton        {background-color: #e1b131ff;}
#outputButton:hover  {background-color: #cc9d1eff;}

label {
    font-size:16px;
    color: #0501f7;
    font-weight: bold;
    display: inline-block;
    /* vertical-align: middle; */
    /* width: 20px; */
    /* padding-top: 20px; */
    /* float: left; */
}

select{
    color: white;
    padding-top: 5px;
    padding-bottom: 5px;
    
    background-color: #4490d8;
}


</style>
