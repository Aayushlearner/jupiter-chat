import { io, Socket } from "socket.io-client";
import { getBackendBaseUrl } from "./config";

let socket: Socket | null = null;
let currentToken: string | null = null;

/**
 * Get the JWT token from localStorage
 */
const getAuthToken = (): string => {
    try {
        const raw = localStorage.getItem("jb_static_auth_session");
        if (!raw) return "";
        const parsed = JSON.parse(raw);
        const token = typeof parsed?.token === "string" ? parsed.token : "";
        return token;
    } catch {
        return "";
    }
};

/**
 * Initialize or reconnect the socket connection.
 * Automatically uses the stored JWT token for auth.
 * Returns the existing socket if already connected with the same token.
 */
export const getSocket = (): Socket => {
    const token = getAuthToken();

    // If socket exists and token hasn't changed, return existing socket
    if (socket && socket.connected && currentToken === token) {
        return socket;
    }

    // If token changed or socket is disconnected, reconnect
    if (socket) {
        socket.disconnect();
    }

    const backendUrl = getBackendBaseUrl() || "http://localhost:8080";
    currentToken = token;

    socket = io(backendUrl, {
        path: "/ws/socket.io",  // Backend listens on this custom path, not default /socket.io
        auth: {
            token: token,
        },
        transports: ["websocket", "polling"],  // WebSocket primary, polling as fallback
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
        console.log("Socket.IO Connected!");
        console.log("Socket ID:", socket?.id);
    });

    socket.on("connect_error", (err) => {
        console.error("Socket.IO Connection Failed:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("Socket.IO Disconnected:", reason);
    });

    return socket;
};

/**
 * Get the current socket ID (or empty string if not connected)
 */
export const getSocketId = (): string => {
    if (socket && socket.connected) {
        return socket.id || "";
    }
    return "";
};

/**
 * Disconnect the socket (e.g., on logout)
 */
export const disconnectSocket = (): void => {
    if (socket) {
        socket.disconnect();
        socket = null;
        currentToken = null;
        console.log("Socket.IO Disconnected manually.");
    }
};
