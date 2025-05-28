/**
 * 
 */

document.addEventListener('DOMContentLoaded', function() {
	// Get all assignment links in the dropdown
	const assignmentLinks = document.querySelectorAll('.dropdown-item');
	const studentSelector = document.querySelector(".student-selector")
	const allStudentsCheckbox = document.getElementById("allStudentsCheckbox")
	const doneButton = document.getElementById("doneSelectingStudents")

	// Add click event listener to the assignment links
	assignmentLinks.forEach(link => {
		if (link.textContent.trim() === 'Assignment') {
			link.addEventListener('click', function(e) {
				e.preventDefault();
				const assignmentModal = new bootstrap.Modal(document.getElementById('assignmentModal'));
				assignmentModal.show();
			});
		}
	});

	const classDropdownHeader = document.querySelector('.assignmentModal-class-dropdown-header span');
	const classCheckboxes = document.querySelectorAll('.assignmentModal-class-item input[type="checkbox"]');
	const defaultClassNameElement = document.getElementById('defaultClassName');
	const defaultClassName = defaultClassNameElement.dataset.defaultClassName;
	const selectedClassSelect = document.getElementById('selectedClassUcIdList');

	// Initialize header text
	updateClassDropdownHeader();
	updateSelectedClassList();

	// Update header text based on selected classes
	function updateClassDropdownHeader() {
		const checkedCount = document.querySelectorAll('.assignmentModal-class-item input[type="checkbox"]:checked').length;

		let headerText;
		if (checkedCount > 1) {
			headerText = checkedCount + ' classes selected';
			allStudentsCheckbox.checked = true;
			doneButton.click();
			studentSelector.classList.add('disabledDiv');
			console.log("added")
		} else {
			headerText = defaultClassName;;
			studentSelector.classList.remove('disabledDiv');
			console.log("removed")
		}

		classDropdownHeader.textContent = headerText;
	}

	function updateSelectedClassList() {
		// Clear all selected options
		selectedClassSelect.querySelectorAll('option').forEach(option => {
			option.selected = false;
		});

		// Select options that match checked checkboxes
		classCheckboxes.forEach(checkbox => {
			if (checkbox.checked) {
				const option = selectedClassSelect.querySelector('option[value="' + checkbox.value + '"]');
				if (option) {
					option.selected = true;
				}
			}
		});

		console.log([...selectedClassSelect.selectedOptions].map(option => option.value));
	}

	// Update header when checkboxes change
	classCheckboxes.forEach(checkbox => {
		if (!checkbox.disabled) {
			checkbox.addEventListener('change', () => {
				updateSelectedClassList();
				updateClassDropdownHeader();
			});
		}
	});

	// Make sure the current classroom checkbox can't be unchecked
	const currentClassCheckbox = document.querySelector('.assignmentModal-class-item input[disabled]');
	if (currentClassCheckbox) {
		const currentClassLabel = currentClassCheckbox.nextElementSibling;
		currentClassLabel.addEventListener('click', function(e) {
			e.preventDefault(); // Prevent toggling the disabled checkbox
		});
	}

});