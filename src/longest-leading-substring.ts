/** Returns the longest leading substring */
export function LongestLeadingSubstring(
	strings: string[],
	champion = '',
): string {
	const contender = strings[0].substring(0, champion.length + 1);
	for (let index = 1; index < strings.length; index += 1) {
		if (strings[index].substring(0, champion.length + 1) !== contender) {
			return champion;
		}
	}
	return LongestLeadingSubstring(strings, contender);
}
