import { LongestLeadingSubstring } from './longest-leading-substring';

const data: {
	items: string[];
	champion?: string;
	expectedOutput: string;
}[] = [
	{
		items: [],
		expectedOutput: '',
	},
	{
		items: [],
		champion: 'foo',
		expectedOutput: 'foo',
	},
	{
		items: ['foo', 'bar'],
		expectedOutput: '',
	},
	{
		items: ['fe', 'fi', 'fo'],
		expectedOutput: 'f',
	},
];

describe(LongestLeadingSubstring.name, () => {
	for (const { items, champion, expectedOutput } of data) {
		it(`${JSON.stringify(items)}=>${expectedOutput}`, () => {
			const output = LongestLeadingSubstring(items, champion);
			expect(output).toBe(expectedOutput);
		});
	}
});
