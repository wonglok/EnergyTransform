import axios from 'axios'
import io from 'socket.io-client'
// import uuid from 'uuid'
import NProgress from 'nprogress'
import './nprogress.css'
// import { EventEmitter } from 'events'

NProgress.configure({
  minimum: 0.08,
  easing: 'ease',
  positionUsing: '',
  speed: 200,
  trickle: true,
  trickleRate: 0.015,
  trickleSpeed: 350,
  showSpinner: false,
  barSelector: '[role="bar"]',
  spinnerSelector: '[role="spinner"]',
  parent: 'body',
  template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
})

var baseURL = 'http://localhost:3003/'

// console.log(process.env.NODE_ENV)
// debug
// baseURL = `https://effectnode-heroku.herokuapp.com/`

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://effectnode-heroku.herokuapp.com/'
} else if (window.location.hostname.indexOf('192') !== -1) {
  baseURL = 'http://' + window.location.hostname + ':3003/'
}

export const baseRoot = baseURL

export const PROXY_URL = baseURL + 'yo/proxy'

export const StartLoading = () => {
  NProgress.start()
}
export const EndLoading = () => {
  NProgress.done()
}

var makeAxios = () => {
  let config = {
    withCredentials: true,
    headers: {},
    baseURL
  }

  let rememberMe = window.localStorage.getItem('jwt_remember_me')
  if (rememberMe) {
    config.headers = {
      'Authorization': `bearer ${rememberMe}`
    }
  }

  var iAXIOS = axios.create(config)

  iAXIOS.interceptors.request.use((config) => {
    // Do something before request is sent
    NProgress.start()
    return config
  }, (error) => {
    NProgress.done()
    // Do something with request error
    return Promise.reject(error)
  })

  // Add a response interceptor
  iAXIOS.interceptors.response.use((response) => {
    NProgress.done()
    // Do something with response data
    return response
  }, (error) => {
    NProgress.done()
    // Do something with response error
    return Promise.reject(error)
  })
  return iAXIOS
}

export const makeSocket = (path) => {
  // return io(`${baseURL}/${path}`, { transports: ['websocket'] })
  // let socket = io(`${baseURL}${path}`)
  let rememberMe = window.localStorage.getItem('jwt_remember_me')
  let query = ``
  if (rememberMe) {
    query = `auth_token=${rememberMe}`
  }
  let socket = io(`${baseURL}${path}`, { transports: ['websocket'], query })
  window.addEventListener('focus', () => {
    socket.connect()
  })
  setInterval(() => {
    if (socket.disconnected) {
      socket.connect()
    }
  }, 500)
  return socket
}

export const RT = {
  ia: makeSocket('installation-art')
}

var iAXIOS = makeAxios()

export let myself = false

export let checkLogin = async () => {
  try {
    await getMe()
    return true
  } catch (e) {
    window.localStorage.removeItem('jwt_remember_me')
    return false
  }
}

export const setupGame = ({ handlers }) => {
  RT.ia.on('transmute', handlers.onTransmute)
  RT.ia.on('move', handlers.onMove)
  RT.ia.on('eat', handlers.onEat)

  return {
    socket: RT.ia,
    transmute ({ gameID, playerID, stone }) {
      RT.ia.emit('transmute', {
        gameID,
        playerID,
        stone
      })
    },
    move ({ gameID, playerID, position }) {
      RT.ia.emit('move', {
        gameID,
        playerID,
        position
      })
    },
    eat ({ gameID, playerID, stone }) {
      RT.ia.emit('eat', {
        gameID,
        playerID,
        stone
      })
    },
    join ({ gameID }) {
      RT.ia.emit('join', {
        gameID
      })
    },
    leave ({ gameID }) {
      RT.ia.emit('leave', {
        gameID
      })
    }
  }
}

export const getMe = () => {
  return iAXIOS.get('/myself')
    .then((resp) => {
      myself = resp.data
      return resp
    })
}

export const register = (data) => {
  return iAXIOS.post('/en/register', data)
    .then((resp) => {
      window.localStorage.setItem('jwt_remember_me', resp.data.token)
      iAXIOS = makeAxios()
      RT.ia = makeSocket('installation-art')
      return resp
    })
}

export const login = (data) => {
  return iAXIOS.post('/login', data)
    .then((resp) => {
      window.localStorage.setItem('jwt_remember_me', resp.data.token)
      iAXIOS = makeAxios()
      RT.ia = makeSocket('installation-art')
      return resp
    })
}

export const logout = (data) => {
  window.localStorage.removeItem('jwt_remember_me')
  return iAXIOS.post('/logout', data)
}
