const TOAST_DURATION = 3000;
const REMOVE_DELAY = 300;
const MAX_VISIBLE_TOASTS = 4;

const TOAST_TYPES = new Set([
    "success",
    "error",
    "info"
]);

const toastTimers = new WeakMap();

function getSafeType(type) {
    return TOAST_TYPES.has(type)
        ? type
        : "info";
}

function removeToast(toast) {
    if (
        !toast
        ||
        !toast.isConnected
        ||
        toast.classList.contains(
            "toast--removing"
        )
    ) {
        return;
    }

    const timeoutId =
        toastTimers.get(toast);

    if (timeoutId) {
        clearTimeout(timeoutId);
        toastTimers.delete(toast);
    }

    toast.classList.add(
        "toast--removing"
    );

    toast.classList.remove(
        "toast--visible"
    );

    const removeElement = () => {
        if (toast.isConnected) {
            toast.remove();
        }
    };

    toast.addEventListener(
        "transitionend",
        removeElement,
        { once: true }
    );

    setTimeout(
        removeElement,
        REMOVE_DELAY
    );
}

function limitVisibleToasts(container) {
    const visibleToasts = [
        ...container.querySelectorAll(
            ".toast:not(.toast--removing)"
        )
    ];

    const excess =
        visibleToasts.length
        -
        MAX_VISIBLE_TOASTS;

    if (excess <= 0) {
        return;
    }

    visibleToasts
        .slice(0, excess)
        .forEach(removeToast);
}

export function showToast(
    container,
    message,
    type = "success"
) {
    const cleanMessage =
        typeof message === "string"
            ? message.trim()
            : "";

    if (
        !container
        ||
        !cleanMessage
    ) {
        return;
    }

    const safeType =
        getSafeType(type);

    const toast =
        document.createElement("div");

    const messageElement =
        document.createElement("span");

    const closeButton =
        document.createElement("button");

    const progressBar =
        document.createElement("span");

    toast.className =
        `toast toast--${safeType}`;

    toast.setAttribute(
        "role",
        safeType === "error"
            ? "alert"
            : "status"
    );

    messageElement.className =
        "toast__message";

    messageElement.textContent =
        cleanMessage;

    closeButton.className =
        "toast__close";

    closeButton.type =
        "button";

    closeButton.textContent =
        "×";

    closeButton.setAttribute(
        "aria-label",
        "Cerrar notificación"
    );

    progressBar.className =
        "toast__progress";

    progressBar.setAttribute(
        "aria-hidden",
        "true"
    );

    toast.append(
        messageElement,
        closeButton,
        progressBar
    );

    container.append(toast);

    closeButton.addEventListener(
        "click",
        () => removeToast(toast)
    );

    const timeoutId =
        setTimeout(
            () => removeToast(toast),
            TOAST_DURATION
        );

    toastTimers.set(
        toast,
        timeoutId
    );

    requestAnimationFrame(() => {
        toast.classList.add(
            "toast--visible"
        );
    });

    limitVisibleToasts(container);
}