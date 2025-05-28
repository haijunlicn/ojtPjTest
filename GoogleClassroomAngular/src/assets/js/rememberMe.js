function getCookie(name) {
	let cookies = document.cookie.split("; ");
	for (let cookie of cookies) {
		let [key, value] = cookie.split("=");
		if (key === name) return value;
	}
	return null;
}

window.onload = function() {
	let token = getCookie("rememberMe");
	console.log("hello")
	if (token) {
		fetch("/login", { // Send to /login endpoint handled by servlet
			method: "POST",
			body: JSON.stringify({ token }),
			headers: { "Content-Type": "application/json" }
		})
			.then(response => response.json())
			.then(data => {
				if (data.success) {
					window.location.href = "/dashboard"; // Auto-login successful, redirect
				} else {
					window.location.href = "/login"; // Token invalid, redirect to login
				}
			});
	}
};
