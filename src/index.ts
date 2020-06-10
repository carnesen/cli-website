import { runCliAndExit, RunCliAndExitOptions } from '@carnesen/cli';
import { carnesenCliExamples } from '@carnesen/cli-examples';

import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

class CommandList {
	private readonly commandLines: string[] = [''];

	private currentIndex = 0;

	get commandLine() {
		return this.commandLines[this.currentIndex];
	}

	set commandLine(str: string) {
		this.commandLines[this.currentIndex] = str;
	}

	public removeChar() {
		this.commandLine = this.commandLine.slice(0, -1);
	}

	public appendChar(s: string) {
		this.commandLine += s;
	}

	public previous() {
		if (this.currentIndex < this.commandLines.length) {
			this.currentIndex += 1;
		}
		return this.commandLine;
	}

	public next() {
		if (this.currentIndex > 0) {
			this.currentIndex -= 1;
		}
		return this.commandLine;
	}

	public submit() {
		if (
			this.currentIndex !== 0 &&
			this.commandLine && // don't write empty lines
			this.commandLine !== this.commandLines[0] // don't write duplicates
		) {
			this.commandLines.unshift(this.commandLine);
		}
		this.commandLines.unshift('');
		this.currentIndex = 0;
	}
}

(function loadTerminalApplication() {
	const term = new Terminal() as any;
	const fitAddon = new FitAddon();
	term.loadAddon(fitAddon);
	const element = document.getElementById('terminal-container');
	if (!element) {
		throw new Error('Expected to find DOM element "terminal-container"');
	}
	element.style.width = '800px';
	element.style.height = '450px';
	term.open(element);
	fitAddon.fit();
	const commandList = new CommandList();
	term.prompt = () => {
		term.write('\r\n$ ');
	};

	term.writeln('Welcome to the @carnesen/cli live examples!');
	term.writeln('');
	term.prompt();
	term.focus();
	term.consoleLog = (arg: any) => {
		if (typeof arg === 'string') {
			for (const ln of arg.split('\n')) {
				term.writeln(ln);
			}
		} else {
			term.writeln(String(arg));
		}
	};
	term.consoleError = term.consoleLog;
	const rewriteCommandLine = (str: string) => {
		for (let i = 0; i < commandList.commandLine.length; i += 1) {
			if (term._core.buffer.x > 2) {
				term.write('\b \b');
			}
		}
		term.write(str);
	};
	term.onKey((e: { key: string; domEvent: KeyboardEvent }) => {
		const ev = e.domEvent;
		ev.preventDefault();
		const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
		switch (ev.keyCode) {
			case 13: {
				// enter
				const options: RunCliAndExitOptions = {
					args: commandList.commandLine
						.split(' ')
						.filter((word) => word.length > 0),
					consoleError: (...args: any[]) => {
						console.error(...args); // eslint-disable-line no-console
						term.consoleError(...args);
					},
					consoleLog: (...args: any[]) => {
						console.log(...args); // eslint-disable-line no-console
						term.consoleLog(...args);
					},
					processExit() {},
					maxLineWidth: 50,
				};
				term.writeln('');
				commandList.submit();
				runCliAndExit(carnesenCliExamples, options)
					.catch(console.error)
					.then(() => {
						term.write('$ ');
					});
				break;
			}

			case 8: {
				// delete
				// Do not delete the prompt
				if (term._core.buffer.x > 2) {
					term.write('\b \b');
				}
				break;
			}
			case 9: {
				// tab
				const child = carnesenCliExamples.children.find((c) =>
					c.name.startsWith(commandList.commandLine),
				);
				if (child) {
					const autoComplete = child.name.slice(commandList.commandLine.length);
					term.write(autoComplete);
					commandList.appendChar(autoComplete);
				}
				break;
			}
			case 38: {
				// up arrow
				rewriteCommandLine(commandList.previous());
				break;
			}

			case 40: {
				// up arrow
				rewriteCommandLine(commandList.next());
				break;
			}

			case 37: {
				// left arrow
				break;
			}
			case 39: {
				// right arrow
				break;
			}

			default: {
				if (printable) {
					commandList.appendChar(e.key);
					term.write(e.key);
				}
			}
		}
	});
})();
