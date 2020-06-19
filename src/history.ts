import { CliCommand, ICliCommand } from '@carnesen/cli';
import { CommandLineHistory } from './command-line-history';

export function History(
	commandLineHistory: CommandLineHistory,
): ICliCommand<any, any, any> {
	const history = CliCommand({
		name: 'history',
		description: "List the commands in this shell's history file",
		action: () => {
			return commandLineHistory
				.list()
				.map((line, index) => `${index} ${line}`)
				.join('\n');
		},
	});
	return history;
}
