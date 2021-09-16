import { TOGGLE_DARK_MODE } from "../actions/settings"

export default function settings(state = {}, action) {
    switch(action.type) {
        case TOGGLE_DARK_MODE:
            return { isDark: action.isDark };
        default: return state;
    }
}