//initial attempt to update to chart.js v3......not working yet

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
                <option v-if='getGraphDataParameter == "theta"' value="rad">rad</option>
                <option v-if='getGraphDataParameter == "theta"' value="deg">deg</option>
                <option v-if='getGraphDataParameter == "omega"' value="rpm">RPM</option>
                <option v-if='getGraphDataParameter == "omega"' value="rad/s">rad/s</option>
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
                <option v-if='getGraphDataParameter == "omega"' value="step">Step (1st Order)</option>
                <option v-if='getGraphDataParameter == "omega"' value="ramp">Ramp (1st Order)</option>
                <option v-if='getGraphDataParameter == "theta"' value="step2nd">Step (2nd Order)</option>
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
import { Chart, ScatterController, LineElement, PointElement, LinearScale } from 'chart.js';
import { mapGetters } from 'vuex';

Chart.register(ScatterController, LineElement, PointElement, LinearScale);

export default {
    
    name: 'GraphOutput',
    props: ['type', 'id'],
    emits: ['newselectedgraphpoint'],
    data(){
        return{
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
        }
    },
    mounted() {
        this.createChart();
        //this.getAllData();
        //this.updateChart();
        
        if(this.getGraphDataParameter == 'theta'){
            this.unit = 'rad';
        } else{
            this.unit = 'rad/s';
        }
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
        getGraphDataParameter(param){
            if(param == 'theta'){
                this.unit = 'rad';
            } else{
                this.unit = 'rad/s';
            }
        },
        getData(){
            console.log('getData');
            this.clearData();       //only runs when data array is completely changed, ie when it is set to empty array []
        },
        currentFunction(){
            console.log('function changed')
        }
    },
    methods: {
         updateChart(){
             console.log('updating');
            let max_index = this.getNumData - 1;
            if(max_index < this.maxDataPoints){
                if(this.latest_index < max_index && this.getIsRecording){
                    for(let i=this.latest_index; i < max_index; i++){
                        this.getDataAtIndex(i);
                    }
                    this.latest_index = max_index;
                    //this.chart.update();                       //actually updating the chart moved to here!
                    this.chart.options.scales.y.title.text = this.getGraphDataParameter;
                } 
            } 

            setTimeout(this.updateChart, 20);
        },
        createChart() {
            let _this = this;
            const canvas = document.getElementById(this.id);
            const ctx = canvas.getContext('2d');
            this.chart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: _this.type,
                    data: _this.chartData,
                    pointBackgroundColor: 'rgba(0, 0, 0, 1)',
                }]
            },
            options: {
                animation: false,
                parsing: false,
                plugins:{
                    title:{
                        display: false
                    },
                    legend:{
                        display: false
                    },
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title:{
                            display: true,
                            text: 'time/s'
                        },
                        ticks: {
                            callback : function(value,index,values) {
                                if(index == 0){
                                    _this.updateXAxisMin(value);
                                } else if(index == values.length - 1){
                                    _this.updateXAxisMax(value);
                                }
                                return value;
                            },
                            
                        },
                        minRotation: 20,
                        maxRotation: 20,
                        sampleSize: 2,
                    },
                    y: {
                        type: 'linear',
                        position: 'left',
                        title:{
                            display: true,
                            text: _this.getGraphDataParameter
                        },
                        ticks: {
                            callback : function(value,index,values) {
                                if(index == 0){
                                    _this.updateYAxisMin(value);
                                } else if(index == values.length - 1){
                                    _this.updateYAxisMax(value);
                                }
                                return value;
                            },
                        },
                        sampleSize: 2,
                    },
                },
                responsive: true
            }
        });
            // canvas.onclick = function(event){
            //     let active_points = _this.chart.getElementsAtEventForMode(event, 'index', { intersect: true }, false);
            //     if(active_points[0]){
            //         _this.$emit('newselectedgraphpoint', active_points[0]._index);       //data point selected so send event to let other elements know.
            //     }
                
            // };
        },
        updateYAxisMax(value){
            this.YAxisMax = value;
            
        },
        updateYAxisMin(value){
            this.YAxisMin = value;
        },
        updateXAxisMin(value){
            this.XAxisMin = value;
        },
        updateXAxisMax(value){
            this.XAxisMax = value;
        },
        addDataToChart(data) {
            this.chart.data.datasets[0].data.push(data);
        },
        clearData(){
            this.latest_index = 0;          //NEW
            this.max_reached = false;          //NEW
            this.chartData = [];
            this.chart.data.datasets[0].data = this.chartData;
            //this.chart.update();
        },
        getAllData(){
            if(this.current_data_index == 0){
                this.clearData();
                
            }
            for(let i=this.current_data_index; i<this.getNumData;i++){
                let data = this.$store.getters.getData[i];
                let x_data = data.t;
                let y_data;
                switch(this.getGraphDataParameter){
                    case 'theta':
                        if(this.unit == 'deg'){
                            y_data = data.theta_deg;
                        } else {
                            y_data = data.theta;
                        }
                        break;
                    case 'omega':
                        if(this.unit == 'rpm'){
                            y_data = data.omega;
                        } else{
                            y_data = data.omega_rad;
                            
                        }
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
                    //this.chart.update(0);
                } else{
                    //this.chart.update(0);
                    this.count = 0;
                    this.current_data_index = 0;
                }
                
            
        },
        getLatestData(){
            let index = this.getNumData - 1;
            let y_data;
            if(index >= 0){
                let data = this.$store.getters.getData[index];
                let x_data = data.t;
                switch(this.getGraphDataParameter){
                        case 'theta':
                        if(this.unit == 'deg'){
                            y_data = data.theta_deg;
                        } else {
                            y_data = data.theta;
                            
                        }
                        break;
                    case 'omega':
                        if(this.unit == 'rpm'){
                            y_data = data.omega;
                        } else{
                            y_data = data.omega_rad;
                        }
                        break;

                    }
                    this.addDataToChart({x: x_data, y: y_data});
                } 
            
        },
        getDataAtIndex(index){
            let y_data;
            if(index >= 0){
                let data = this.$store.getters.getData[index];
                let x_data = data.t;
            
                switch(this.getGraphDataParameter){
                        case 'theta':
                        if(this.unit == 'deg'){
                            y_data = data.theta_deg;
                        } else {
                            y_data = data.theta;
                            
                        }
                        break;
                    case 'omega':
                        if(this.unit == 'rpm'){
                            y_data = data.omega;
                        } else{
                            y_data = data.omega_rad;
                        }
                        break;

                    }
                    this.addDataToChart({x: x_data, y: y_data});
                } 
        },
        removeChart(){
            this.chart.destroy();
        },
        startLine(event){
            console.log('start line');
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
            try{
                console.log('addNewDataSet');
                console.log(this.currentFunction);
                this.chart.data.datasets.push({
                label:"plotted function",
                pointBackgroundColor: colour,
                data: data
                });
            //this.chart.update();
            } catch(e){
                console.log(e);
            }
            
        },
        deleteFunctionDataset(){
            this.chart.data.datasets = this.chart.data.datasets.filter(set => set.label !== "plotted function");
            //this.chart.update(0);
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
