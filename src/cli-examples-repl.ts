import { Terminal } from 'xterm';
import { runCliAndExit, IRunCliAndExitOptions, Cli } from '@carnesen/cli';
import { examples } from '@carnesen/cli-examples';
import { CommandLineHistory } from './command-line-history';

interface IPseudoShellOptions {
	terminal: Terminal;
	motd?: string;
}

function yellow(message: string) {
	return `\u001b[33m${message}\u001b[39m`;
}

type KeyEvent = { key: string; domEvent: KeyboardEvent };

const PS1 = '$ ';

export class CliExamplesRepl {
	private readonly terminal: Terminal;

	private readonly motd: string;

	private runningCommand = false;

	private settingCurrentLine = false;

	private readonly commandLineHistory = new CommandLineHistory();

	private line = '';

	public constructor({ terminal, motd }: IPseudoShellOptions) {
		this.terminal = terminal;
		this.motd = motd || '';
	}

	public start(): void {
		this.terminal.onKey((event) => {
			this.handleKeyEvent(event);
		});

		this.terminal.focus();
		if (this.motd) {
			this.terminal.writeln(this.motd);
			this.terminal.writeln('');
		}
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
				// Do not delete the prompt
				if ((this.terminal as any)._core.buffer.x > PS1.length) {
					this.terminal.write('\b \b');
				}
				this.line = this.line.slice(0, -1);
				break;
			}

			case 9: {
				// tab
				if (this.line) {
					const child = examples.children.find((c) =>
						c.name.startsWith(this.line),
					);
					if (child) {
						this.setLine(`${child.name} `);
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
				break;
			}

			case 38: {
				// up arrow
				this.setLine(this.commandLineHistory.previous(this.line));
				break;
			}

			case 39: {
				// right arrow
				break;
			}

			case 40: {
				// up arrow
				this.setLine(this.commandLineHistory.next(this.line));
				break;
			}

			default: {
				if (printable) {
					this.appendChar(key);
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
		examples.name = '';
		examples.description = `
		This is a special web terminal built on Xterm.js that runs the 
		@carnesen/cli examples 
		right there in your browser. Hit the Tab key for auto-complete. 
		The up and down arrows navigate command history. Right and left arrow
		aren't implemented yet.
		`;
		runCliAndExit(Cli(examples), options)
			.catch((err) => {
				console.log(err); // eslint-disable-line no-console
			})
			.then(() => {
				this.line = '';
				this.runningCommand = false;
				this.prompt();
			});
	}

	private setLine(line: string) {
		if (line === this.line) {
			return;
		}
		this.settingCurrentLine = true;
		const changeInLength = line.length - this.line.length;
		let sequence = '';
		if (changeInLength < 0) {
			sequence += '\b'.repeat(-1 * changeInLength);
			sequence += ' '.repeat(-1 * changeInLength);
		}
		sequence += '\r';
		sequence += PS1;
		sequence += line;
		this.terminal.write(sequence, () => {
			this.line = line;
			this.settingCurrentLine = false;
		});
	}

	private handleEnterKeyEvent() {
		this.commandLineHistory.submit(this.line);
		this.runCurrentLine();
	}

	private appendChar(s: string) {
		this.terminal.write(s);
		this.line += s;
	}
}
