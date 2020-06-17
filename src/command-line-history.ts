export class CommandLineHistory {
	private readonly lines: string[] = [
		'',
		'echo foo bar baz',
		'multiply 2 3 4',
		'throw-special-error --message Foo',
	];

	private index = 0;

	public submit(line: string): void {
		this.lines[this.index] = line;

		if (this.index > 0 && line.length > 0) {
			if (this.lines[0].length > 0) {
				this.lines.unshift(line);
			} else {
				this.lines[0] = line;
			}
		}

		this.index = 0;

		// If there's not already a '' as the first line
		if (this.lines[0].length > 0) {
			this.lines.unshift('');
		}
	}

	public previous(line: string): string {
		this.lines[this.index] = line;
		if (this.index < this.lines.length - 1) {
			this.index += 1;
		}
		return this.lines[this.index];
	}

	public next(line: string): string {
		this.lines[this.index] = line;
		if (this.index > 0) {
			this.index -= 1;
		}
		return this.lines[this.index];
	}
}
