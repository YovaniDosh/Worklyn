export function debounce(
    callback,
    delay = 300
) {
    let timeoutId;

    return function (...args) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(
            () => callback(...args),
            delay
        );
    };
}