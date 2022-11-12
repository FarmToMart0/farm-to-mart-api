const { initializeApp } =  require("firebase/app");

const {getDatabase} = require("firebase/database")

 function startFirebase(){
  const firebaseConfig = {
    apiKey: "AIzaSyAXKV7aG3le-Jl-IF_i0eQ5Pv6qQKYBHIg",
    authDomain: "farm2mart-37dee.firebaseapp.com",
    databaseURL: "https://farm2mart-37dee-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "farm2mart-37dee",
    storageBucket: "farm2mart-37dee.appspot.com",
    messagingSenderId: "518617730486",
    appId: "1:518617730486:web:5f8801ddf92db93d2e0517",
    measurementId: "G-XESC3C2N4E"
  };
  // initialize firebase
  const app = initializeApp(firebaseConfig);
  return getDatabase(app)
 }

 module.exports = {startFirebase}