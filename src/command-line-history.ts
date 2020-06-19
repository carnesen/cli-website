const DEFAULT_LINES = [''];

export class CommandLineHistory {
	private readonly lines: string[];

	private index: number;

	public constructor(lines = DEFAULT_LINES) {
		this.lines = lines;
		this.index = this.maxIndex();
	}

	private maxIndex(): number {
		return this.lines.length - 1;
	}

	private lastLine(line?: string): string {
		if (typeof line === 'string') {
			this.lines[this.maxIndex()] = line;
		}
		return this.lines[this.maxIndex()];
	}

	private currentLine(line?: string): string {
		if (typeof line === 'string') {
			this.lines[this.index] = line;
		}
		return this.lines[this.index];
	}

	public submit(line: string): void {
		this.lines[this.index] = line;

		if (this.index < this.maxIndex() && line.length > 0) {
			if (this.lastLine().length > 0) {
				if (line !== this.lastLine() && line !== 'history') {
					this.lines.push(line);
				}
			} else if (line !== 'history') {
				this.lastLine(line);
			}
		}

		// If there's not already a '' as the last line
		if (this.lastLine().length > 0) {
			this.lines.push('');
		}

		this.index = this.maxIndex();
	}

	public previous(line: string): string {
		this.currentLine(line);
		if (this.index > 0) {
			this.index -= 1;
		}
		return this.currentLine();
	}

	public next(line: string): string {
		this.currentLine(line);
		if (this.index < this.maxIndex()) {
			this.index += 1;
		}
		return this.currentLine();
	}

	public list(): string[] {
		return [...this.lines];
	}
}
