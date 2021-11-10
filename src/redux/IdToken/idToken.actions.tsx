import { UPDATE, DELETE } from './idToken.types';

export const getJwtToken = (idToken) => {
    return {
        type: UPDATE,
        idToken: idToken
    };
};

export const DeleteIdToken = () => {
    return {
        type: DELETE,
    };
};