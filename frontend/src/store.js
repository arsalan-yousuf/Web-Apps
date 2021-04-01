import { createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';


const initialState = {
  current_action: '',
  loggedIn: false,
  authToken: null,
  name: null,
  email: null,
  userId: null,
  expiryTime: null
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return {...state, ...rest }
    default:
      return state
  }
}

const store = createStore(changeState, composeWithDevTools())
export default store