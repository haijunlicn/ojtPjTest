document.addEventListener("DOMContentLoaded", () => {
	// DOM Elements
	const simpleInput = document.getElementById("simple-input")
	const editorContainer = document.getElementById("announcement-editor-container")
	const richEditor = document.createElement("div")
	richEditor.id = "rich-editor"
	richEditor.className = "rich-editor"
	richEditor.contentEditable = true

	// Replace the existing rich-editor div with our new one
	const existingRichEditor = document.getElementById("rich-editor")
	if (existingRichEditor) {
		existingRichEditor.parentNode.replaceChild(richEditor, existingRichEditor)
	}

	const cancelButton = document.getElementById("cancel-button")
	const postButton = document.getElementById("post-button")
	const announcementCard = document.getElementById("announcement-card")
	const announcementForm = document.getElementById("announcement-form")
	const fileUploadInput = document.getElementById("file-upload")
	const uploadBtn = document.getElementById("upload-btn")
	const selectedFilesList = document.getElementById("selected-files-list")
	const linkBtn = document.querySelector('.toolbar-btn[title="Insert link"]')
	const announcementToast = document.getElementById("announcement-toast")

	// Link Modal Elements
	const linkModal = new bootstrap.Modal(document.getElementById("linkModal"))
	const linkForm = document.getElementById("linkForm")
	const linkNameInput = document.getElementById("linkName")
	const linkURLInput = document.getElementById("linkURL")
	const addLinkBtn = document.getElementById("addLinkBtn")

	// Create elements for links
	const selectedLinkList = document.createElement("ul")
	selectedLinkList.id = "selected-links-list"
	selectedLinkList.className = "file-list"

	// Add the link list after the file list
	if (selectedFilesList && selectedFilesList.parentNode) {
		selectedFilesList.parentNode.insertBefore(selectedLinkList, selectedFilesList.nextSibling)
	}

	// Create hidden input for links
	const linkInput = document.getElementById("link-upload")

	// Create toolbar buttons for text formatting
	createTextFormattingToolbar()

	// Event Listeners
	simpleInput.addEventListener("focus", showExpandedEditor)
	cancelButton.addEventListener("click", hideExpandedEditor)
	postButton.addEventListener("click", submitAnnouncement)
	uploadBtn.addEventListener("click", triggerFileUpload)
	fileUploadInput.addEventListener("change", handleFileSelection)
	linkBtn.addEventListener("click", showLinkModal)
	addLinkBtn.addEventListener("click", handleLinkSubmit)

	// Form validation events
	linkNameInput.addEventListener("input", validateLinkForm)
	linkURLInput.addEventListener("input", validateLinkForm)

	// Rich editor events
	richEditor.addEventListener("input", () => {
		updatePostButtonState()
	})

	// Input event to enable/disable post button
	simpleInput.addEventListener("input", () => {
		updatePostButtonState()
	})

	// Functions
	function createTextFormattingToolbar() {
		const toolbar = document.querySelector(".editor-toolbar")

		// Add formatting buttons before the existing buttons
		const formattingButtons = [
			{ command: "bold", icon: "fas fa-bold", title: "Bold" },
			{ command: "italic", icon: "fas fa-italic", title: "Italic" },
			{ command: "underline", icon: "fas fa-underline", title: "Underline" },
			{ command: "insertUnorderedList", icon: "fas fa-list-ul", title: "Bullet List" },
			{ command: "insertOrderedList", icon: "fas fa-list-ol", title: "Numbered List" },
		]

		formattingButtons.forEach((btn) => {
			const button = document.createElement("button")
			button.type = "button"
			button.className = "toolbar-btn"
			button.title = btn.title
			button.innerHTML = `<i class="${btn.icon}"></i>`
			button.addEventListener("click", () => {
				document.execCommand(btn.command, false, null)
				richEditor.focus()
			})

			// Insert at the beginning of the toolbar
			toolbar.insertBefore(button, toolbar.firstChild)
		})

		// Add a separator
		const separator = document.createElement("div")
		separator.className = "toolbar-separator"
		toolbar.insertBefore(separator, uploadBtn)
	}

	function showExpandedEditor() {
		// Transfer any text from the simple input to the rich editor
		if (simpleInput.value.trim()) {
			richEditor.innerHTML = simpleInput.value
		}

		simpleInput.style.display = "none"
		editorContainer.style.display = "block"
		announcementCard.classList.add("expanded")
		richEditor.focus()
		updatePostButtonState()
	}

	function hideExpandedEditor() {
		// Reset the editor
		richEditor.innerHTML = ""
		simpleInput.value = ""
		simpleInput.style.display = "block"
		editorContainer.style.display = "none"
		announcementCard.classList.remove("expanded")

		// Clear file and link lists
		selectedFilesList.innerHTML = ""
		selectedLinkList.innerHTML = ""
		fileUploadInput.value = ""
		linkInput.value = ""

		// Disable post button
		postButton.disabled = true
	}

	function updatePostButtonState() {
		// Enable/disable post button based on content
		const hasContent =
			richEditor.innerHTML.trim() !== "" ||
			selectedFilesList.children.length > 0 ||
			selectedLinkList.children.length > 0
		postButton.disabled = !hasContent
	}

	function triggerFileUpload() {
		fileUploadInput.click()
	}

	function handleFileSelection() {
		const files = fileUploadInput.files
		if (files.length > 0) {
			// Add each file to the list
			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				addFileToList(file)
			}

			// Enable post button since we have files
			updatePostButtonState()
		}
	}

	function addFileToList(file) {
		const fileItem = document.createElement("li")
		fileItem.className = "file-item"

		// Create file icon based on file type
		const fileIcon = document.createElement("i")
		fileIcon.className = getFileIconClass(file.name)
		fileIcon.style.marginRight = "10px"

		// Create file name display
		const fileName = document.createElement("span")
		fileName.textContent = file.name

		// Create file info container
		const fileInfo = document.createElement("div")
		fileInfo.className = "d-flex align-items-center flex-grow-1"
		fileInfo.appendChild(fileIcon)
		fileInfo.appendChild(fileName)

		// Create remove button
		const removeBtn = document.createElement("button")
		removeBtn.className = "remove-file"
		removeBtn.innerHTML = '<i class="fas fa-times"></i>'
		removeBtn.onclick = (e) => {
			e.preventDefault() // Prevent form submission
			fileItem.remove()
			// Check if we still have content or files
			updatePostButtonState()
		}

		// Add elements to list item
		fileItem.appendChild(fileInfo)
		fileItem.appendChild(removeBtn)

		// Add to the list
		selectedFilesList.appendChild(fileItem)
	}

	function getFileIconClass(filename) {
		const extension = filename.split(".").pop().toLowerCase()

		// Map file extensions to Font Awesome icons
		const iconMap = {
			pdf: "fas fa-file-pdf text-danger",
			doc: "fas fa-file-word text-primary",
			docx: "fas fa-file-word text-primary",
			xls: "fas fa-file-excel text-success",
			xlsx: "fas fa-file-excel text-success",
			ppt: "fas fa-file-powerpoint text-warning",
			pptx: "fas fa-file-powerpoint text-warning",
			jpg: "fas fa-file-image text-info",
			jpeg: "fas fa-file-image text-info",
			png: "fas fa-file-image text-info",
			gif: "fas fa-file-image text-info",
			zip: "fas fa-file-archive text-secondary",
			rar: "fas fa-file-archive text-secondary",
			txt: "fas fa-file-alt text-secondary",
			mp3: "fas fa-file-audio text-info",
			mp4: "fas fa-file-video text-danger",
			mov: "fas fa-file-video text-danger",
		}

		return iconMap[extension] || "fas fa-file text-secondary"
	}

	// Show the link modal
	function showLinkModal() {
		// Reset form
		linkForm.reset()
		resetLinkFormValidation()

		// Show modal
		linkModal.show()

		// Focus on first input
		setTimeout(() => {
			linkNameInput.focus()
		}, 500)
	}

	// Validate link form inputs
	function validateLinkForm() {
		let isValid = true

		// Validate link name
		if (!linkNameInput.value.trim()) {
			linkNameInput.classList.add("is-invalid")
			isValid = false
		} else {
			linkNameInput.classList.remove("is-invalid")
			linkNameInput.classList.add("is-valid")
		}

		// Validate URL (simple validation)
		const urlValue = linkURLInput.value.trim()
		if (!urlValue) {
			linkURLInput.classList.add("is-invalid")
			isValid = false
		} else {
			// Check if it's a valid URL format
			try {
				new URL(urlValue)
				linkURLInput.classList.remove("is-invalid")
				linkURLInput.classList.add("is-valid")
			} catch (e) {
				linkURLInput.classList.add("is-invalid")
				isValid = false
			}
		}

		// Enable/disable submit button
		addLinkBtn.disabled = !isValid

		return isValid
	}

	// Reset form validation state
	function resetLinkFormValidation() {
		linkNameInput.classList.remove("is-invalid", "is-valid")
		linkURLInput.classList.remove("is-invalid", "is-valid")
		addLinkBtn.disabled = false
	}

	// Handle link form submission
	function handleLinkSubmit() {
		if (!validateLinkForm()) {
			return
		}
		
		const linkName = linkNameInput.value.trim()
		const linkURL = linkURLInput.value.trim()

		// Create formatted entry
		const linkEntry = `${linkName}|${linkURL}`

		// Store in hidden input field
		let currentLinks = linkInput.value ? linkInput.value.split(",") : []

		// Prevent duplicate links
		if (currentLinks.includes(linkEntry)) {
			alert("This link is already added.")
			return
		}

		currentLinks.push(linkEntry)
		linkInput.value = currentLinks.join(",")

		// Create list item
		const listItem = document.createElement("li")
		listItem.className = "file-item d-flex align-items-center"

		// Add link icon
		const linkIcon = document.createElement("i")
		linkIcon.className = "fas fa-link text-primary"
		linkIcon.style.marginRight = "10px"

		// Create link content
		const linkContent = document.createElement("div")
		linkContent.className = "d-flex align-items-center flex-grow-1"
		linkContent.appendChild(linkIcon)

		// Add clickable link
		const linkText = document.createElement("a")
		linkText.href = linkURL
		linkText.target = "_blank"
		linkText.textContent = linkName
		linkContent.appendChild(linkText)

		// Add link content to list item
		listItem.appendChild(linkContent)

		// Create remove button
		const removeBtn = document.createElement("button")
		removeBtn.className = "remove-file btn btn-sm ms-2"
		removeBtn.innerHTML = '<i class="fas fa-times"></i>'

		// Remove functionality
		removeBtn.addEventListener("click", (e) => {
			e.preventDefault()
			listItem.remove()
			currentLinks = currentLinks.filter((item) => item !== linkEntry)
			linkInput.value = currentLinks.join(",")
			updatePostButtonState()
		})

		// Add remove button to list item
		listItem.appendChild(removeBtn)

		// Append to the list
		selectedLinkList.appendChild(listItem)

		// Update post button state
		updatePostButtonState()

		// Hide modal
		linkModal.hide()
	}

	function submitAnnouncement() {
		// Create a hidden input to store the HTML content
		const contentInput = document.createElement("input")
		contentInput.type = "hidden"
		contentInput.name = "content"
		contentInput.value = richEditor.innerHTML
		announcementForm.appendChild(contentInput)

		// Submit the form
		announcementForm.submit()

		// Show toast notification if it exists
		if (announcementToast) {
			try {
				const toast = new bootstrap.Toast(announcementToast)
				toast.show()
			} catch (e) {
				console.log("Toast notification not available")
			}
		}

		// Reset the editor
		hideExpandedEditor()
	}

	// Initialize toast if element exists and bootstrap is available
	if (announcementToast) {
		try {
			const toast = new bootstrap.Toast(announcementToast)
		} catch (error) {
			console.error("Bootstrap Toast is not initialized properly:", error)
		}
	}
})

