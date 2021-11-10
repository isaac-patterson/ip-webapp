import { UPDATE, DELETE } from './idToken.types';

const INITIAL_STATE = {
    idToken: null,
};

const idTokenReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE:
            return {
                ...state,
                idToken: action.idToken,
            };

        case DELETE:
            return {
                ...state, idToken: null,
            };

        default: return state;
    }
};

export default idTokenReducer;