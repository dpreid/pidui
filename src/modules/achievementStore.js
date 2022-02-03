//Store for the achievements available in the remote lab.


const achievementStore = {
    state: () => ({
        achievements: [
            {name:'box-chat', verbose:'Send a message to Box.', completed: false, hidden: false},
            {name:'custom-ui', verbose:'Customise the UI', completed: false, hidden: false},
            {name:'speedRaw-step-input', verbose:'Step input whilst in open loop mode', completed: false, hidden: false},
            {name:'positionPid-ramp-input', verbose:'Ramp input whilst in position PID mode', completed: false, hidden: false},
            {name:'p-controller', verbose:'Used a non-unity proportional controller in position, step mode', completed: false, hidden: false},
            {name:'download-data', verbose:'Downloaded a dataset with n > 100 data points', completed: false, hidden: false},
            {name:'plot-linear', verbose:'Plot linear function', completed: false, hidden: false},
            {name:'velocity-mode', verbose:'Set the hardware to velocity PID mode', completed: false, hidden: true},
            {name:'ruler', verbose:'Used the ruler tool', completed: false, hidden: true}, 
            {name:'open-all', verbose:'Opened all the components', completed: false, hidden: true, fractional: [
                {name:'graph', completed: false},
                {name:'snapshot', completed: false},
                {name:'table', completed: false},
                {name:'stopwatch', completed: false},
                {name:'diagrams', completed: false},

            ], required: 5, n: 0}, 
            {name:'multiple-runs', verbose:'Run a step or ramp 10 times', completed: false, hidden: true, required: 10, n: 0}, 
            {name:'pd-controller', verbose:'Used a PD controller in position, step mode', completed: false, hidden: true},
            {name:'pid-controller', verbose:'Used a full PID controller in position, step mode', completed: false, hidden: true},
            {name:'plot-1st-step', verbose:'Plot 1st order step function', completed: false, hidden: true},
            {name:'plot-2nd-step', verbose:'Plot 2nd order step function', completed: false, hidden: true},
            {name:'hardware-error', verbose:'Caused the hardware to go out of limits!', completed: false, hidden: true},

        ],
        new_achievement_update: false,
        new_achievement_count: 0,

       }),
       mutations:{
        LOAD_ACHIEVEMENTS(state, achievements_to_load){
            let updated_achievements = [];
            state.achievements.forEach(achievement => {
                let update_achievement = achievements_to_load.find(ach => ach.name == achievement.name);
                if(update_achievement != undefined){
                    updated_achievements.push(update_achievement);
                } else{
                    updated_achievements.push(achievement);
                }
            })

            state.achievements = updated_achievements;
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
             if(set){
                state.new_achievement_count += 1;
             } else{
                state.new_achievement_count = 0;
             }
             state.new_achievement_update = set;
             
         },
         

       },
       actions:{
        loadAchievements(context, achievements){
            context.commit('LOAD_ACHIEVEMENTS', achievements);
        },
        setAchievementCompleted(context, name){
             if(context.getters.getAchievementsUncompleted.includes(name)){
                context.commit('SET_ACHIEVEMENT_COMPLETED', name);
                context.commit('SET_ACHIEVEMENT_UPDATE', true);

                context.dispatch('logAchievements', context.state.achievements, {root: true});        //log the achievements everytime an achievement is completed
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
         },
         checkPIDControllerConditions(context){
            
           if(context.rootState.data.p != 1 && context.rootState.data.i == 0 && context.rootState.data.d == 0){
               context.dispatch('setAchievementCompleted', 'p-controller');
           } else if(context.rootState.data.p > 0 && context.rootState.data.i == 0 && context.rootState.data.d > 0){
               context.dispatch('setAchievementCompleted', 'pd-controller');
           } else if(context.rootState.data.p > 0 && context.rootState.data.i > 0 && context.rootState.data.d > 0){
               context.dispatch('setAchievementCompleted', 'pid-controller');
           } 
        },


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
         },
         getNewAchievementCount(state){
             return state.new_achievement_count;
         },
         getAchievementByName: (state) => (name) => {
            return state.achievements.find(achievement => achievement.name == name);
         },
         
          
         
       },  
  
  }

  export default achievementStore;
