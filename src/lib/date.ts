export function parseDate(dateStr: string): Date {
	const parts = dateStr.split(/\//);
	if (parts.length !== 3) throw new Error('Invalid date string parts length');

	if (parts[2].length === 2) parts[2] = `20${parts[2]}`;

	const day = parseInt(parts[0]);
	const month = parseInt(parts[1]);
	const year = parseInt(parts[2]);

	if (isNaN(day) || isNaN(month) || isNaN(year)) throw new Error('Invalid date string numbers');

	return new Date(year, month, day);
}

export function formatDate(date: Date): string {
	const day = date.getDay().toString().padStart(2, '0');
	const month = date.getMonth().toString().padStart(2, '0');

	return `${day}/${month}/${date.getFullYear()}`;
}
