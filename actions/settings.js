export const TOGGLE_DARK_MODE = 'TOGGLE_DARK_MODE';

export function toggleDarkMode(isDark) {
    return {
        type: TOGGLE_DARK_MODE,
        isDark,
    }
}