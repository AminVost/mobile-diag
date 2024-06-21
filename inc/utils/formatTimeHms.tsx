export const formatTimeHms = (elapsedTime) => {
  const totalSeconds = elapsedTime; 
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  // console.log('seconds:', seconds, 'minutes:', minutes, 'hours:', hours, 'elapsedTime:', elapsedTime);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `not started`;
  }
};
