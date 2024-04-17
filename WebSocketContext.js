// // WebSocketContext.js
// import React, {createContext, useState, useContext} from 'react';

// const WebSocketContext = createContext();

// export const WebSocketProvider = ({children}) => {
//   const [isConnected, setIsConnected] = useState(false);

//   const setConnected = value => {
//     setIsConnected(value);
//   };

//   return (
//     <WebSocketContext.Provider value={{isConnected, setConnected}}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };

// export const useWebSocket = () => useContext(WebSocketContext);

// export default WebSocketContext;


// import React, { createContext, useContext, useState } from 'react';

// const WebSocketContext = createContext();

// export const useWebSocket = () => useContext(WebSocketContext);

// export const WebSocketProvider = ({ children }) => {
//   const [websocketConnected, setWebsocketConnected] = useState(false);

//   return (
//     <WebSocketContext.Provider value={{ websocketConnected, setWebsocketConnected }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };
