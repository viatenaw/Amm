import { combineReducers } from 'redux'
import { navbarReducer } from './navbar.reducer'

const rootReducer = combineReducers({
  navbar: navbarReducer,
})
export default rootReducer