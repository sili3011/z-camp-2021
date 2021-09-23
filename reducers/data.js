import { ADD_DATA_POINT } from "../actions/data";
import { ADD_DEVICE } from "../actions/data";

export default function settings(state = {}, action) {
    switch(action.type) {
        case ADD_DATA_POINT:
            let data = []
            if(state.data) {
                data = state.data;
            }
            return { ...state, data: [...data, action.data] };
        case ADD_DEVICE:
            let devices = []
            if(state.devices) {
                devices = state.devices;
            }
            return { ...state, devices: [...devices, action.device] };
        default: return state;
    }
}