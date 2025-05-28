/**
 * 
 */

// Add active class to current link
document.addEventListener("DOMContentLoaded", function() {
	const currentLocation = window.location.href.split("&")[0];
	const navLinks = document.querySelectorAll(".sb-sidenav-menu-nested .nav-link");

	navLinks.forEach(link => {
		if (link.href.split("&")[0] == currentLocation) {
			link.classList.add("active");

			// If it's in a collapse, expand that collapse
			const parent = link.closest(".collapse");
			if (parent) {
				const trigger = document.querySelector(`[data-bs-target="#${parent.id}"]`);
				if (trigger) {
					trigger.classList.remove("collapsed");
					parent.classList.add("show");
				}
			}
		}
	});
});

// Animation for the collapse/expand
const collapseTriggers = document.querySelectorAll('[data-bs-toggle="collapse"]');
collapseTriggers.forEach(trigger => {
	trigger.addEventListener("click", function() {
		const icon = this.querySelector(".sb-sidenav-collapse-arrow svg");
		if (this.classList.contains("collapsed")) {
			icon.style.transform = "rotate(0deg)";
		} else {
			icon.style.transform = "rotate(180deg)";
		}
	});
});