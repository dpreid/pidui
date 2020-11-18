import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
   state: {
      email: '',
      isLoggedIn: false,
      db: null,
      },
      mutations:{
        LOGIN(state, data){
         state.email = data.email;
         state.isLoggedIn = true;
         var request = window.indexedDB.open("db", 1);
         request.onerror = function() {
            console.log("Why didn't you allow my web app to use IndexedDB?!");
         };
         request.onsuccess = function(event) {
            state.db = event.target.result;
            let transaction = state.db.transaction("user", "readwrite");
            let transaction2 = state.db.transaction('lastuser', 'readwrite');
            // get an object store to operate on it
            let user = transaction.objectStore("user");
            let prev_user = transaction2.objectStore('lastuser');
            
            let userdata = {
               email: state.email,
               created: new Date(),
               logins: []
            };
            user.add(userdata);
            user.onsuccess = function(){
               console.log('user added');
 
            };
            prev_user.add(userdata);
            prev_user.onsuccess = function(){
            };
            
         };
        },
        CHECK_FOR_LOGIN(state){
         var request = window.indexedDB.open("db", 1);
         //if successful then the db exists, so no need to login
         request.onsuccess = function(event) {
            state.db = event.target.result;
            //var user = state.db.transaction("user", "readwrite");
            let transaction = state.db.transaction('lastuser', 'readwrite');
            let prev_user = transaction.objectStore('lastuser');
            prev_user.onerror = function(){
               state.isLoggedIn = false;
            };
            prev_user.openCursor().onsuccess = function(event){
               var cursor = event.target.result;
               if (cursor) {
                  state.email = cursor.value.email;
                  state.isLoggedIn = true;



                  //cursor.continue();    only 1 previous user
               }
               else {
                  console.log("no previous user");
               }
               
               
            };
            
         };
         //if no database already exists then will need to login
         request.onupgradeneeded = function(event) { 
            var db = event.target.result;
            db.createObjectStore("user", { keyPath: "email" });      //for storing this user's data
            db.createObjectStore('lastuser', { keyPath: "email" });                        //for identifying the previously logged on user
            state.isLoggedIn = false;
          };
        },
        LOGOUT(state){
         var request = window.indexedDB.open("db", 1);
         request.onsuccess = function(event) {
            var db = event.target.result;
            let transaction = db.transaction('lastuser', 'readwrite');
            let prev_user = transaction.objectStore('lastuser');
            prev_user.clear();
            state.isLoggedIn = false;
            state.email = '';
         };

         request.onerror = function(){
            console.log('No database to log out from');
         };
        },
      //   UPDATE_USER_RECORD(state, data){
      //    var objectStore = db.transaction(["user"], "readwrite").objectStore("user");
      //    var request = objectStore.get(state.email);
      //    request.onerror = function(event) {
      //      // Handle errors!
      //    };
      //    request.onsuccess = function(event) {
      //      // Get the old value that we want to update
      //      var data = event.target.result;
           
      //      // update the value(s) in the object that you want to change
      //      data.age = 42;
         
      //      // Put this updated object back into the database.
      //      var requestUpdate = objectStore.put(data);
      //       requestUpdate.onerror = function(event) {
      //         // Do something with the error
      //       };
      //       requestUpdate.onsuccess = function(event) {
      //         // Success - the data is updated!
      //       };
      //    };
      //   },
        
      },
      actions:{
           login(context,data){
               context.commit('LOGIN', data);
           },
           checkForLogin(context){
               context.commit('CHECK_FOR_LOGIN');
           },
           updateUserRecord(context, data){
            context.commit('UPDATE_USER_RECORD', data);
           },
           logout(context){
              context.commit('LOGOUT');
           }
           
        },
      getters:{
         isLoggedIn(state){
           return state.isLoggedIn;
         },
         getUserEmail(state){
            return state.email;
         }
        
 
      }
 })
