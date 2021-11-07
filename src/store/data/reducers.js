import { SET_DATA } from './actionTypes';

const initialState = {
    users: [], //list of users
    search: "", // search text 
    activeUser: null, // active user on page "Profile"
    sort: 0, // type of sorting users
    scrollPosition: 0 // Scroll position of a "Search" page
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