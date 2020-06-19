import { Terminal, ITerminalOptions } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { CliExamplesRepl } from './cli-examples-repl';

import 'xterm/css/xterm.css';

(async function loadTerminalApplication() {
	await (document as any).fonts.load('12px MonoLisa');

	const terminalOptions: ITerminalOptions = {
		fontFamily: 'MonoLisa',
	};

	const terminal = new Terminal(terminalOptions) as any;

	const fitAddon = new FitAddon();
	terminal.loadAddon(fitAddon);

	const webLinksAddon = new WebLinksAddon();
	terminal.loadAddon(webLinksAddon);

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
	});

	repl.start();
})();
