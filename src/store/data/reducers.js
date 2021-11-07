import { SET_DATA } from './actionTypes';

const initialState = {
    users: [], //list of users
    search: "",
    activeUser: null
};

export const dataReducer = (state = initialState, action) => {

    switch (action.type) {

        case SET_DATA: {
            return {
                ...state,
                [action.payload.variable]: action.payload.value
            };
        }

        default: {
            return state;
        }

    }

};