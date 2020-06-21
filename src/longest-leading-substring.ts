/**
 * Returns the longest leading substring amongst the items provided
 * @param items The strings to search
 * @param champion The current longest leading substring
 */
export function LongestLeadingSubstring(
	items: string[],
	champion = '',
): string {
	if (items.length === 0 || champion.length >= items[0].length) {
		return champion;
	}
	// This will be the new champion if it passes the checks
	const contender = items[0].substring(0, champion.length + 1);
	for (let index = 1; index < items.length; index += 1) {
		if (items[index].substring(0, champion.length + 1) !== contender) {
			// Check failed. Terminate recursion.
			return champion;
		}
	}
	return LongestLeadingSubstring(items, contender);
}
