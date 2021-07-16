(function () {
	var theme = window.localStorage.getItem("theme");
	var root = window.document.documentElement;
	if (theme) return root.classList.add(theme);
	theme = window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
	if (theme) return root.classList.add(theme);
})();
