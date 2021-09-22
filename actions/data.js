export const ADD_DATA_POINT = 'ADD_DATA_POINT';

export function addDataPoint(data) {
    return {
        type: ADD_DATA_POINT,
        data,
    }
}