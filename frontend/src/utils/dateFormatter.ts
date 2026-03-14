export const formatRelativeDate = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const timeString = date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });

  if (targetDate.getTime() === today.getTime()) {
    return `Today at ${timeString}`;
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return `Tomorrow at ${timeString}`;
  } else {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
};
