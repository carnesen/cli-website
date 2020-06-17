import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { CliExamplesRepl } from './cli-examples-repl';

(function loadTerminalApplication() {
	const terminalOptions: ITerminalOptions = {
		fontFamily: 'MonoLisa',
	};
	const terminal = new Terminal(terminalOptions) as any;
	const fitAddon = new FitAddon();
	terminal.loadAddon(fitAddon);
	const element = document.getElementById('terminal-container');
	if (!element) {
		throw new Error('Expected to find DOM element "terminal-container"');
	}
	element.style.width = '80%';
	element.style.margin = 'auto';
	// element.style.height = '450px';
	terminal.open(element);
	fitAddon.fit();
	const repl = new CliExamplesRepl({
		terminal,
		motd:
			'Welcome to the @carnesen/cli live examples! Hit "Enter" to get started.',
	});

	repl.start();
})();
