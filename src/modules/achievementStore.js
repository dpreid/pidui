//Store for the achievements available in the remote lab.


const achievementStore = {
    state: () => ({
        achievements: [
            {name:'first-run', verbose:'Run any experiment for the first time', completed: false, hidden: true}, 
            {name:'ruler', verbose:'Used the ruler tool', completed: false, hidden: true},
            {name:'custom-ui', verbose:'Customised the UI', completed: false, hidden: true}, 
            {name:'open-all', verbose:'Opened all the components', completed: false, hidden: true, fractional: [
                {name:'graph', completed: false},
                {name:'snapshot', completed: false},
                {name:'table', completed: false},
                {name:'stopwatch', completed: false},
                {name:'diagrams', completed: false},

            ], required: 5, n: 0}, 
            {name:'multiple-runs', verbose:'Run a step or ramp 10 times', completed: false, hidden: true, required: 10, n: 0}, 
        ],
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
         //payload -> achievement = {name: name, fractional: fractional}
         SET_FRACTIONAL_ACHIEVEMENT_COMPLETED(state, achievement){
            state.achievements.forEach(item => {
                if(item.name == achievement.name){
                    if('fractional' in item){
                        item.fractional.forEach(frac => {
                            if(frac.name == achievement.fractional && !frac.completed){
                                frac.completed = true;
                                item.n++;
    
                                if(item.n == item.required){
                                    item.completed = true;
                                }
                            }
                        })
                    }
                }
            });
         },
         ADD_MULTIPLE_ACHIEVEMENT(state, name){
            state.achievements.forEach(item => {
                if(item.name == name){
                    if('n' in item){
                        if(item.n == item.required - 1){
                            item.n++;
                            item.completed = true;
                        } else {
                            item.n++;
                        }
                    }
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
         setFractionalAchievementCompleted(context, achievement){
            if(context.getters.getAchievementsUncompleted.includes(achievement.name)){
                context.commit('SET_FRACTIONAL_ACHIEVEMENT_COMPLETED', achievement);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);     //although perhaps not completed, should show some kind of update to progress.
            }
         },
         addMultipleAchievement(context, name){
            if(context.getters.getAchievementsUncompleted.includes(name)){
                context.commit('ADD_MULTIPLE_ACHIEVEMENT', name);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);     //although perhaps not completed, should show some kind of update to progress.
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
