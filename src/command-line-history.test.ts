import { CommandLineHistory } from './command-line-history';

const data: {
	operate: (subject: CommandLineHistory) => void;
	expectedList?: string[];
}[] = [
	{
		operate(subject) {
			subject.submit('foo');
		},
		expectedList: ['foo'],
	},
	{
		operate(subject) {
			subject.submit('foo');
			subject.submit('foo');
		},
		expectedList: ['foo'],
	},
	{
		operate(subject) {
			subject.submit('foo');
			subject.submit('bar');
		},
		expectedList: ['foo', 'bar'],
	},
	{
		operate(subject) {
			subject.submit('foo');
			subject.submit('bar');
			subject.submit('foo');
		},
		expectedList: ['bar', 'foo'],
	},
	{
		operate(subject) {
			subject.submit('foo');
			subject.submit('bar');
			subject.previous('baz');
			subject.previous();
			subject.next();
			expect(subject.current()).toBe('bar');
		},
		expectedList: ['foo', 'bar', 'baz'],
	},
];

describe(CommandLineHistory.name, () => {
	it('Initializes with no lines if none are provided', () => {
		const subject = new CommandLineHistory();
		expect(subject.list()).toEqual([]);
	});

	it('Initializes with the provided lines', () => {
		const lines = ['foo'];
		const subject = new CommandLineHistory(lines);
		expect(subject.list()).toEqual(lines);
	});

	data.forEach(({ operate, expectedList }, index) => {
		it(`${CommandLineHistory.name} programmatic test number ${index}`, () => {
			const subject = new CommandLineHistory();
			operate(subject);
			if (expectedList) {
				expect(subject.list()).toEqual(expectedList);
			}
		});
	});
});
