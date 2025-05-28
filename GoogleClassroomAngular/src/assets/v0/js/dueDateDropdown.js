const noDueDateCheckbox = document.getElementById("noDueDate");
const dateInput = document.getElementById("dueDateInput");
const applyDueDateBtn = document.getElementById("applyDueDate");
const dueDateText = document.querySelector(".due-date-text");

// Set the minimum selectable date to today
const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
dateInput.min = today;

noDueDateCheckbox.addEventListener("change", function() {
	dateInput.disabled = this.checked;
	if (this.checked) {
		dateInput.value = "";
	}
});

applyDueDateBtn.addEventListener("click", () => {
	if (!noDueDateCheckbox.checked && dateInput.value) {
		dueDateText.textContent = `Due ${dateInput.value}`;
	} else {
		dueDateText.textContent = "No due date";
	}

	const dropdownInstance = bootstrap.Dropdown.getInstance(document.getElementById("dueDateDropdown"));
	if (dropdownInstance) dropdownInstance.hide();
});