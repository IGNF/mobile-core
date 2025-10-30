/**
 * EventManager
 * Standalone event handling system
 * Provides a way to emit and listen to events across the entire application
 */

// Example usage:
// const manager = new EventManager();
// manager.on('report-sent', (data) => {
//   console.log('Report sent with', data);
// });
// manager.emit('report-sent', { id: 123 });

export type EventListener<T = any> = (payload: T) => void;

export default class EventManager {
  private listeners: Record<string, EventListener[]> = {};

  on(event: string, listener: EventListener): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(listener);
  }

  once(event: string, listener: EventListener): void {
    const wrapper = (payload: any) => {
      listener(payload);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  off(event: string, listener: EventListener): void {
    const eventListeners = this.listeners[event];

    if (!eventListeners) {
      return;
    }

    this.listeners[event] = eventListeners.filter((savedListener) => savedListener !== listener);

    if (this.listeners[event].length === 0) {
      delete this.listeners[event];
    }
  }

  emit<T = any>(event: string, payload?: T): void {
    const eventListeners = this.listeners[event];

    if (!eventListeners) {
      return;
    }

    eventListeners.forEach((listener) => listener(payload));
  }
}
