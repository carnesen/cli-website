import { CliBranch, ICliBranch } from '@carnesen/cli';
import { root as examples } from '@carnesen/cli-examples';
import { CommandLineHistory } from './command-line-history';
import { History } from './history';
import { show } from './show';

export function Root(commandLineHistory: CommandLineHistory): ICliBranch {
	const rootBranch = CliBranch({
		name: '',
		description: `
			This is a special terminal that runs 
			@carnesen/cli examples in your browser. Up and 
			down arrows navigate command history. Tab auto-completes.`,
		children: [History(commandLineHistory), ...examples.children, show],
	});
	return rootBranch;
}
