//Store for the achievements available in the remote lab.


const achievementStore = {
    state: () => ({
        //temporary achievements
        achievements: [{name:'plots', verbose:'Plotted 10 times', completed: false}, {name:'table', verbose:'Used the table component', completed: false}, {name:'ruler', verbose:'Used ruler', completed: false}],
        new_achievement_update: false,

       }),
       mutations:{
        LOAD_ACHIEVEMENTS(state, achievements){
            state.achievements = achievements;
        },
         SET_ACHIEVEMENT_COMPLETED(state, name){
            state.achievements.forEach(item => {
                if(item.name == name){
                    item.completed = true;
                }
            });
         },
         SET_ACHIEVEMENT_UPDATE(state, set){
             state.new_achievement_update = set;
         }
         

       },
       actions:{
        loadAchievements(context, achievements){
            context.commit('LOAD_ACHIEVEMENTS', achievements);
        },
        setAchievementCompleted(context, name){
             if(context.getters.getAchievementsUncompleted.includes(name)){
                context.commit('SET_ACHIEVEMENT_COMPLETED', name);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);
             }
         },
         setAchievementUpdate(context, set){
             context.commit('SET_ACHIEVEMENT_UPDATE', set);
         }


       },
       getters:{
         getAchievements(state){
            return state.achievements;
         },
         getAchievementsCompleted(state){
             let completed = [];
            state.achievements.forEach(item => {
                if(item.completed){
                    completed.push(item.name);
                }
            });
            return completed;
         },
         getAchievementsUncompleted(state){
            let uncompleted = [];
            state.achievements.forEach(item => {
                if(!item.completed){
                    uncompleted.push(item.name);
                }
            });
            return uncompleted;
         },
         getAchievementUpdated(state){
             return state.new_achievement_update;
         }
          
         
       },  
  
  }

  export default achievementStore;
