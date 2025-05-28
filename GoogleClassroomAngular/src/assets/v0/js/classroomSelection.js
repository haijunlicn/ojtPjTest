/**
 * 
 */
document.addEventListener("DOMContentLoaded", function() {
	const dropdownToggle = document.getElementById("dropdown-toggle");
	const dropdownMenu = document.getElementById("dropdown-menu");
	const dropdownItems = document.querySelectorAll(".dropdown-item");
	const dropdownText = document.querySelector(".dropdown-toggle-text");
	const selectedClassUcIdList = document.getElementById("selectedClassUcIdList");
	const studentSelector = document.querySelector(".student-selector")

	// Function to update the selectedClassUcIdList and print to console
	function updateSelectedClassUcIdList() {
		// Get all selected items
		const selectedItems = Array.from(dropdownItems).filter(item =>
			item.dataset.selected === "true"
		);

		// Get the values (ucIds) of selected items
		const selectedValues = selectedItems.map(item => item.dataset.value);

		// Clear all current selections in the select element
		Array.from(selectedClassUcIdList.options).forEach(option => {
			option.selected = false;
		});

		// Set the selected options in the select element
		Array.from(selectedClassUcIdList.options).forEach(option => {
			if (selectedValues.includes(option.value)) {
				option.selected = true;
			}
		});

		// Print selected IDs to console
		console.log("Selected Class UcIds:", selectedValues);

		return selectedValues;
	}

	// Toggle dropdown menu
	if (dropdownToggle) {
		dropdownToggle.addEventListener("click", function(e) {
			e.stopPropagation();
			if (dropdownMenu) {
				dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
			}
		});
	}

	// Close dropdown if clicked outside
	document.addEventListener("click", function(event) {
		if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
			dropdownMenu.style.display = "none";
		}
	});

	// Handle selection logic
	dropdownItems.forEach(item => {
		// Skip items that are disabled (like the current classroom)
		if (item.dataset.disabled === "true") {
			// Make sure the current classroom is always selected
			item.dataset.selected = "true";

			// Ensure the corresponding option in the select element is selected
			const value = item.dataset.value;
			Array.from(selectedClassUcIdList.options).forEach(option => {
				if (option.value === value) {
					option.selected = true;
				}
			});

			return;
		}

		item.addEventListener("click", function(e) {
			e.stopPropagation();
			const value = item.dataset.value;
			const isSelected = item.dataset.selected === "true";

			// Toggle selection state
			if (isSelected) {
				item.dataset.selected = "false";
				item.classList.remove("selected");
				const checkIcon = item.querySelector(".dropdown-item-checkbox i");
				if (checkIcon) checkIcon.style.display = "none";
			} else {
				item.dataset.selected = "true";
				item.classList.add("selected");
				const checkIcon = item.querySelector(".dropdown-item-checkbox i");
				if (checkIcon) checkIcon.style.display = "block";
			}

			// Update dropdown text
			updateDropdownText();

			// Update select element and print to console
			updateSelectedClassUcIdList();
		});
	});

	// Update dropdown text based on selection
	function updateDropdownText() {
		let selectedItems = [];
		dropdownItems.forEach(item => {
			if (item.dataset.selected === "true") {
				selectedItems.push(item.querySelector(".dropdown-item-text").textContent.trim());
			}
		});

		if (selectedItems.length === 0) {
			dropdownText.textContent = "Select classrooms";
		} else if (selectedItems.length === 1) {
			dropdownText.textContent = selectedItems[0];
		} else {
			dropdownText.textContent = selectedItems.length + ' classrooms selected';
		}

	}

	// Initialize with pre-selected classrooms
	updateDropdownText();

	// Initialize the select element with pre-selected items and print to console
	updateSelectedClassUcIdList();

	// Add a change event listener to the select element (in case it's modified elsewhere)
	selectedClassUcIdList.addEventListener('change', function() {
		console.log("Select element changed directly");
		const selectedOptions = Array.from(this.selectedOptions).map(option => option.value);
		console.log("Selected Class UcIds:", selectedOptions);
	});
});