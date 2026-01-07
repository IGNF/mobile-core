/**
 * EventManager
 * Standalone event handling system
 * Provides a way to emit and listen to events across the entire application
 */
export type EventListener<T = any> = (payload: T) => void;
export default class EventManager {
    private listeners;
    on(event: string, listener: EventListener): void;
    once(event: string, listener: EventListener): void;
    off(event: string, listener: EventListener): void;
    emit<T = any>(event: string, payload?: T): void;
}
//# sourceMappingURL=EventManager.d.ts.map