document.addEventListener("DOMContentLoaded", () => {
	// Elements
	const uploadBtn = document.getElementById("upload-btn")
	const linkBtn = document.getElementById("link-btn")
	const fileUpload = document.getElementById("file-upload")
	const selectedFilesList = document.getElementById("selected-files-list")
	const postButton = document.getElementById("post-button")
	const linkUploadInput = document.getElementById("link-upload")
	const announcementForm = document.getElementById("announcement-form")

	// Link Modal Elements
	const linkModal = new bootstrap.Modal(document.getElementById("linkModal"))
	const linkForm = document.getElementById("linkForm")
	const linkNameInput = document.getElementById("linkName")
	const linkURLInput = document.getElementById("linkURL")
	const addLinkBtn = document.getElementById("addLinkBtn")

	// Create a separate list for links if needed
	const selectedLinkList = document.createElement("ul")
	selectedLinkList.id = "selected-links-list"
	selectedLinkList.className = "file-list"

	// Add the link list after the file list
	if (selectedFilesList && selectedFilesList.parentNode) {
		selectedFilesList.parentNode.insertBefore(selectedLinkList, selectedFilesList.nextSibling)
	}

	// Store links data
	window.linksData = window.linksData || []
	const linksData = window.linksData

	// Event Listeners
	if (uploadBtn) {
		uploadBtn.addEventListener("click", () => {
			fileUpload.click()
		})
	}

	if (linkBtn) {
		linkBtn.addEventListener("click", () => {
			// Reset link form
			if (linkForm) {
				linkForm.reset()
				resetLinkFormValidation()
			}
			// Show link modal
			linkModal.show()
		})
	}

	if (fileUpload) {
		fileUpload.addEventListener("change", function() {
			handleFileSelection(this.files)
		})
	}

	if (addLinkBtn) {
		addLinkBtn.addEventListener("click", handleLinkSubmit)
	}

	// Add input event listeners for real-time validation
	if (linkNameInput || linkURLInput) {
		linkNameInput.addEventListener("input", validateLinkForm)
		linkURLInput.addEventListener("keyup", validateLinkForm)
	}

	// Handle drag and drop
	const editorContainer = document.getElementById("announcement-editor-container")
	if (editorContainer) {
		editorContainer.addEventListener("dragover", function(e) {
			e.preventDefault()
			this.classList.add("drag-over")
		})

		editorContainer.addEventListener("dragleave", function() {
			this.classList.remove("drag-over")
		})

		editorContainer.addEventListener("drop", function(e) {
			e.preventDefault()
			this.classList.remove("drag-over")

			if (e.dataTransfer.files.length > 0) {
				handleFileSelection(e.dataTransfer.files)
			}
		})
	}

	// Handle form submission
	if (announcementForm) {
		announcementForm.addEventListener("submit", (e) => {
			// Add links data to the form
			if (linksData.length > 0) {
				linkUploadInput.value = JSON.stringify(linksData)
			}

			// Log submission for debugging
			console.log("Submitting form with files and links")
			console.log("Files:", fileUpload.files)
			console.log("Links:", linksData)
		})
	}

	// Function to handle file selection
	function handleFileSelection(files) {
		if (!files || files.length === 0) return

		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			addFileToList(file)
		}

		// Enable post button if there's content
		updatePostButtonState()
	}

	// Function to add file to the list
	function addFileToList(file) {
		const fileItem = document.createElement("li")
		fileItem.className = "file-item"

		// Get file icon based on type
		const fileIcon = getFileIcon(file.type)

		// Format file size
		const fileSize = formatFileSize(file.size)

		fileItem.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1">
        <div class="file-item-icon">${fileIcon}</div>
        <div class="file-item-details">
          <div class="file-item-name">${file.name}</div>
          <div class="file-item-size">${fileSize}</div>
        </div>
      </div>
      <button type="button" class="file-item-remove" title="Remove file">
        <i class="fas fa-times"></i>
      </button>
    `

		// Add remove button event listener
		const removeButton = fileItem.querySelector(".file-item-remove")
		removeButton.addEventListener("click", () => {
			// Remove file from the list
			fileItem.remove()

			// Remove file from the input
			const dataTransfer = new DataTransfer()
			const files = fileUpload.files

			for (let i = 0; i < files.length; i++) {
				if (files[i] !== file) {
					dataTransfer.items.add(files[i])
				}
			}

			fileUpload.files = dataTransfer.files

			// Update post button state
			updatePostButtonState()
		})

		// Add file item to the list
		selectedFilesList.appendChild(fileItem)
	}

	// Function to validate link form inputs
	function validateLinkForm() {
		let isValid = false; // Start with false

		let nameValid = false;
		let urlValid = false;

		// Validate link name
		if (linkNameInput.value.trim()) {
			linkNameInput.classList.remove("is-invalid");
			linkNameInput.classList.add("is-valid");
			nameValid = true;
		} else {
			linkNameInput.classList.add("is-invalid");
			linkNameInput.classList.remove("is-valid");
		}

		// Validate URL
		const urlValue = linkURLInput.value.trim();
		if (urlValue && /^https?:\/\//i.test(urlValue)) {
			try {
				new URL(urlValue); // Validate URL format
				linkURLInput.classList.remove("is-invalid");
				linkURLInput.classList.add("is-valid");
				urlValid = true;
			} catch (e) {
				linkURLInput.classList.add("is-invalid");
				linkURLInput.classList.remove("is-valid");
			}
		} else {
			linkURLInput.classList.add("is-invalid");
			linkURLInput.classList.remove("is-valid");
		}

		// Form is valid only if both inputs are valid
		isValid = nameValid && urlValid;

		// Enable/disable submit button
		if (addLinkBtn) {
			addLinkBtn.disabled = !isValid;
		}

		return isValid;
	}



	// Reset form validation state
	function resetLinkFormValidation() {
		if (linkNameInput) {
			linkNameInput.classList.remove("is-invalid", "is-valid")
		}
		if (linkURLInput) {
			linkURLInput.classList.remove("is-invalid", "is-valid")
		}
		if (addLinkBtn) {
			addLinkBtn.disabled = false
		}
	}

	// Handle link form submission
	function handleLinkSubmit() {
		if (!validateLinkForm()) {
			return
		}

		const linkName = linkNameInput.value.trim()
		const linkURL = linkURLInput.value.trim()
		// Ensure URL has protocol
		const formattedURL = linkURL.startsWith("http") ? linkURL : "http://" + linkURL

		// Create formatted entry
		const linkEntry = `${linkName}|${formattedURL}`

		// Store in hidden input field
		let currentLinks = linkUploadInput.value ? linkUploadInput.value.split(",") : []

		// Prevent duplicate links
		if (currentLinks.includes(linkEntry)) {
			alert("This link is already added.")
			return
		}

		currentLinks.push(linkEntry)
		linkUploadInput.value = currentLinks.join(",")

		// Add link to the data array
		const linkData = { url: formattedURL, title: linkName, description: "" }
		linksData.push(linkData)

		// Create link item with the same styling as file items
		const linkItem = document.createElement("li")
		linkItem.className = "file-item link-item"

		linkItem.innerHTML = `
      <div class="d-flex align-items-center flex-grow-1">
        <div class="file-item-icon"><i class="fas fa-link text-primary"></i></div>
        <div class="file-item-details">
          <div class="file-item-name"><a href="${formattedURL}" target="_blank">${linkName}</a></div>
          <div class="file-item-url">${formattedURL}</div>
        </div>
      </div>
      <button type="button" class="file-item-remove" title="Remove link">
        <i class="fas fa-times"></i>
      </button>
    `

		// Add remove button event listener
		const removeButton = linkItem.querySelector(".file-item-remove")
		removeButton.addEventListener("click", () => {
			// Remove link from the list
			linkItem.remove()

			// Remove link from the data array
			const index = linksData.findIndex((link) => link.url === formattedURL)
			if (index !== -1) {
				linksData.splice(index, 1)
			}

			// Remove from hidden input
			currentLinks = currentLinks.filter((item) => item !== linkEntry)
			linkUploadInput.value = currentLinks.join(",")

			// Update post button state
			updatePostButtonState()
		})

		// Add link item to the list
		selectedFilesList.appendChild(linkItem)

		// Update post button state
		updatePostButtonState()

		// Reset form and hide modal
		if (linkForm) {
			linkForm.reset()
			resetLinkFormValidation()
		}
/*		linkForm.reset()
		resetLinkFormValidation()*/
		linkModal.hide()
	}

	// Function to get file icon based on type
	function getFileIcon(fileType) {
		if (fileType.startsWith("image/")) {
			return '<i class="fas fa-file-image text-info"></i>'
		} else if (fileType.startsWith("video/")) {
			return '<i class="fas fa-file-video text-danger"></i>'
		} else if (fileType.startsWith("audio/")) {
			return '<i class="fas fa-file-audio text-warning"></i>'
		} else if (fileType === "application/pdf") {
			return '<i class="fas fa-file-pdf text-danger"></i>'
		} else if (
			fileType === "application/msword" ||
			fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		) {
			return '<i class="fas fa-file-word text-primary"></i>'
		} else if (
			fileType === "application/vnd.ms-excel" ||
			fileType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			return '<i class="fas fa-file-excel text-success"></i>'
		} else if (
			fileType === "application/vnd.ms-powerpoint" ||
			fileType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
		) {
			return '<i class="fas fa-file-powerpoint text-warning"></i>'
		} else {
			return '<i class="fas fa-file text-secondary"></i>'
		}
	}

	// Function to format file size
	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes"

		const k = 1024
		const sizes = ["Bytes", "KB", "MB", "GB"]
		const i = Math.floor(Math.log(bytes) / Math.log(k))

		return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
	}

	// Function to update post button state
	function updatePostButtonState() {
		const richEditor = document.getElementById("rich-editor")
		const hasContent = richEditor && richEditor.textContent.trim() !== ""
		const hasFiles = fileUpload && fileUpload.files.length > 0
		const hasLinks = linksData.length > 0

		if (postButton) {
			postButton.disabled = !(hasContent || hasFiles || hasLinks)
		}

		// Update assign button in assignment modal if it exists
		/*    const assignBtn = document.querySelector(".assignmentModal-assign-btn")
			if (assignBtn) {
			  const titleInput = document.querySelector(".assignmentModal-title-input")
			  const hasTitle = titleInput && titleInput.value.trim() !== ""
			  assignBtn.disabled = !(hasTitle)
			}*/
	}

	// Function to show toast notification
	function showToast(message, type = "success") {
		// Create toast container if it doesn't exist
		let toastContainer = document.querySelector(".toast-container")
		if (!toastContainer) {
			toastContainer = document.createElement("div")
			toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
			document.body.appendChild(toastContainer)
		}

		// Create toast element
		const toastId = "toast-" + Date.now()
		const toast = document.createElement("div")
		toast.className = `toast bg-${type} text-white`
		toast.id = toastId
		toast.setAttribute("role", "alert")
		toast.setAttribute("aria-live", "assertive")
		toast.setAttribute("aria-atomic", "true")

		toast.innerHTML = `
      <div class="toast-header bg-${type} text-white">
        <strong class="me-auto">Notification</strong>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        ${message}
      </div>
    `

		// Add toast to container
		toastContainer.appendChild(toast)

		// Initialize and show toast
		const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 5000 })
		bsToast.show()

		// Remove toast after it's hidden
		toast.addEventListener("hidden.bs.toast", () => {
			toast.remove()
		})
	}

	// Initialize the post button state
	updatePostButtonState()

	// Add event listener to rich editor for content changes
	const richEditor = document.getElementById("rich-editor")
	if (richEditor) {
		richEditor.addEventListener("input", updatePostButtonState)
	}

	// Add event listener to title input for assignment modal
	const titleInput = document.querySelector(".assignmentModal-title-input")
	if (titleInput) {
		titleInput.addEventListener("input", updatePostButtonState)
	}

	// Expose the updatePostButtonState function globally
	window.updatePostButtonState = updatePostButtonState
})