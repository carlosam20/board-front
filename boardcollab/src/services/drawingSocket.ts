// src/services/drawingSocket.ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


export interface DrawingEvent {
  x: number;
  y: number;
  type: 'start' | 'draw' | 'end' | 'clear';
  color: string;
  lineWidth: number;
  sessionId: string;
}

let stompClient: Client | null = null;

export function connectToRoom(roomId: string, onMessage: (event: DrawingEvent) => void) {
  const socket = new SockJS('http://localhost:8080/ws');
  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
    onConnect: () => {
      console.log('STOMP connected');
      stompClient?.subscribe(`/topic/board/${roomId}`, (message) => {
        console.log(`Subscribed to /topic/board/${roomId}`);
        const event: DrawingEvent = JSON.parse(message.body);
        onMessage(event);
      });

      stompClient?.subscribe(`/app/draw/${roomId}`, (message) => {
        console.log(`Subscribed to /topic/board/${roomId}`);
        const event: DrawingEvent = JSON.parse(message.body);
        onMessage(event);
      });
    }
  });

  stompClient.activate();
}

export function sendDrawEvent(roomId: string, event: DrawingEvent) {
  stompClient?.publish({
    destination: `/app/draw/${roomId}`,
    body: JSON.stringify(event)
  });
}
