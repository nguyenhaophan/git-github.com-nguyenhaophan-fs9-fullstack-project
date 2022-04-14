import axios from 'axios'

import { logout } from '../redux/auth/actions'
import store from '../redux/store'

const prod = process.env.NODE_ENV === 'production'
const instance = axios.create({
  baseURL: prod
    ? 'https://fs9-elibrary.herokuapp.com/api/v1'
    : 'http://localhost5000/api/v1',
})

// Using interceptors to dynamically set the header for each request
instance.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')

    if (token) {
      request.headers = {
        Authorization: `Bearer ${token}`,
      }
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Check if the access token is still valid (or expired)
instance.interceptors.response.use(
  (response) => {
    if (response.status === 401) {
      localStorage.clear()
      store.dispatch(logout()) // import redux store to use dispatch outside react component
    }
    return response
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default instance
