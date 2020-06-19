import { CliCommand, CliOneOfArgGroup } from '@carnesen/cli';

export const show = CliCommand({
	name: 'show',
	description: 'Show the source code of a command',
	positionalArgGroup: CliOneOfArgGroup({
		values: [
			'echo' as const,
			'history' as const,
			'multiply' as const,
			'throw-error' as const,
			'show' as const,
		],
		placeholder: '<command>',
		required: true,
	}),
	action(_command) {
		let url: string;
		switch (_command) {
			case 'echo':
			case 'multiply':
			case 'throw-error': {
				url = `https://github.com/carnesen/cli/blob/master/examples/src/${_command}/index.ts`;
				break;
			}
			case 'history':
			case 'show': {
				url = `https://github.com/carnesen/cli-website/blob/master/src/${_command}.ts`;
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
