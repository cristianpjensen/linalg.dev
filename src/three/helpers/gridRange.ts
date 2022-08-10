const gridRange = (min: number, max: number, divisions: number) => {
	const range = max + 1 - min;
	const step = range / (divisions + 1);
	const values = [];
	for (let i = 0; i < divisions + 1; i++) {
		values.push(min + i * step);
	}
	return values;
};

export default gridRange;
