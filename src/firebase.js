import firebase from "firebase/compat/app"
import "firebase/compat/database"

const firebaseConfig = {
    apiKey: "AIzaSyAvW4pnE6utW4f8-NQjiaponoDBQgAfbjQ",
    authDomain: "iot-lab2-7b8a0.firebaseapp.com",
    projectId: "iot-lab2-7b8a0",
    storageBucket: "iot-lab2-7b8a0.appspot.com",
    messagingSenderId: "297661925345",
    appId: "1:297661925345:web:87d7ce644a89b6d50974a0",
    measurementId: "G-SCG814PM3S"
};
	
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

export default database;
