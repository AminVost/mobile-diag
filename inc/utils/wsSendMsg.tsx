const sendWsMessage = (wsSocket, message) => {
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
        wsSocket.send(JSON.stringify(message));
    } else {
        console.log('wsSocket problem send Message = ' , message.currentStep)
    }
};

export default sendWsMessage;