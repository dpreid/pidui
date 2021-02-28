<template>
<div class='container-sm m-2 bg-white border rounded'>
    <div class="row m-0 justify-content-center" id="chart-canvas">
        <div class="col-12">
            <canvas :id="id" @mousedown="startLine" @mouseup="endDrag" @mousemove="endLine"></canvas>
        </div>
    </div>

</div>

</template>

<script>
import { store } from "../simplestore.js";
import { Chart } from 'chart.js';
import { eventBus } from "../main.js";

export default {
    
    name: 'GraphInput',
    props: ['type', 'id'],
    data(){
        return{
            chart: null,
            chartData: [],
            gradient_start_point: {x:0, y:0},
            gradient_end_point: {x:0, y:0},
            gradient: 0,
            mouseDragging: false,
            funcTimeStep: 0.1,
            YAxisMax: 0,
            YAxisMin: 0,
            XAxisMax: 0,
            XAxisMin: 0,
            previous_update_time: 0,
            update_interval: 2000, //millseconds

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
                            labelString: this.currentDataParameter
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
        clearData(){
            this.chartData = [];
            this.chart.data.datasets[0].data = this.chartData;
            //this.chart.reset();
            this.chart.update();
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
        step(step_type){
            this.deleteFunctionDataset();       //remove previous plot if any
            this.chart.options.scales.yAxes[0].scaleLabel.labelString = step_type;
            let min = -5;
            let max = 5;
            let t_delta = max-min;
            let num_plots = t_delta/this.funcTimeStep;
            let new_data = [];
            let new_t;
            let new_y;
            for(let i=0; i<num_plots;i++){
                new_t = min + i*this.funcTimeStep;
                if(new_t >= store.state.step.step_time){
                    new_y = store.state.step.step_start + store.state.step.step_size;
                } else{
                    new_y = store.state.step.step_start;
                }
    
                let data = {
                    x: new_t,
                    y: new_y
                };
                new_data.push(data);
            }
            
            this.addNewDataSet('rgba(255, 0, 0, 0.5)', new_data);
            },
        ramp(step_type, max_value){
            this.deleteFunctionDataset();       //remove previous plot if any
            this.chart.options.scales.yAxes[0].scaleLabel.labelString = step_type;
            let min_time = 0;
            let max_time = parseFloat((max_value - store.state.ramp.ramp_start) / store.state.ramp.ramp_gradient) + parseFloat(store.state.ramp.ramp_start_time);
            let t_delta = max_time-min_time;
            let num_plots = t_delta/this.funcTimeStep;
            let new_data = [];
            let new_t;
            let new_y;
            for(let i=0; i<num_plots;i++){
                new_t = min_time + i*this.funcTimeStep;
                if(new_t >= store.state.ramp.ramp_start_time){
                    new_y = store.state.ramp.ramp_start + store.state.ramp.ramp_gradient*(new_t - store.state.ramp.ramp_start_time);
                } else{
                    new_y = store.state.ramp.ramp_start;
                }
    
                let data = {
                    x: new_t,
                    y: new_y
                };
                new_data.push(data);
            }
            
            this.addNewDataSet('rgba(255, 0, 0, 0.5)', new_data);
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
          
      },
      watch:{
          
      },
      mounted() {
        this.createChart();
        eventBus.$on('addstepfunction', this.step);
        eventBus.$on('addrampfunction', this.ramp);
        eventBus.$on('clearalldata', this.deleteFunctionDataset )
        
      },
      created(){
        //eventBus.$on('updateGraph', this.getData );
        //eventBus.$on('newgraphadded', this.chartAdded);
        
        
        
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
