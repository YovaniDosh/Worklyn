const FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])"
].join(",");

export function createModalManager(configurations) {
    const modals = new Map(
        Object.entries(configurations).map(([name, config]) => [
            name,
            { ...config, trigger: null }
        ])
    );

    function open(name, { trigger = document.activeElement, focus } = {}) {
        const modal = modals.get(name);
        if (!modal) return;

        modal.trigger = trigger;
        modal.element.hidden = false;
        modal.element.classList.add("open");
        modal.element.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        requestAnimationFrame(() => focus?.focus());
    }

    function close(name, { restoreFocus = true } = {}) {
        const modal = modals.get(name);
        if (!modal) return;

        modal.element.classList.remove("open");
        modal.element.setAttribute("aria-hidden", "true");
        modal.element.hidden = modal.hiddenOnClose;
        document.body.classList.remove("modal-open");

        modal.onClose?.();

        if (restoreFocus && modal.trigger?.isConnected) {
            modal.trigger.focus();
        }

        modal.trigger = null;
    }

    function getOpenModal() {
        return [...modals.entries()].find(([, modal]) =>
            modal.element.classList.contains("open")
        )?.[0];
    }

    function trapFocus(event, element) {
        const focusable = element.querySelectorAll(FOCUSABLE_SELECTOR);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    for (const [name, modal] of modals) {
        modal.element.addEventListener("click", event => {
            if (event.target.hasAttribute(modal.closeAttribute)) {
                close(name);
            }
        });
    }

    document.addEventListener("keydown", event => {
        const name = getOpenModal();
        if (!name) return;

        if (event.key === "Escape") {
            event.preventDefault();
            close(name);
        } else if (event.key === "Tab") {
            trapFocus(event, modals.get(name).element);
        }
    });

    return { open, close };
}
