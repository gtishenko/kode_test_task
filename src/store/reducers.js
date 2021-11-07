import { combineReducers } from "redux";
import { dataReducer } from "./data/reducers";

export default combineReducers({
    data: dataReducer
});