document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const studentSelector = document.querySelector(".student-selector")
	const studentSelectionModal = document.getElementById("studentSelectionModal")
	const allStudentsCheckbox = document.getElementById("allStudentsCheckbox")
	const individualStudentCheckboxes = document.querySelectorAll('[data-student-checkbox="individual"]')
	const doneButton = document.getElementById("doneSelectingStudents")
	const selectedStudentIdsInput = document.getElementById("selectedStudentIds")
	const studentSelectorText = document.querySelector(".student-selector-text")
	const assignButton = document.querySelector(".assignmentModal-assign-btn")
	const titleInput = document.querySelector(".assignmentModal-title-input");
	const closeButton = studentSelectionModal ? studentSelectionModal.querySelector(".btn-close") : null

	allStudentsCheckbox.checked = true;
	
	// Initialize Bootstrap modal with options to prevent closing
	let studentModal = null
	if (studentSelectionModal) {
		// Bootstrap is loaded via CDN in the HTML file
		studentModal = new bootstrap.Modal(studentSelectionModal, {
			backdrop: "static", // Prevent closing when clicking outside
			keyboard: false, // Prevent closing when pressing Escape key
		})
	}

	// Prevent the close button from closing the modal
	if (closeButton) {
		closeButton.addEventListener("click", (e) => {
			e.preventDefault()
			// Do nothing, which prevents the modal from closing
		})
	}

	// Initialize selected students (default to all individual student IDs)
	let selectedStudents = []
	// Add all individual student IDs to the initial selection
	individualStudentCheckboxes.forEach((checkbox) => {
		selectedStudents.push(checkbox.value)
	})
	updateSelectedStudentsInput()

	// Log initial selection
	console.log("Initial selected students:", selectedStudents)


	// Open modal when clicking on the student selector
	if (studentSelector) {
		studentSelector.addEventListener("click", (e) => {
			e.preventDefault()
			e.stopPropagation()

			// Update checkboxes based on current selection before showing modal
			updateCheckboxesFromSelection()
			studentModal.show()
		})
	}

	// Handle "All students" checkbox
	if (allStudentsCheckbox) {
		allStudentsCheckbox.addEventListener("change", function() {
			if (this.checked) {
				// Select all students
				individualStudentCheckboxes.forEach((checkbox) => {
					checkbox.checked = true
				})

				// Clear the array and add all individual student IDs
				selectedStudents = []
				individualStudentCheckboxes.forEach((checkbox) => {
					if (!selectedStudents.includes(checkbox.value)) {
						selectedStudents.push(checkbox.value)
					}
				})
			} else {
				// Deselect all students
				individualStudentCheckboxes.forEach((checkbox) => {
					checkbox.checked = false
				})
				selectedStudents = []
			}

			// Update the input and log changes
			updateSelectedStudentsInput()
			console.log("Selected students after 'All students' change:", selectedStudents)
		})
	}

	// Handle individual student checkboxes
	individualStudentCheckboxes.forEach((checkbox) => {
		checkbox.addEventListener("change", function() {
			if (this.checked) {
				// Add student to selection if not already included
				if (!selectedStudents.includes(this.value)) {
					selectedStudents.push(this.value)
				}

				// Check if all students are selected
				const allChecked = Array.from(individualStudentCheckboxes).every((cb) => cb.checked)
				if (allChecked && allStudentsCheckbox) {
					allStudentsCheckbox.checked = true
				}
			} else {
				// Remove student from selection
				selectedStudents = selectedStudents.filter((id) => id !== this.value)

				// Uncheck "All students" if any individual student is unchecked
				if (allStudentsCheckbox) {
					allStudentsCheckbox.checked = false
				}
			}

			// Update the input and log changes
			updateSelectedStudentsInput()
			console.log("Selected students after individual change:", selectedStudents)
		})

		// Make the entire row clickable
		const parentItem = checkbox.closest(".student-item")
		if (parentItem) {
			parentItem.addEventListener("click", (e) => {
				// Prevent clicking on the checkbox itself from triggering this
				if (e.target !== checkbox && e.target.tagName !== "INPUT") {
					checkbox.checked = !checkbox.checked
					// Trigger the change event
					const changeEvent = new Event("change")
					checkbox.dispatchEvent(changeEvent)
				}
			})
		}
	})

	// Handle "Done" button click - only way to close the modal
	if (doneButton) {
		doneButton.addEventListener("click", () => {
			updateSelectedStudentsInput()
			updateStudentSelectorText()

			// Log final selected students when Done is clicked
			console.log("Final selected students:", selectedStudents)
			console.log("Selected student IDs input value:", selectedStudentIdsInput.value)

			studentModal.hide()
		})
	}

	// Update checkboxes based on current selection
	function updateCheckboxesFromSelection() {
		// Reset all checkboxes
		if (allStudentsCheckbox) allStudentsCheckbox.checked = false
		individualStudentCheckboxes.forEach((checkbox) => {
			checkbox.checked = false
		})

		// Check the appropriate checkboxes
		const allIndividualIds = Array.from(individualStudentCheckboxes).map((cb) => cb.value)
		const allSelected = allIndividualIds.every((id) => selectedStudents.includes(id))

		if (allSelected) {
			if (allStudentsCheckbox) allStudentsCheckbox.checked = true
			individualStudentCheckboxes.forEach((checkbox) => {
				checkbox.checked = true
			})
		} else {
			individualStudentCheckboxes.forEach((checkbox) => {
				if (selectedStudents.includes(checkbox.value)) {
					checkbox.checked = true
				}
			})
		}
	}

	// Update hidden input with selected student IDs
	function updateSelectedStudentsInput() {
		if (selectedStudentIdsInput) {
			selectedStudentIdsInput.value = selectedStudents.join(",")
			// Log whenever the hidden input is updated
			console.log("Updated selectedStudentIds input:", selectedStudentIdsInput.value)
		}
	}

	function toggleButtonState(studentCount) {
		const isAllStudentsChecked = allStudentsCheckbox && allStudentsCheckbox.checked;
		console.log("is checked : " + allStudentsCheckbox.checked);
		assignButton.disabled = (titleInput.value.trim() === "" || (studentCount === 0 && !isAllStudentsChecked));
	}


	titleInput.addEventListener("input", function() {
		toggleButtonState(selectedStudents.length);
	});
	toggleButtonState(selectedStudents.length);

	// Update the text displayed in the student selector
	function updateStudentSelectorText() {
		if (!studentSelectorText) return

		const allIndividualIds = Array.from(individualStudentCheckboxes).map((cb) => cb.value)
		const allSelected = allIndividualIds.every((id) => selectedStudents.includes(id))

		if (allSelected) {
			studentSelectorText.textContent = "All students"
			// if (assignButton && titleInput.value.trim() != "") assignButton.disabled = false
		} else if (selectedStudents.length === 0) {
			studentSelectorText.textContent = "No students selected"
			// if (assignButton || titleInput.value.trim() === "") assignButton.disabled = true
		} else if (selectedStudents.length === 1) {
			// Find the student name
			const studentCheckbox = document.querySelector(
				`[data-student-checkbox="individual"][value="${selectedStudents[0]}"]`
			)
			if (studentCheckbox) {
				const studentName = studentCheckbox.closest(".form-check").querySelector("span").textContent
				studentSelectorText.textContent = studentName
			} else {
				studentSelectorText.textContent = "1 student"
			}
		} else {
			studentSelectorText.textContent = `${selectedStudents.length} students`
		}

		toggleButtonState(selectedStudents.length);
	}

	// Initialize the student selector text
	updateStudentSelectorText()
})

