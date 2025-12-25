// Custom comparator for credit ratings to sort correctly
// AAA > AA+ > AA > AA- > A+ > A > A- > BBB+ > BBB > BBB- > BB+ > BB > BB- > B+ > B > B- > CCC+ > CCC > CCC- > CC > C > D

const RATING_ORDER: Record<string, number> = {
	'AAA': 1,
	'AA+': 2,
	'AA': 3,
	'AA-': 4,
	'A+': 5,
	'A': 6,
	'A-': 7,
	'BBB+': 8,
	'BBB': 9,
	'BBB-': 10,
	'BB+': 11,
	'BB': 12,
	'BB-': 13,
	'B+': 14,
	'B': 15,
	'B-': 16,
	'CCC+': 17,
	'CCC': 18,
	'CCC-': 19,
	'CC': 20,
	'C': 21,
	'D': 22
}

export function creditRatingComparator(valueA: string, valueB: string): number {
	const orderA = RATING_ORDER[valueA] ?? 999 // Unknown ratings go to end
	const orderB = RATING_ORDER[valueB] ?? 999
	return orderA - orderB
}
