// CERBERUS Bot - WebSocket Hook
// Created: 2025-05-05 21:10:44 UTC
// Author: CERBERUSCHAIN1

import { useState, useEffect, useRef, useCallback } from 'react';

// Define specific types instead of using 'any'
type WebSocketMessage = {
  type: string;
  data: unknown;
  [key: string]: unknown;
};

interface UseWebSocketOptions {
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

interface UseWebSocketReturn {
  data: WebSocketMessage | null;
  send: (data: string | Record<string, unknown>) => void;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

export function useWebSocket(
  url: string,
  options: UseWebSocketOptions = {}
): UseWebSocketReturn {
  const [data, setData] = useState<WebSocketMessage | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    onOpen,
    onClose,
    onError,
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;
  
  const connectWebSocket = useCallback(() => {
    try {
      // Determine WebSocket URL based on environment
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = process.env.NEXT_PUBLIC_API_HOST || window.location.host;
      const wsUrl = `${protocol}//${host}${url}`;
      
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = (event) => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
        
        if (onOpen) onOpen(event);
      };
      
      ws.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data) as WebSocketMessage;
          setData(parsedData);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
          // For non-JSON messages, create a simple object
          setData({
            type: 'raw',
            data: event.data,
            timestamp: new Date().toISOString()
          });
        }
      };
      
      ws.onclose = (event) => {
        setIsConnected(false);
        
        if (onClose) onClose(event);
        
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimerRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
            connectWebSocket();
          }, reconnectInterval);
        }
      };
      
      ws.onerror = (event) => {
        const wsError = new Error('WebSocket error');
        setError(wsError);
        
        if (onError) onError(event);
      };
      
      wsRef.current = ws;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [
    url, 
    onOpen, 
    onClose, 
    onError, 
    autoReconnect, 
    reconnectInterval, 
    maxReconnectAttempts
  ]);
  
  const reconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    reconnectAttemptsRef.current = 0;
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
    }
    
    connectWebSocket();
  };
  
  const send = (data: string | Record<string, unknown>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected');
      return;
    }
    
    wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
  };
  
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, [connectWebSocket]); // Added connectWebSocket as dependency
  
  return { data, send, isConnected, error, reconnect };
}