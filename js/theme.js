import { THEME } from "./constants.js";

function isValidTheme(theme) {
    return (
        theme === THEME.LIGHT ||
        theme === THEME.DARK
    );
}

export function loadTheme() {
    try {
        const savedTheme =
            localStorage.getItem(THEME.STORAGE_KEY)
            ?? localStorage.getItem(THEME.LEGACY_STORAGE_KEY);

        return isValidTheme(savedTheme)
            ? savedTheme
            : THEME.LIGHT;
    } catch (error) {
        console.error(
            "Error al cargar el tema:",
            error
        );

        return THEME.LIGHT;
    }
}

export function saveTheme(theme) {
    if (!isValidTheme(theme)) {
        return false;
    }

    try {
        localStorage.setItem(
            THEME.STORAGE_KEY,
            theme
        );

        return true;
    } catch (error) {
        console.error(
            "Error al guardar el tema:",
            error
        );

        return false;
    }
}

export function applyTheme(theme, themeToggle) {
    const safeTheme = isValidTheme(theme)
        ? theme
        : THEME.LIGHT;

    const isDark = safeTheme === THEME.DARK;

    document.documentElement.dataset.theme =
        safeTheme;

    if (!themeToggle) {
        return;
    }

    themeToggle.textContent =
        isDark ? "☀️" : "🌙";

    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "Activar tema claro"
            : "Activar tema oscuro"
    );

    themeToggle.setAttribute(
        "aria-pressed",
        String(isDark)
    );
}

export function toggleTheme(currentTheme) {
    return currentTheme === THEME.DARK
        ? THEME.LIGHT
        : THEME.DARK;
}
