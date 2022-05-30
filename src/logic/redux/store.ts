import rootReducer from './reducers/reducer';
import { createStore } from 'redux';

const store = createStore(rootReducer);

export default store; 