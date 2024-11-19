import { Attendee, TeamMember } from '../models/Player';

export function updateAttendance(
  attendance: Attendee[],
  memberList: TeamMember[]
) {
  const updatedAttendance = [...attendance];
  // Convert memberList to a Set for faster lookups based on member id
  const memberIds = new Set(memberList.map((member) => member.id));

  // Update attendance items to checked if they exist in memberList
  updatedAttendance.forEach((item) => {
    if (memberIds.has(item.id)) {
      item.checked = true;
    }
  });
  return updatedAttendance;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return formatter.format(date);
}

export function getDuration(
  createdAt: string | Date,
  updatedAt: string | Date
): string {
  if (!updatedAt) return '';
  // Convert inputs to Date objects if they are strings
  const createdDate = new Date(createdAt);
  const updatedDate = new Date(updatedAt);

  // Calculate the difference in milliseconds
  const durationMs = updatedDate.getTime() - createdDate.getTime();

  // Convert milliseconds to hours and minutes
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  // Format as HH:MM
  const formattedDuration = `${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}`;

  return formattedDuration;
}

// Example Usage
const createdAt = '2024-11-19T08:00:00Z';
const updatedAt = '2024-11-19T10:15:00Z';

console.log(getDuration(createdAt, updatedAt)); // Output: "02:15"
