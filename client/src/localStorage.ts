export const saveState = (state: any, stateName: string) => {
	const serializedState = JSON.stringify(state);
	localStorage.setItem(stateName, serializedState);
};

export const loadState = (stateName: string) => {
	const serializedState = localStorage.getItem(stateName);
	return serializedState ? JSON.parse(serializedState) : null;
};
