/**
 * 
 */
document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const simpleInput = document.getElementById("simple-input")
	const editorContainer = document.getElementById("announcement-editor-container")
	const richEditor = document.getElementById("rich-editor")
	const cancelButton = document.getElementById("cancel-button")
	const postButton = document.getElementById("post-button")
	const announcementForm = document.getElementById("announcement-form")

	// Initialize editor state
	let isEditorOpen = false

	// Open rich editor when clicking on simple input
	if (simpleInput) {
		simpleInput.addEventListener("click", () => {
			openEditor()
		})
	}

	// Handle cancel button click
	if (cancelButton) {
		cancelButton.addEventListener("click", () => {
			closeEditor()
		})
	}

	// Handle post button click
	if (postButton) {
		postButton.addEventListener("click", () => {
			submitAnnouncement()
		})
	}

	// Function to open the rich editor
	function openEditor() {
		if (isEditorOpen) return

		// Hide simple input
		simpleInput.style.display = "none"

		// Show editor container
		editorContainer.style.display = "block"

		// Focus on rich editor
		if (richEditor) {
			richEditor.focus()
		}

		// Set editor state
		isEditorOpen = true

		// Initialize toolbar
		initializeToolbar()
	}

	// Function to close the rich editor
	function closeEditor() {
		if (!isEditorOpen) return

		// Show simple input
		simpleInput.style.display = "block"

		// Hide editor container
		editorContainer.style.display = "none"

		// Clear rich editor content
		if (richEditor) {
			richEditor.innerHTML = ""
		}

		// Clear file list
		const selectedFilesList = document.getElementById("selected-files-list")
		if (selectedFilesList) {
			selectedFilesList.innerHTML = ""
		}

		// Clear file input
		const fileUpload = document.getElementById("file-upload")
		if (fileUpload) {
			fileUpload.value = ""
		}

		// Reset link data
		window.linksData = []

		// Set editor state
		isEditorOpen = false

		// Disable post button
		if (postButton) {
			postButton.disabled = true
		}
	}

	// Function to submit the announcement
	function submitAnnouncement() {
		// Get content from rich editor
		const content = richEditor ? richEditor.innerHTML : ""

		// Set content to hidden input
		simpleInput.value = content

		// Submit the form
		if (announcementForm) {
			announcementForm.submit()
		}
	}

	// Function to initialize toolbar
	function initializeToolbar() {
		const toolbar = document.querySelector(".editor-toolbar")
		if (!toolbar || toolbar.dataset.initialized === "true") return

		// Add text formatting buttons
		const formatButtons = [
			{ icon: "fas fa-bold", command: "bold", title: "Bold" },
			{ icon: "fas fa-italic", command: "italic", title: "Italic" },
			{ icon: "fas fa-underline", command: "underline", title: "Underline" },
			{ icon: "fas fa-strikethrough", command: "strikeThrough", title: "Strikethrough" },
			{ icon: "fas fa-list-ul", command: "insertUnorderedList", title: "Bullet List" },
			{ icon: "fas fa-list-ol", command: "insertOrderedList", title: "Numbered List" },
		]

		// Create buttons and add to toolbar
		formatButtons.forEach((button) => {
			const btn = document.createElement("button")
			btn.type = "button"
			btn.className = "toolbar-btn"
			btn.title = button.title
			btn.innerHTML = `<i class="${button.icon}"></i>`

			btn.addEventListener("click", () => {
				document.execCommand(button.command, false, null)
				richEditor.focus()
			})

			// Insert before the upload button
			const uploadBtn = document.getElementById("upload-btn")
			if (uploadBtn) {
				toolbar.insertBefore(btn, uploadBtn)
			} else {
				toolbar.appendChild(btn)
			}
		})

		// Mark toolbar as initialized
		toolbar.dataset.initialized = "true"
	}

	// Initialize editor if there's content
	if (simpleInput && simpleInput.value.trim() !== "") {
		openEditor()
		richEditor.innerHTML = simpleInput.value
	}
})

