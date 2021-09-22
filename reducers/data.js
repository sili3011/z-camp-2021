import { ADD_DATA_POINT } from "../actions/data";

export default function settings(state = {}, action) {
    switch(action.type) {
        case ADD_DATA_POINT:
            let data = []
            if(state.data) {
                data = state.data;
            }
            return { ...state, data: [...data, action.data] };
        default: return state;
    }
}