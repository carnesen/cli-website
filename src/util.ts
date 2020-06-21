export function yellow(message: string): string {
	return `\u001b[33m${message}\u001b[39m`;
}

export function green(message: string): string {
	return `\u001b[32m${message}\u001b[39m`;
}

export function splitWords(line: string): string[] {
	return line.split(' ').filter((word) => word.length > 0);
}
