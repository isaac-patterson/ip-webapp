import { combineReducers } from 'redux';

import idTokenReducer from './IdToken/idToken.reducer';

const rootReducer = combineReducers({
    idToken: idTokenReducer,
});

export default rootReducer;