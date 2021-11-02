//Vue3
//removed unit choices, since data has been streamlined to not include alternative units

<template>
<div class='container-sm m-2 bg-white border rounded'>
    <div class="row m-0 justify-content-center" id="chart-canvas">
        <div class="col-12">
            <canvas id='graph-canvas' @mousedown="startLine" @mouseup="endDrag" @mousemove="endLine"></canvas>
        </div>
    </div>

    <div class="row justify-content-center align-items-center" id="chart-functions" @mousedown="setDraggable(false)" @mouseup="setDraggable(true)">
        
        <div class='col-md-5 m-2'>
            <div class='input-group'>
                <span class='input-group-text' for="gradient">Gradient:</span>
                <input class='form-control col-sm' id="gradient" :value="gradient.toFixed(2)" readonly > 
            </div>
        </div>
       
        <div class='col-md-5 m-2'>
            <div class='row d-flex justify-content-center mb-2'>
                <div class='col-auto'>
                    <div class='input-group'>
                        <span class='input-group-text' for="graph">Plot function: </span>
                        <select class='form-select form-select-sm' name="function" id="function" v-model="currentFunction">
                            <option value="linear">Linear</option>
                            <option value="quadratic">Quadratic</option>
                            <option value="trigonometric">Trigonometric</option>
                            <option value="exponential">Exponential</option>
                            <option v-if='getGraphDataParameter != "theta"' value="step">Step (1st Order)</option>
                            <option v-if='getGraphDataParameter != "theta"' value="ramp">Ramp (1st Order)</option>
                            <option v-if='getGraphDataParameter == "theta"' value="step2nd">Step (2nd Order)</option>
                        </select> 
                    </div>
                </div>
            </div>

            <div class='row d-flex justify-content-center'>
                
                <div v-if="currentFunction === 'linear'">
                    <div class='row justify-content-center mb-2'>
                        <img id='linear_function' src='../../public/images/LinearFunction.png'>
                    </div>

                    <div class='row d-flex justify-content-center'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">a = </label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>
                    <div class='row d-flex justify-content-center'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">b = </label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>
                       

                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(linear)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                </div>



                <div v-else-if="currentFunction === 'quadratic'">

                    <div class='row justify-content-center mb-2'>
                        <img id='linear_function' src='../../public/images/QuadraticFunction.png'>
                    </div>


                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">a = </label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>
                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">b = </label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(quadratic)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                </div>


                <div v-else-if="currentFunction === 'trigonometric'">

                    <div class='row justify-content-center mb-1'>
                        <img id='trig_function' src='../../public/images/TrigFunction.png'>
                    </div>


                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">A = </label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">&omega; = </label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_c">&phi; = </label>
                                <input class='form-control' id="func_c" v-model="func_c" size='3'>
                            </div>
                        </div>
                    </div>
            
                    

                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(trigonometric)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                </div>

                
                <div v-else-if="currentFunction === 'exponential'">

                    <div class='row justify-content-center'>
                        <img id='linear_function' src='../../public/images/ExpFunction.png'>
                    </div>


                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">A = </label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>
                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">b = </label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(exponential)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                </div>


                <div v-else-if="currentFunction === 'step'">
                    
                    <div class='row justify-content-center mb-1'>
                        <img id='transfer_function' src='../../public/images/VoltSpeedTransferFunction.png'>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">Step size, A<sub>v</sub> </label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">K = </label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_c">&tau; = </label>
                                <input class='form-control' id="func_c" v-model="func_c" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_d">t<sub>0</sub> = </label>
                                <input class='form-control' id="func_d" v-model="func_d" size='3'>
                            </div>
                        </div>
                    </div>
            
                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(step)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                    
                </div>


                <div v-else-if="currentFunction === 'step2nd'">

                    <div class='row justify-content-center mb-1'>
                        <img id='second_order_transfer_function' src='../../public/images/TransferFunction2ndOrder.png'>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">Step size, A</label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">&zeta; =</label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_c">&omega;<sub>n</sub> =</label>
                                <input class='form-control' id="func_c" v-model="func_c" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_d">t<sub>0</sub> =</label>
                                <input class='form-control' id="func_d" v-model="func_d" size='3'>
                            </div>
                        </div>
                    </div>
                
                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(step2nd)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                    
                </div>


                <div v-else-if="currentFunction === 'ramp'">

                    <div class='row justify-content-center mb-1'>
                        <img id='transfer_function' src='../../public/images/VoltSpeedTransferFunction.png'>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_b">Ramp gradient, A<sub>v</sub></label>
                                <input class='form-control' id="func_b" v-model="func_b" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_a">K =</label>
                                <input class='form-control' id="func_a" v-model="func_a" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_c">&tau; =</label>
                                <input class='form-control' id="func_c" v-model="func_c" size='3'>
                            </div>
                        </div>
                    </div>

                    <div class='row d-flex justify-content-center mb-1'>
                        <div class='col-auto'>
                            <div class='input-group'>
                                <label class='input-group-text' for="func_d">&omega;<sub>0</sub> =</label>
                                <input class='form-control' id="func_d" v-model="func_d" size='3'>
                            </div>
                        </div>
                    </div>


                    <div class="row-sm justify-content-center">
                        <button class="btn btn-success btn-xs m-1" id="plotFunctionButton" @click="plotFunc(ramp)">Plot</button>
                        <button class="btn btn-danger btn-xs m-1" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                    </div>
                </div>

            </div>
        </div>

    </div>

    <toolbar parentCanvasID="graph-canvas" parentComponentName="graph" parentDivID="graph" :showDownload='true' :showPopupHelp="true" :showOptions="false">  
        
        <template v-slot:popup id='graph-popup'>
            <div class='row mb-2' id='gradient-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/gradient.png'>
                </div>
                <div class='col-8'>
                    <h3> Gradient tool </h3>
                    <p> Click and drag on the graph in order to draw a straight line segment. The gradient of this line is displayed in the Gradient box.</p>
                </div>
            </div>

            <div class='row mb-2' id='data-point-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/GraphDataPoint.png'>
                </div>
                <div class='col-8'>
                    <h3> Interactive data points </h3>
                    <p> Hover over a data point to get the exact values. If the 'Data Table' component is open, click a data point to go to the corresponding line in 
                        the data table.
                    </p>
                </div>

            </div>

            <div class='row mb-2' id='functions-div'>
                <div class='col-4'>
                    <img class='popup-image' src='../../public/images/function-plotting.png'>
                </div>
                <div class='col-8'>
                    <h3> Function Plotting </h3>
                    <p> Select the function type from the dropdown menu. Input the corresponding function parameters. Angular parameters are in radians. Click plot to display the function.
                        The function is plotted up to the maximum time value on the x-axis.
                    </p>
                </div>

            </div>
        </template>
    </toolbar>
</div>

</template>

<script>

import { Chart } from 'chart.js';
import { mapGetters, mapActions } from 'vuex';
import Toolbar from "./elements/Toolbar.vue";

export default {
    
    name: 'GraphOutput',
    emits: ['newselectedgraphpoint'],
    components:{
        Toolbar,
    },
    data(){
        return{
            chart: null,
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
            maxDataPoints: 1200,
            current_data_index: 0,
            data_index_interval: 100,
            latest_index: 0,
        }
    },
    mounted() {
        this.createChart();
        this.getAllData();
        this.updateChart();
      },
    computed:{
        ...mapGetters([
            'getData',
            'getGraphDataParameter',
            'getNumData',
            'getIsRecording',
        ]),
      },
    watch:{
        getData(){
            this.clearData(); //only runs if data array gets reset to [];
        }
    },
    methods: {
        ...mapActions([
            'setDraggable'
        ]),
        updateChart(){
            
            let max_index = this.getNumData - 1;
            if(max_index < this.maxDataPoints){
                if(this.latest_index < max_index && this.getIsRecording){
                    console.log('getting data');
                    for(let i=this.latest_index; i < max_index; i++){
                        this.getDataAtIndex(i);
                    }
                    this.latest_index = max_index;
                    this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.getGraphDataParameter;
                    this.chart.update(0);                       //actually updating the chart moved to here!
                    
                } 
            } 

            setTimeout(this.updateChart, 20);
        },
        createChart() {
            var _this = this;
            const canvas = document.getElementById('graph-canvas');
            const ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'graph',
                    data: [],
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
                                _this.updateXAxisMax(value, index, values);
                                _this.updateXAxisMin(value, index);
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
                            labelString: _this.getGraphDataParameter
                        },
                        type: 'linear',
                        position: 'left',
                        ticks: {
                            callback : (value,index,values) => {
                                _this.updateYAxisMax(value, index);
                                _this.updateYAxisMin(value, index, values);
                                return value;
                            }
                        },
                        sampleSize: 2,
                    }],
                },
                responsive: true
            }
        });

            canvas.onclick = function(event){
                let active_points = _this.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, false);
                if(active_points[0]){
                    _this.$emit('newselectedgraphpoint', active_points[0]._index);       //data point selected so send event to let other elements know.
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
            try{
                this.chart.data.datasets[0].data.push(data);
            } catch(e){
                console.log(e);
            }
            
        },
        clearData(){
            this.latest_index = 0;          //NEW
            
            this.chart.destroy();
            this.createChart();
        },
        getAllData(){
            if(this.current_data_index == 0){
                this.clearData();
                
            }
            let _current_index = this.current_data_index;
            for(let i=_current_index; i<this.getNumData;i++){
                let data = this.getData[i];
                let x_data = data.t;
                let y_data;
                switch(this.getGraphDataParameter){
                    case 'theta':
                        y_data = data.theta;
                        break;
                    case 'omega':
                        y_data = data.omega;
                        break;

                }
                this.addDataToChart({x: x_data, y: y_data});

                if(i >= this.current_data_index + this.data_index_interval || i == this.getNumData - 1){
                    this.current_data_index = i + 1;
                    break;
                }
                
            }

                if(this.current_data_index < this.getNumData && this.current_data_index <= this.maxDataPoints){
                    setTimeout(this.getAllData, 20);
                    this.chart.update(0);
                } else{
                    this.chart.update(0);
                    this.count = 0;
                    this.current_data_index = 0;
                }
                
            
        },
        getLatestData(){
            let index = this.getNumData - 1;
            let y_data;
            if(index >= 0){
                let data = this.getData[index];
                let x_data = data.t;
                switch(this.getGraphDataParameter){
                    case 'theta':
                        y_data = data.theta;
                        break;
                    case 'omega':
                        y_data = data.omega;
                        break;

                    }
                    this.addDataToChart({x: x_data, y: y_data});
                } 
            
        },
        getDataAtIndex(index){
            let y_data;
            if(index >= 0){
                let data = this.getData[index];
                let x_data = data.t;
            
                switch(this.getGraphDataParameter){
                    case 'theta':
                        y_data = data.theta;
                        break;
                    case 'omega':
                        y_data = data.omega;
                        break;

                    }
                    this.addDataToChart({x: x_data, y: y_data});
                } 
        },
        removeChart(){
            this.chart.destroy();
        },
        startLine(event){
            event.preventDefault();
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
                let canvas = document.getElementById('graph-canvas');
                let canvas_height = canvas.clientHeight - canvas_offset;
                let canvas_width = canvas.clientWidth;
                let canvas_ratio = canvas_height/canvas_width;      //canvas ratio
                
                let y_diff = this.YAxisMax - this.YAxisMin;
                let x_diff = this.XAxisMax - this.XAxisMin;
                let axis_ratio = y_diff/x_diff;         //axis ratio

                if(this.getNumData > 1){
                    this.gradient = axis_ratio*pointer_ratio/canvas_ratio;
                    this.drawLine(this.gradient_start_point, this.gradient_end_point);
                }
            }
            
        },
        drawLine(from, to){
            
            //draw the gradient line
            //only draw anything if at least 2 data points have been plotted
            let canvas = document.getElementById('graph-canvas');
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
        step2nd(t){
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

/* #plotFunctionButton       {background-color: #4CAF50FF; color: rgb(255, 255, 255)}
#plotFunctionButton:hover {background-color: #3e8e41} 

#clearFunctionButton        {background-color: #e13131ff; color: rgb(255, 255, 255)}
#clearFunctionButton:hover {background-color: #cc1e1eff;} */

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
