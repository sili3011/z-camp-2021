export const ADD_DATA_POINT = 'ADD_DATA_POINT';
export const ADD_DEVICE = 'ADD_DEVICE';

export function addDataPoint(data) {
    return {
        type: ADD_DATA_POINT,
        data,
    }
}

export function addDevice(device) {
    return {
        type: ADD_DEVICE,
        device,
    }
}