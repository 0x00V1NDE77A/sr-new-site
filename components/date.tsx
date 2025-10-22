export default function Date({ dateString }: { dateString: string }) {
  // Parse date string manually to avoid TypeScript Date constructor issues
  const dateParts = dateString.split('-');
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
  const day = parseInt(dateParts[2]);
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const formattedDate = `${months[month]} ${day}, ${year}`;
  
  return (
    <time dateTime={dateString}>
      {formattedDate}
    </time>
  );
}
