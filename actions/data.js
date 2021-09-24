export const ADD_DATA_POINT = 'ADD_DATA_POINT';
export const ADD_DEVICE = 'ADD_DEVICE';
export const ADD_HUM_DATA_POINT = 'ADD_HUM_DATA_POINT';
export const ADD_TEM_DATA_POINT = 'ADD_TEM_DATA_POINT';
export const RESET_DATA_POINTS = 'RESET_DATA_POINTS';

export function addDataPoint(data) {
    return {
        type: ADD_DATA_POINT,
        data,
    }
}

export function addHumDataPoint(dataHum) {
    return {
        type: ADD_HUM_DATA_POINT,
        dataHum,
    }
}

export function addTemDataPoint(dataTem) {
    return {
        type: ADD_TEM_DATA_POINT,
        dataTem,
    }
}

export function resetDataPoints() {
    return {
        type: RESET_DATA_POINTS
    }
}

export function addDevice(device) {
    return {
        type: ADD_DEVICE,
        device,
    }
}