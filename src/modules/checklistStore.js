//Store for the checklist specific to this remote lab.

/**Checklist items:



**/

const checklistStore = {
    state: () => ({
        //temporary checklist items are: graph, table and ruler.
        checklist: [{name:'graph', verbose:'Opened graph', completed: false}, {name:'table', verbose:'Opened table', completed: false}, {name:'ruler', verbose:'Used ruler', completed: false}],
        new_checklist_update: false,

       }),
       mutations:{
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
        setChecklistCompleted(context, name){
             if(context.getters.getChecklistUncompleted.includes(name)){
                context.commit('SET_CHECKLIST_COMPLETED', name);
                context.commit('SET_CHECKLIST_UPDATE', true);
             }
         },
         setChecklistUpdate(context, set){
             context.commit('SET_CHECKLIST_UPDATE', set);
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
