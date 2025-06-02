import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const WebSocketContext = createContext({
    isConnected: false,
    isConnecting: true,
    lastMessage: null,
    connectionError: null,
    sendMessage: (message) => { },
});

export const useWebSocket = () => useContext(WebSocketContext);

const PING_INTERVAL = 30000;

export const WebSocketProvider = ({ children }) => {
    const { clientId } = useParams();
    const ws = useRef(null);
    const pingIntervalRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(true); // Start in connecting state
    const [lastMessage, setLastMessage] = useState(null);
    const [connectionError, setConnectionError] = useState(null);

    // Get JWT token from Redux state
    const token = useSelector((state) => state.tenants.authToken);

    const connectWebSocket = useCallback(() => {
        if (!clientId || !token) {
            console.error("WebSocket: Client ID or Token not available.");
            setConnectionError("Client ID or authentication token is missing.");
            setIsConnecting(false);
            setIsConnected(false);
            return; // Don't attempt to connect without necessary info
        }

        // Clear any existing reconnect timeout
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        console.log('WebSocket: Attempting to connect...');
        setConnectionError(null);
        setIsConnecting(true);
        setIsConnected(false);

        const wsBaseUrl = process.env.REACT_APP_WEBSOCKET_BASE_URL || 'ws://localhost:4444/api/v1';
        const wsUrl = `${wsBaseUrl}/${clientId}/service/scan/vulnerability`;

        try {
            ws.current = new WebSocket(wsUrl);

            ws.current.onopen = () => {
                console.log('WebSocket: Connected');
                setIsConnected(true);
                setIsConnecting(false);
                setConnectionError(null);
                pingIntervalRef.current = setInterval(() => {
                    sendMessage({ type: 'ping', jwt_token: token || "" });
                }, PING_INTERVAL);
                sendMessage({ type: 'ping', jwt_token: token || "" });
            };

            ws.current.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('WebSocket: Message received:', message);
                    setLastMessage(message);
                } catch (error) {
                    console.error('WebSocket: Error parsing message:', error);
                }
            };

            ws.current.onerror = (error) => {
                console.error('WebSocket: Error:', error);
                setConnectionError('WebSocket connection error.');
                setIsConnected(false);
                setIsConnecting(false);
            };

            ws.current.onclose = (event) => {
                console.log('WebSocket: Disconnected', event.reason);
                setIsConnected(false);
                setIsConnecting(false);
                if (pingIntervalRef.current) {
                    clearInterval(pingIntervalRef.current);
                }
                if (!event.wasClean) {
                    console.log('WebSocket: Attempting to reconnect in 5 seconds...');
                    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
                }
            };

        } catch (err) {
            console.error("WebSocket: Connection failed to initiate", err);
            setConnectionError("Failed to initiate WebSocket connection.");
            setIsConnecting(false);
            setIsConnected(false);
        }

    }, [clientId, token]);

    const sendMessage = useCallback((message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            try {
                console.log('WebSocket: Sending message:', message);
                ws.current.send(JSON.stringify(message));
            } catch (error) {
                console.error('WebSocket: Failed to send message:', error);
                setConnectionError('Failed to send message.'); // Update error state
            }
        } else {
            console.warn('WebSocket: Not connected. Cannot send message.');
            setConnectionError('Cannot send message, WebSocket is not connected.'); // Update error state
            // Optionally attempt to reconnect if sending fails due to closed state
            // if (!isConnecting && ws.current?.readyState !== WebSocket.CONNECTING) {
            //     connectWebSocket();
            // }
        }
    }, [token]);


    useEffect(() => {
        connectWebSocket();
        return () => {
            console.log("WebSocket: Cleaning up connection.");
            if (pingIntervalRef.current) {
                clearInterval(pingIntervalRef.current);
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (ws.current) {
                ws.current.close();
            }
            setIsConnected(false);
            setIsConnecting(false);
        };
    }, [connectWebSocket]);

    const value = {
        isConnected,
        isConnecting,
        lastMessage,
        connectionError,
        sendMessage,
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};