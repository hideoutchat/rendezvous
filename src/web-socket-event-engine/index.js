const STUB = () => true;

class WebSocketEventEngine {
  constructor(options = {}) {
    const {
      onError = STUB,
      onPublish = STUB,
      onSubscribe = STUB,
      onUnsubscribe = STUB,
      webSocket
    } = options;

    webSocket.on('message', (message) => {
      try {
        const { publish, subscribe, unsubscribe } = JSON.parse(message);

        if (unsubscribe) {
          onUnsubscribe(unsubscribe);
        }

        if (subscribe) {
          onSubscribe(subscribe);
        }

        if (publish) {
          onPublish(publish);
        }
      } catch (error) {
        onError(error, message);
      }
    });

    this.publish = (event) => webSocket.send(JSON.stringify({ publish: event, type: 'publish' }));
    this.subscribe = (shape) => webSocket.send(JSON.stringify({ subscribe: shape, type: 'subscribe' }));
    this.unsubscribe = (shape) => webSocket.send(JSON.stringify({ type: 'unsubscribe', unsubscribe: shape }));
  }
}

export default WebSocketEventEngine;
