import { Terminal } from 'xterm';
import {
	runCliAndExit,
	IRunCliAndExitOptions,
	Cli,
	ICliBranch,
} from '@carnesen/cli';
import { CommandLineHistory } from './command-line-history';
import { Root } from './root';

interface IPseudoShellOptions {
	terminal: Terminal;
}

function yellow(message: string) {
	return `\u001b[33m${message}\u001b[39m`;
}

function green(message: string) {
	return `\u001b[32m${message}\u001b[39m`;
}

type KeyEvent = { key: string; domEvent: KeyboardEvent };

const PS1 = `${green('$')} `;

export class CliExamplesRepl {
	private readonly terminal: Terminal;

	private runningCommand = false;

	private settingCurrentLine = false;

	private readonly commandLineHistory: CommandLineHistory;

	private line = '';

	private index = 0;

	private readonly root: ICliBranch;

	public constructor({ terminal }: IPseudoShellOptions) {
		this.terminal = terminal;
		this.commandLineHistory = new CommandLineHistory([
			'throw-special-error --message Foo',
			'multiply 2 3 4',
			'echo foo bar baz',
			'history',
			'',
		]);
		this.root = Root(this.commandLineHistory);
	}

	public start(): void {
		this.terminal.onKey((event) => {
			this.handleKeyEvent(event);
		});

		this.terminal.focus();
		this.terminal.writeln('Hit "Enter" to get started.');
		this.prompt();
	}

	private prompt() {
		this.terminal.write(`\r\n${PS1}`);
	}

	private handleKeyEvent({ key, domEvent }: KeyEvent): void {
		if (this.settingCurrentLine) {
			return;
		}

		if (this.runningCommand) {
			return;
		}

		const printable =
			!domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;
		domEvent.preventDefault();
		switch (domEvent.keyCode) {
			case 8: {
				// delete
				if (this.index === 0) {
					break;
				}
				const line =
					this.line.substring(0, this.index - 1) +
					this.line.substring(this.index, this.line.length);
				this.setLine(line, this.index - 1);
				break;
			}

			case 9: {
				// tab
				const lineBeforeCursor = this.line.substring(0, this.index);
				if (lineBeforeCursor) {
					const child = this.root.children.find((c) =>
						c.name.startsWith(lineBeforeCursor),
					);
					if (child) {
						this.addToLine(`${child.name.substring(lineBeforeCursor.length)} `);
					}
				}
				break;
			}

			case 13: {
				// enter
				this.handleEnterKeyEvent();
				break;
			}

			case 37: {
				// left arrow
				if (this.index === 0) {
					break;
				}
				this.terminal.write(key);
				this.index -= 1;
				break;
			}

			case 38: {
				// up arrow
				this.setLine(this.commandLineHistory.previous(this.line));
				break;
			}

			case 39: {
				// right arrow
				if (this.index === this.line.length) {
					break;
				}
				this.terminal.write(key);
				this.index += 1;
				break;
			}

			case 40: {
				// down arrow
				this.setLine(this.commandLineHistory.next(this.line));
				break;
			}

			default: {
				if (printable) {
					this.addToLine(key);
				}
			}
		}
	}

	private consoleLog(arg: any) {
		if (typeof arg === 'string') {
			for (const ln of arg.split('\n')) {
				this.terminal.writeln(ln);
			}
		} else if (typeof arg === 'number') {
			this.terminal.writeln(yellow(String(arg)));
		} else if (typeof arg === 'object' && typeof arg.stack === 'string') {
			// Error object
			for (const line of arg.stack.split('\n')) {
				this.terminal.writeln(line);
			}
		} else {
			this.terminal.writeln(String(arg));
		}
	}

	private consoleError(arg: any) {
		this.consoleLog(arg);
	}

	private runCurrentLine() {
		const options: IRunCliAndExitOptions = {
			args: this.line.split(' ').filter((word) => word.length > 0),
			consoleError: (...args: any[]) => {
				this.consoleError(args[0]);
			},
			consoleLog: (...args: any[]) => {
				this.consoleLog(args[0]);
			},
			processExit() {},
			columns: this.terminal.cols,
		};
		this.runningCommand = true;
		this.terminal.write('\r\n');
		runCliAndExit(Cli(this.root), options)
			.catch((err) => {
				console.log(err); // eslint-disable-line no-console
			})
			.then(() => {
				this.line = '';
				this.index = 0;
				this.runningCommand = false;
				this.prompt();
			});
	}

	private setLine(line: string, index?: number) {
		if (line === this.line) {
			return;
		}
		this.settingCurrentLine = true;
		const changeInLength = line.length - this.line.length;
		let sequence = '';
		sequence += '\r';
		sequence += PS1;
		sequence += line;
		if (changeInLength < 0) {
			sequence += ' '.repeat(-1 * changeInLength);
			sequence += '\b'.repeat(-1 * changeInLength);
		}
		if (typeof index === 'number') {
			sequence += '\b'.repeat(line.length - index);
		}
		this.terminal.write(sequence, () => {
			this.line = line;
			this.index = typeof index === 'number' ? index : line.length;
			this.settingCurrentLine = false;
		});
	}

	private handleEnterKeyEvent() {
		this.commandLineHistory.submit(this.line);
		this.runCurrentLine();
	}

	private addToLine(str: string) {
		const line =
			this.line.substring(0, this.index) +
			str +
			this.line.substring(this.index);
		this.setLine(line, this.index + str.length);
	}
}
