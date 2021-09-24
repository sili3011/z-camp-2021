import { ADD_DATA_POINT, ADD_HUM_DATA_POINT, ADD_TEM_DATA_POINT, ADD_DEVICE, RESET_DATA_POINTS } from "../actions/data";

export default function settings(state = {}, action) {
    switch(action.type) {
        case ADD_DATA_POINT:
            let data = []
            if(state.data) {
                data = state.data;
            }
            return { ...state, data: [...data, action.data] };
        case ADD_HUM_DATA_POINT:
            let dataHum = []
            if(state.dataHum) {
                dataHum = state.dataHum;
            }
            return { ...state, dataHum: [...dataHum, action.dataHum] };
        case ADD_TEM_DATA_POINT:
            let dataTem = []
            if(state.dataTem) {
                dataTem = state.dataTem;
            }
            return { ...state, dataTem: [...dataTem, action.dataTem] };
        case RESET_DATA_POINTS:
            return { ...state, dataTem: [], dataHum: [] };
        case ADD_DEVICE:
            let devices = []
            if(state.devices) {
                devices = state.devices;
            }
            return { ...state, devices: [...devices, action.device] };
        default: return state;
    }
}