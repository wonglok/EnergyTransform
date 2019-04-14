import { frbs, Auth, FDB } from './firebase.js'

const FB_LS_TOKEN = 'firebase-token'

export const State = {
  user: false,
  token: false,
  hydrationComplete: false
}

export const waitHydration = () => {
  return new Promise((resolve) => {
    let tt = setInterval(() => {
      if (State.hydrationComplete) {
        clearInterval(tt)
        resolve()
      }
    }, 10)
  })
}

Auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    State.user = JSON.parse(JSON.stringify(user))
    State.token = window.localStorage.getItem(FB_LS_TOKEN)
    State.hydrationComplete = true
    console.log(user)
    if (user.isAnonymous) {
      FDB.ref('users/' + user.uid).set({
        uid: user.uid,
        isAnonymous: user.isAnonymous
      })
    } else {
      FDB.ref('users/' + user.uid).set({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        pic: user.photoURL,
        isAnonymous: user.isAnonymous
      })
    }
  } else {
    State.user = false
    State.token = false
    State.hydrationComplete = true
    window.localStorage.removeItem(FB_LS_TOKEN)
    // No user is signed in.
  }
})

export const loginAnonymous = () => {
  return Auth.signInAnonymously().catch((error) => {
    // Handle Errors here.
    // var errorCode = error.code;
    // var errorMessage = error.message;
    // // ...
    console.log(error)
    return Promise.reject(error)
  })
}

export const loginGoogle = () => {
  var provider = new frbs.auth.GoogleAuthProvider()
  return Auth.signInWithPopup(provider).then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken
    // The signed-in user info.
    var user = result.user
    // ...
    State.user = user
    State.token = token
    window.localStorage.setItem(FB_LS_TOKEN, token)

    return Promise.resolve(State.user)
  }).catch((error) => {
    // // Handle Errors here.
    // var errorCode = error.code
    // var errorMessage = error.message
    // // The email of the user's account used.
    // var email = error.email
    // // The firebase.auth.AuthCredential type that was used.
    // var credential = error.credential

    // window.localStorage.removeItem(FB_LS_TOKEN)
    console.log(error)
    return Promise.reject(error)
  })
}

export const logout = () => {
  return Auth.signOut()
}
