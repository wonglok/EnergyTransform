// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from 'firebase/app'

// Add the Firebase products that you want to use
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/database'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCKu-gqB2zsIOQjmPSlTpr4O2iyc-DMGPc',
  authDomain: 'installation-art-lok.firebaseapp.com',
  databaseURL: 'https://installation-art-lok.firebaseio.com',
  projectId: 'installation-art-lok',
  storageBucket: 'installation-art-lok.appspot.com',
  messagingSenderId: '307141491191'
}

// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig)
export const frbs = firebase
export const Auth = firebaseApp.auth()
export const FS = firebaseApp.firestore()
export const FDB = firebase.database()

export const toArr = (objList) => {
  if (!objList) {
    return []
  }
  return Object.keys(objList).map((keyname) => {
    let item = objList[keyname]
    return {
      _id: keyname,
      ...item
    }
  })
}
