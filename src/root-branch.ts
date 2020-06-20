import { CliBranch, ICliBranch } from '@carnesen/cli';
import { root as examples } from '@carnesen/cli-examples';
import { CommandLineHistory } from './command-line-history';
import { HistoryCommand } from './history-command';
import { showCommand } from './show-command';

export function RootBranch(commandLineHistory: CommandLineHistory): ICliBranch {
	const rootBranch = CliBranch({
		name: '',
		description: `
			This is a special terminal that runs 
			@carnesen/cli examples in your browser. Up and 
			down arrows navigate command history. Tab auto-completes.`,
		children: [
			HistoryCommand(commandLineHistory),
			...examples.children,
			showCommand,
		],
	});
	return rootBranch;
}
