export const saveState = (state, stateName) => {
	const serializedState = JSON.stringify(state);
	localStorage.setItem(stateName, serializedState);
};

export const loadState = (stateName) => {
	const serializedState = localStorage.getItem(stateName);
	return serializedState ? JSON.parse(serializedState) : undefined;
};
