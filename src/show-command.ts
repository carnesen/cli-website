import { CliCommand, CliOneOfArgGroup } from '@carnesen/cli';

export const showCommand = CliCommand({
	name: 'show',
	description: 'Show the source code of a command',
	positionalArgGroup: CliOneOfArgGroup({
		values: [
			'.' as const,
			'echo' as const,
			'history' as const,
			'multiply' as const,
			'show' as const,
			'throw-error' as const,
		],
		placeholder: '<command>',
		required: true,
	}),
	action(name) {
		let url: string;
		switch (name) {
			case 'echo':
			case 'multiply':
			case 'throw-error': {
				url = `https://github.com/carnesen/cli/blob/master/examples/src/${name}/index.ts`;
				break;
			}
			case '.': {
				url = `https://github.com/carnesen/cli-website/blob/master/src/root-branch.ts`;
				break;
			}
			case 'history':
			case 'show': {
				url = `https://github.com/carnesen/cli-website/blob/master/src/${name}-command.ts`;
				break;
			}
			default: {
				throw new Error('Unexpected command');
			}
		}
		window.open(url, '_blank');
		return `Opened ${url} in a new tab`;
	},
});
