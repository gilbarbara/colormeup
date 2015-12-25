/**
 * Generator
 * @exports Utils/Storage
 */

export let getItem = (name) => {
	return JSON.parse(localStorage.getItem(name));
};

export let setItem = (name, value) => {
	localStorage.setItem(name, JSON.stringify(value));
};

export let removeItem = (name) => {
	localStorage.removeItem(name);
};

export let clearAll = () => {
	localStorage.clear();
};

export default { getItem, setItem, removeItem, clearAll };
