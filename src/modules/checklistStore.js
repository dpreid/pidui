//Store for the checklist specific to this remote lab.
//Checklist not currently implemented - merged with achievements

const checklistStore = {
    state: () => ({
        checklist: [{name:'open-graph', verbose:'Opened graph tool', completed: false}, 
                    {name:'voltage-mode', verbose:'Set hardware to voltage mode', completed: false}, 
                    {name:'position-mode', verbose:'Set hardware to position PID mode', completed: false}, 
                    {name:'speedRaw-step-input', verbose:'Step input whilst in open loop mode', completed: false}, 
                    {name:'positionPid-step-input', verbose:'Step input whilst in position PID mode', completed: false},
                    {name:'positionPid-ramp-input', verbose:'Ramp input whilst in position PID mode', completed: false},
                    {name:'download-data', verbose:'Downloaded a dataset', completed: false},
                    {name:'plot-linear', verbose:'Plot linear function', completed: false},
                    {name:'plot-1st-step', verbose:'Plot 1st order step function', completed: false},
                    {name:'plot-2nd-step', verbose:'Plot 2nd order step function', completed: false},
                    {name:'p-controller', verbose:'Used a non-unity proportional controller in position mode', completed: false},
                    {name:'pd-controller', verbose:'Used a PD controller in position mode', completed: false},
                    {name:'pid-controller', verbose:'Used a full PID controller in position mode', completed: false},
                ],
        new_checklist_update: false,

       }),
       mutations:{
        LOAD_CHECKLIST(state, checklist){
            state.checklist = checklist;
        },
         SET_CHECKLIST_COMPLETED(state, name){
            state.checklist.forEach(item => {
                if(item.name == name){
                    item.completed = true;
                }
            });
         },
         SET_CHECKLIST_UPDATE(state, set){
             state.new_checklist_update = set;
         }
         

       },
       actions:{
        loadChecklist(context, checklist){
            console.log(checklist);
            context.commit('LOAD_CHECKLIST', checklist);
        },
        setChecklistCompleted(context, name){
             if(context.getters.getChecklistUncompleted.includes(name)){
                context.commit('SET_CHECKLIST_COMPLETED', name);
                context.commit('SET_CHECKLIST_UPDATE', true);
             }
         },
         setChecklistUpdate(context, set){
             context.commit('SET_CHECKLIST_UPDATE', set);
         },
         checkPIDControllerConditions(context){
             console.log(context.rootState.data.p);
            if(context.rootState.data.p != 1 && context.rootState.data.i == 0 && context.rootState.data.d == 0){
                context.dispatch('setChecklistCompleted', 'p-controller');
            } else if(context.rootState.data.p > 0 && context.rootState.data.i == 0 && context.rootState.data.d > 0){
                context.dispatch('setChecklistCompleted', 'pd-controller');
            } else if(context.rootState.data.p > 0 && context.rootState.data.i > 0 && context.rootState.data.d > 0){
                context.dispatch('setChecklistCompleted', 'pid-controller');
            } 

            context.dispatch('setChecklistCompleted', 'positionPid-step-input');
         }


       },
       getters:{
         getChecklist(state){
            return state.checklist;
         },
         getChecklistCompleted(state){
             let completed = [];
            state.checklist.forEach(item => {
                if(item.completed){
                    completed.push(item.name);
                }
            });
            return completed;
         },
         getChecklistUncompleted(state){
            let uncompleted = [];
            state.checklist.forEach(item => {
                if(!item.completed){
                    uncompleted.push(item.name);
                }
            });
            return uncompleted;
         },
         getChecklistUpdated(state){
             return state.new_checklist_update;
         }
          
         
       },  
  
  }

  export default checklistStore;
