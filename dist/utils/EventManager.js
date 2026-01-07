/**
 * EventManager
 * Standalone event handling system
 * Provides a way to emit and listen to events across the entire application
 */
export default class EventManager {
    constructor() {
        this.listeners = {};
    }
    on(event, listener) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(listener);
    }
    once(event, listener) {
        const wrapper = (payload) => {
            listener(payload);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    off(event, listener) {
        const eventListeners = this.listeners[event];
        if (!eventListeners) {
            return;
        }
        this.listeners[event] = eventListeners.filter((savedListener) => savedListener !== listener);
        if (this.listeners[event].length === 0) {
            delete this.listeners[event];
        }
    }
    emit(event, payload) {
        const eventListeners = this.listeners[event];
        if (!eventListeners) {
            return;
        }
        eventListeners.forEach((listener) => listener(payload));
    }
}
//# sourceMappingURL=EventManager.js.map