// import Vue from 'vue';
// import Vuex from 'vuex';

// Vue.use(Vuex);

// export default new Vuex.Store({
//    state: {
//       email: '',
//       isLoggedIn: false,
//       db: null,
//       },
//       mutations:{
//         LOGIN(state, data){
//          state.email = data.email;
//          state.isLoggedIn = true;
//          var request = window.indexedDB.open("db", 1);
//          request.onerror = function() {
//             console.log("Why didn't you allow my web app to use IndexedDB?!");
//          };
//          request.onsuccess = function(event) {
//             console.log("db opened for login");
//             state.db = event.target.result;
//             let transaction = state.db.transaction("user", "readwrite");
//             let transaction2 = state.db.transaction('lastuser', 'readwrite');
//             // get an object store to operate on it
//             let user = transaction.objectStore("user");
//             let last_user = transaction2.objectStore('lastuser');
            
//             let previousLogin = false;    //has this user previously logged in

//             //if a user is already on the list of users then add them as prev user and update logins
//             user.openCursor().onsuccess = function(event){
//                console.log("checking for previous use");
//                var cursor = event.target.result;
//                if(cursor){
//                   //if already on the list
//                   if(data.email == cursor.value.email){
//                      previousLogin = true;
//                      cursor.value.logins.push(new Date());
//                      let req = cursor.update(cursor.value);
//                      req.onsuccess = function(){
//                         console.log("user updated = " + cursor.value.logins);
//                      }
//                   }
//                   cursor.continue();
//                } else{
//                   if(!previousLogin){
//                      console.log('user has not logged in before');
//                      let userdata = {
//                         email: data.email,
//                         created: new Date(),
//                         logins: []
//                      };
//                      let request = user.add(userdata);
//                      request.onsuccess = function(){
//                         console.log('new user added');
//                      };
//                   }
                  
//                }
            
//          };
//          last_user.clear();
//          let last_request = last_user.add(data);
//          last_request.onsuccess = function(){
//             console.log('last user updated');
//          }
            
//          };
//         },
//         LOGOUT(state){
//          var request = window.indexedDB.open("db", 1);
//          request.onsuccess = function(event) {
//             var db = event.target.result;
//             let transaction = db.transaction('lastuser', 'readwrite');
//             let prev_user = transaction.objectStore('lastuser');
//             prev_user.clear();
//             state.isLoggedIn = false;
//             state.email = '';
//          };

//          request.onerror = function(){
//             console.log('No database to log out from');
//          };
//         },
//       },
//       actions:{
//            login(context,data){
//               if(data != null){
//                console.log('prev user = ' + data.email);
//                context.commit('LOGIN', data);
//               } else{
//                  console.log('no login data');
//               }
               
//            },
//            async autoLogin({ dispatch }){
//               let data = await dispatch('getPrevUser');
//               dispatch('login', data);
//            },
//            logout(context){
//               context.commit('LOGOUT');
//            },
//            async getPrevUser(){
//             return new Promise((resolve) => {

//             var request = window.indexedDB.open("db", 1);
            
//             request.onsuccess = function(event) {
//                console.log("success opening db");
//                let db = event.target.result;
//                //var user = state.db.transaction("user", "readwrite");
//                let transaction = db.transaction('lastuser', 'readwrite');
//                let prev_user = transaction.objectStore('lastuser');
   
//                prev_user.onerror = function(){
//                   resolve(null);
//                };
//                prev_user.openCursor().onsuccess = function(event){
//                   console.log("in cursor");
//                   var cursor = event.target.result;
//                   if (cursor) {
//                      if(cursor.value.email != null){
//                         let data = {email: cursor.value.email};
//                         resolve(data);
   
//                      } else{
//                         resolve(null);
//                      }
//                      //cursor.continue();    only 1 previous user
//                   }
//                   else {
//                      console.log("no previous user");
//                      resolve(null);
//                   }
                  
                  
//                };
               
//             };
//             request.onupgradeneeded = function(event) { 
//                console.log("upgrade needed");
//                var db = event.target.result;
//                db.createObjectStore("user", { keyPath: "email" });      //for storing this user's data
//                db.createObjectStore('lastuser', { keyPath: "email" });                        //for identifying the previously logged on user
//                resolve(null);
//              };
   
//              request.onerror = function(event){
//                console.log("error opening database");
//                console.log(event);
//                resolve(null);
//              }

//             });
//            },
           
//         },
//       getters:{
//          isLoggedIn(state){
//            return state.isLoggedIn;
//          },
//          getUserEmail(state){
//             return state.email;
//          }
        
 
//       },
//  })
