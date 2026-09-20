const eventNames = ['API:UN_AUTH'] as const;

type EventNames = (typeof eventNames)[number]

class EventEmitter {
  private listeners: Record<EventNames, Set<Function>> = {
    'API:UN_AUTH': new Set(),
  };
  on(eventName: EventNames, listener:Function) {
    console.log(`[EventEmitter] Listener added for event: ${eventName}`);
    this.listeners[eventName].add(listener);
  }
  emit(eventName: EventNames, ...args: any[]) {
    console.log(`[EventEmitter] Emitting event: ${eventName}`);
    this.listeners[eventName].forEach((listener) => {
      listener(...args);
    });
  }
};

const eventEmitter = new EventEmitter();

export default eventEmitter;
