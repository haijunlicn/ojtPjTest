document.addEventListener("DOMContentLoaded", () => {
	// DOM Elements
	const simpleInput = document.getElementById("simple-input")
	const editorContainer = document.getElementById("announcement-editor-container")
	const cancelButton = document.getElementById("cancel-button")
	const postButton = document.getElementById("post-button")
	const announcementCard = document.getElementById("announcement-card")
	const announcementForm = document.getElementById("announcement-form")
	const fileUploadInput = document.getElementById("file-upload")
	const uploadBtn = document.getElementById("upload-btn")
	const selectedFilesList = document.getElementById("selected-files-list")
	const selectedLinkList = document.getElementById("selected-link-list")
	const linkInput = document.getElementById("link-input")
	const announcementToast = document.getElementById("announcement-toast")

	// Toolbar buttons
	const linkBtn = document.querySelector('.toolbar-btn[title="Insert link"]')

	// Event Listeners
	simpleInput.addEventListener("focus", showExpandedEditor)
	cancelButton.addEventListener("click", hideExpandedEditor)
	postButton.addEventListener("click", submitAnnouncement)
	uploadBtn.addEventListener("click", triggerFileUpload)
	fileUploadInput.addEventListener("change", handleFileSelection)

	// Add event listeners for link button
	linkBtn.addEventListener("click", insertLink)

	// Input event to enable/disable post button
	simpleInput.addEventListener("input", () => {
		updatePostButtonState()
	})

	// Click outside to cancel (if no content)
	document.addEventListener("click", (e) => {
		if (editorContainer.style.display === "block" && !announcementCard.contains(e.target)) {
			const content = simpleInput.value.trim()
			if (content === "" && selectedFilesList.children.length === 0 && selectedLinkList.children.length === 0) {
				hideExpandedEditor()
			} else if (confirm("Discard your announcement?")) {
				hideExpandedEditor()
			}
		}
	})

	// Functions
	function showExpandedEditor() {
		editorContainer.style.display = "block"
		announcementCard.classList.add("expanded")
		updatePostButtonState()
	}

	function hideExpandedEditor() {
		// Reset the editor
		simpleInput.value = ""
		editorContainer.style.display = "none"
		announcementCard.classList.remove("expanded")

		// Clear file list
		selectedFilesList.innerHTML = ""
		selectedLinkList.innerHTML = ""
		fileUploadInput.value = ""

		// Disable post button
		postButton.disabled = true
	}

	function updatePostButtonState() {
		// Enable/disable post button based on content
		const hasContent =
			simpleInput.value.trim() !== "" || selectedFilesList.children.length > 0 || selectedLinkList.children.length > 0
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

	function insertLink() {
		// Prompt user for link URL and text
		const url = prompt("Enter the URL:", "https://")
		if (url) {
			const text = prompt("Enter the link text:", "Link")
			if (text) {
				// Create a link item
				const linkItem = document.createElement("li")
				linkItem.className = "file-item"

				// Create link icon
				const linkIcon = document.createElement("i")
				linkIcon.className = "fas fa-link text-primary"
				linkIcon.style.marginRight = "10px"

				// Create link display
				const linkDisplay = document.createElement("a")
				linkDisplay.href = url
				linkDisplay.textContent = text
				linkDisplay.target = "_blank"
				linkDisplay.className = "text-primary"

				// Create link info container
				const linkInfo = document.createElement("div")
				linkInfo.className = "d-flex align-items-center flex-grow-1"
				linkInfo.appendChild(linkIcon)
				linkInfo.appendChild(linkDisplay)

				// Create remove button
				const removeBtn = document.createElement("button")
				removeBtn.className = "remove-file"
				removeBtn.innerHTML = '<i class="fas fa-times"></i>'
				removeBtn.onclick = (e) => {
					e.preventDefault()
					linkItem.remove()
					updatePostButtonState()
				}

				// Add elements to list item
				linkItem.appendChild(linkInfo)
				linkItem.appendChild(removeBtn)

				// Add to the link list
				selectedLinkList.appendChild(linkItem)

				// Add hidden input for the link
				const linkData = JSON.stringify({ url: url, text: text })

				// If we already have links, append to them
				if (linkInput.value) {
					linkInput.value += "," + linkData
				} else {
					linkInput.value = linkData
				}

				// Enable post button
				updatePostButtonState()
			}
		}
	}

	function submitAnnouncement() {
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

