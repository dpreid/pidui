//Store for the checklist specific to this remote lab.


const checklistStore = {
    state: () => ({
        //temporary checklist items are: graph, table and ruler.
        checklist: [{name:'graph', verbose:'Opened graph', completed: false}, {name:'table', verbose:'Opened table', completed: false}, {name:'ruler', verbose:'Used ruler', completed: false}],
        new_update: false,

       }),
       mutations:{
         SET_COMPLETED(state, name){
            state.checklist.forEach(item => {
                if(item.name == name){
                    item.completed = true;
                }
            });
         },
         SET_UPDATE(state, set){
             state.new_update = set;
         }
         

       },
       actions:{
        setChecklistCompleted(context, name){
             if(context.getters.getUncompleted.includes(name)){
                context.commit('SET_COMPLETED', name);
                context.commit('SET_UPDATE', true);
             }
         },
         setUpdate(context, set){
             context.commit('SET_UPDATE', set);
         }


       },
       getters:{
         getChecklist(state){
            return state.checklist;
         },
         getCompleted(state){
             let completed = [];
            state.checklist.forEach(item => {
                if(item.completed){
                    completed.push(item.name);
                }
            });
            return completed;
         },
         getUncompleted(state){
            let uncompleted = [];
            state.checklist.forEach(item => {
                if(!item.completed){
                    uncompleted.push(item.name);
                }
            });
            return uncompleted;
         },
         getUpdated(state){
             return state.new_update;
         }
          
         
       },  
  
  }

  export default checklistStore;
