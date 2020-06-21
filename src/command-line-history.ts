/**
 * State machine for command history in a [[`CliPseudoShell`]]
 */
export class CommandLineHistory {
	private lines: string[] = [];

	private index = 0;

	public constructor(lines: string[] = []) {
		this.setLines(...lines.map((str) => str.trim()));
	}

	/**
	 * Set/get the current line
	 * @param line Set the
	 */
	public current(line?: string): string {
		if (typeof line === 'string') {
			this.lines[this.index] = line;
		}
		return this.lines[this.index];
	}

	/**
	 * Submit an item to the command-line history
	 * @param line
	 */
	public submit(line: string): void {
		const trimmed = line.trim();

		this.current(trimmed);

		// Remove duplicates
		this.setLines(...this.lines.filter((l) => l !== trimmed));

		if (this.current() !== trimmed) {
			this.setLines(...this.lines, trimmed);
		}
	}

	/**
	 * Go to the previous item in the history
	 * @param line
	 */
	public previous(line?: string): string {
		this.current(line);
		if (this.index > 0) {
			this.index -= 1;
		}
		return this.current();
	}

	/**
	 * Go to the next item in the history
	 * @param line
	 */
	public next(line?: string): string {
		this.current(line);
		if (this.index < this.indexOfLastLine()) {
			this.index += 1;
		}
		return this.current();
	}

	/**
	 * @returns All non-empty lines
	 */
	public list(): string[] {
		return this.lines.filter((line) => line.length > 0);
	}

	/**
	 * @returns Index of the last line
	 */
	private indexOfLastLine(): number {
		return this.lines.length - 1;
	}

	/**
	 * Set the command-line history and put the cursor on a new line
	 * @param lines New lines to set
	 */
	private setLines(...lines: string[]): void {
		// Don't write empty lines into history
		this.lines = lines.filter((line) => line.length > 0);
		this.lines.push('');
		this.index = this.indexOfLastLine();
	}
}
