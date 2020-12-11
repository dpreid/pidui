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
            <select class='col-sm' name="unitSelect" id="unitSelect" v-model="unit" @change="getData">
                <option v-if='getGraphParameter == "theta"' value="radians">rads</option>
                <option v-if='getGraphParameter == "theta"' value="degrees">degs</option>
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
                <option v-if='getGraphParameter == "omega"' value="step">Step</option>
                <option v-if='getGraphParameter == "omega"' value="ramp">Ramp</option>
            </select> 

            <div v-if="currentFunction === 'linear'">
                <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">x + </label>
                <input id="func_b" v-model="func_b" size="3"> 
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(linear)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
                <div v-else-if="currentFunction === 'quadratic'">
                <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">x<sup>2</sup> + </label>
                <input id="func_b" v-model="func_b" size="3"> 
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(quadratic)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'trigonometric'">
                <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="2">
                <label class='m-2' for="func_b">sin(</label>
                <input id="func_b" v-model="func_b" size="2"> 
                <label class='m-2' for="func_c"> t + </label>
                <input id="func_c" v-model="func_c" size="2"> 
                <label class='m-2'> ) </label>
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(trigonometric)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'exponential'">
                <label class='m-2' for="func_a">y=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">exp(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> t)</label>
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(exponential)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'step'">
                <label class='m-2' for="func_a">Y(s)=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">/s(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> s+1)</label>
                <label class='m-2' for='func_c'> t0 = </label>
                <input id="func_c" v-model="func_c" size="3"> 
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(step)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
                </div>
            </div>
            <div v-else-if="currentFunction === 'ramp'">
                <label class='m-2' for="func_a">Y(s)=</label>
                <input id="func_a" v-model="func_a" size="3">
                <label class='m-2' for="func_b">/s^2(</label>
                <input id="func_b" v-model="func_b" size="3"> 
                <label class='m-2' for="func_b"> s+1)</label>
                <label class='m-2' for='func_c'> t0 = </label>
                <input id="func_c" v-model="func_c" size="3"> 
                <label class='m-2' for='func_d'> w0 = </label>
                <input id="func_d" v-model="func_d" size="3"> 
                <div class="row-sm justify-content-center">
                    <button class="btn btn-default btn-xs" id="plotFunctionButton" @click="plotFunc(ramp)">Plot</button>
                    <button class="btn btn-default btn-xs" id="clearFunctionButton" @click="deleteFunctionDataset">Clear</button>
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
            currentDataParameter: store.state.graphDataParameter,
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
        }
    },
    methods: {
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
                            }
                        },
                    }],
                    yAxes: [{
                        scaleLabel:{
                            display: true,
                            //labelString: this.currentDataParameter
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
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data.push(data);
            });
            this.chart.update(0);       //instantly update with 0 parameter, no animation
            // this.chart.options.scales.yAxes[0].scaleLabel.labelString = this.currentDataParameter;
            this.chart.options.scales.yAxes[0].scaleLabel.labelString = store.state.graphDataParameter;
        },
        clearData(){
            this.chartData = [];
            this.chart.data.datasets[0].data = this.chartData;
            //this.chart.reset();
            this.chart.update();
        },
        getData(){
                this.clearData();
                
                //for(let i=0; i<this.$store.getters.getNumData;i++){
                for(let i=0; i<store.state.data.length;i++){
                    //let data = this.$store.getters.getData[i];
                    let x_data = store.state.data[i].t;
                    let y_data;
                    //let x_data = data.t;
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
                    
                }
                
            },
            getLatestData(){
                //let index = this.$store.getters.getNumData - 1;
                let index = store.getNumData() - 1;
                let y_data;
                if(index >= 0){
                    //let data = this.$store.getters.getData[index];
                    let x_data = store.state.data[index].t;
                    //let x_data = data.t;
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
                        console.log("no data");
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
                let t0 = parseFloat(this.func_c);
                //let w0 = -parseFloat(this.func_a)*A*(1-Math.exp(t0/parseFloat(this.func_b)));
                //let t0 = 0;
                let expterm = 1 - Math.exp(-(t-t0)/parseFloat(this.func_b));

                if(t < t0){
                    return 0;
                } else{
                    return parseFloat(this.func_a)*expterm; 
                }
                
            },
            ramp(t){
                //let A = parseFloat(store.state.ramp.ramp_gradient);
                let tau = parseFloat(this.func_b);
                let K = parseFloat(this.func_a);
                let t0 = parseFloat(this.func_c);
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
      computed:{
            getCurrentMode(){
                console.log(this.dataStore.state.currentMode);
                let data = this.dataStore.state.currentMode;
                return data;
            },
            getGraphParameter(){
                return store.state.graphDataParameter;
            },
      },
      mounted() {
        this.createChart();
        this.getData();

        //set default unit
        if(store.state.graphDataParameter == 'theta'){
            this.unit = 'rad';
        } else{
            this.unit = 'rpm';
        }
      },
      created(){
        //eventBus.$on('updateGraph', this.getData );
        eventBus.$on('updateGraph', this.getLatestData );
        eventBus.$on('newgraphadded', this.chartAdded);
        eventBus.$on('clearalldata', this.clearData )
        

      }
}
</script>



<style scoped>



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
