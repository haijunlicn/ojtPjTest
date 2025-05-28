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
	const announcementToast = document.getElementById("announcement-toast")

	// Toolbar buttons
	const linkBtn = document.querySelector('.toolbar-btn[title="Insert link"]')

	// Event Listeners
	simpleInput.addEventListener("focus", showExpandedEditor)
	cancelButton.addEventListener("click", hideExpandedEditor)
	postButton.addEventListener("click", submitAnnouncement)
	uploadBtn.addEventListener("click", triggerFileUpload)
	fileUploadInput.addEventListener("change", handleFileSelection)

	// Add event listeners for link, image, and video buttons
	linkBtn.addEventListener("click", insertLink)

	// Input event to enable/disable post button
	simpleInput.addEventListener("input", () => {
		updatePostButtonState()
	})

	// Click outside to cancel (if no content)
	document.addEventListener("click", (e) => {
		if (editorContainer.style.display === "block" && !announcementCard.contains(e.target)) {
			const content = simpleInput.value.trim()
			if (content === "" && selectedFilesList.children.length === 0) {
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
		fileUploadInput.value = ""

		// Disable post button
		postButton.disabled = true
	}

	function updatePostButtonState() {
		// Enable/disable post button based on content
		const hasContent = simpleInput.value.trim() !== "" 
							|| selectedFilesList.children.length > 0
							|| selectedLinkList.children.length > 0
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

		// Create file name display
		const fileName = document.createElement("span")
		fileName.textContent = file.name

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
		fileItem.appendChild(fileName)
		fileItem.appendChild(removeBtn)

		// Add to the list
		selectedFilesList.appendChild(fileItem)
	}
	
	const linkInput = document.getElementById("link-input");
	    const linkList = document.getElementById("selected-link-list");
	    const insertLinkButton = document.querySelector(".toolbar-btn[title='Insert link']");

	    insertLinkButton.addEventListener("click", function () {
	        // Ask user for link details
	        const linkName = prompt("Enter link name:");
	        const linkURL = prompt("Enter link URL:");

	        if (linkName && linkURL) {
	            // Create formatted entry (e.g., "Google|https://google.com")
	            const linkEntry = `${linkName}|${linkURL}`;

	            // Store in hidden input field
	            let currentLinks = linkInput.value ? linkInput.value.split(",") : [];
	            currentLinks.push(linkEntry);
	            linkInput.value = currentLinks.join(",");

	            // Display the link in the list
	            const listItem = document.createElement("li");
	            listItem.innerHTML = `<a href="${linkURL}" target="_blank">${linkName}</a>
	                                  <button type="button" class="remove-link">✖</button>`;
	            linkList.appendChild(listItem);

	            // Remove button functionality
	            listItem.querySelector(".remove-link").addEventListener("click", function () {
	                listItem.remove();
	                currentLinks = currentLinks.filter(item => item !== linkEntry);
	                linkInput.value = currentLinks.join(",");
	            });
	        }
	    });

	function insertLink() {
		// Prompt user for link URL and text
		const url = prompt("Enter the URL:", "https://")
		if (url) {
			const text = prompt("Enter the link text:", "Link")
			if (text) {
				// Create a link item
				const linkItem = document.createElement("li")
				linkItem.className = "file-item"

				// Create link display
				const linkDisplay = document.createElement("a")
				linkDisplay.href = url
				linkDisplay.textContent = text
				linkDisplay.target = "_blank"
				linkDisplay.className = "text-primary"

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
				linkItem.appendChild(document.createTextNode("Link: "))
				linkItem.appendChild(linkDisplay)
				linkItem.appendChild(removeBtn)

				// Add to the list
				selectedLinkList.appendChild(linkItem)

				// Add hidden input for the link
				const linkInput = document.createElement("input")
				linkInput.type = "hidden"
				linkInput.name = "links[]"
				linkInput.value = JSON.stringify({ url: url, text: text })
				announcementForm.appendChild(linkInput)

				// Enable post button
				updatePostButtonState()
			}
		}
	}

	function insertImage() {
		// Two options: URL or upload
		if (confirm("Do you want to upload an image? Click OK to upload or Cancel to use a URL.")) {
			// Create a temporary file input for image upload
			const imageInput = document.createElement("input")
			imageInput.type = "file"
			imageInput.accept = "image/*"
			imageInput.style.display = "none"
			document.body.appendChild(imageInput)

			imageInput.addEventListener("change", function() {
				if (this.files && this.files[0]) {
					const file = this.files[0]
					// Add to file list with image preview
					addImageToList(file)
					// Remove the temporary input
					document.body.removeChild(imageInput)
				}
			})

			imageInput.click()
		} else {
			// Prompt for image URL
			const url = prompt("Enter the image URL:", "https://")
			if (url) {
				const alt = prompt("Enter image description (alt text):", "")

				// Create an image item
				const imageItem = document.createElement("li")
				imageItem.className = "file-item"

				// Create image preview
				const imagePreview = document.createElement("div")
				imagePreview.className = "d-flex align-items-center"

				const imgThumb = document.createElement("img")
				imgThumb.src = url
				imgThumb.alt = alt || "Image"
				imgThumb.style.maxHeight = "40px"
				imgThumb.style.maxWidth = "40px"
				imgThumb.style.marginRight = "10px"

				// Create remove button
				const removeBtn = document.createElement("button")
				removeBtn.className = "remove-file"
				removeBtn.innerHTML = '<i class="fas fa-times"></i>'
				removeBtn.onclick = (e) => {
					e.preventDefault()
					imageItem.remove()
					updatePostButtonState()
				}

				// Add elements to preview
				imagePreview.appendChild(imgThumb)
				imagePreview.appendChild(document.createTextNode("Image from URL"))

				// Add elements to list item
				imageItem.appendChild(imagePreview)
				imageItem.appendChild(removeBtn)

				// Add to the list
				selectedFilesList.appendChild(imageItem)

				// Add hidden input for the image URL
				const imageInput = document.createElement("input")
				imageInput.type = "hidden"
				imageInput.name = "imageUrls[]"
				imageInput.value = JSON.stringify({ url: url, alt: alt })
				announcementForm.appendChild(imageInput)

				// Enable post button
				updatePostButtonState()
			}
		}
	}

	function addImageToList(file) {
		// Create an image item
		const imageItem = document.createElement("li")
		imageItem.className = "file-item"

		// Create image preview
		const imagePreview = document.createElement("div")
		imagePreview.className = "d-flex align-items-center"

		const imgThumb = document.createElement("img")
		imgThumb.style.maxHeight = "40px"
		imgThumb.style.maxWidth = "40px"
		imgThumb.style.marginRight = "10px"

		// Read the file and set the preview
		const reader = new FileReader()
		reader.onload = (e) => {
			imgThumb.src = e.target.result
		}
		reader.readAsDataURL(file)

		// Create remove button
		const removeBtn = document.createElement("button")
		removeBtn.className = "remove-file"
		removeBtn.innerHTML = '<i class="fas fa-times"></i>'
		removeBtn.onclick = (e) => {
			e.preventDefault()
			imageItem.remove()
			updatePostButtonState()
		}

		// Add elements to preview
		imagePreview.appendChild(imgThumb)
		imagePreview.appendChild(document.createTextNode(file.name))

		// Add elements to list item
		imageItem.appendChild(imagePreview)
		imageItem.appendChild(removeBtn)

		// Add to the list
		selectedFilesList.appendChild(imageItem)

		// Add the file to the form
		const dataTransfer = new DataTransfer()
		dataTransfer.items.add(file)

		const imageInput = document.createElement("input")
		imageInput.type = "file"
		imageInput.name = "images[]"
		imageInput.style.display = "none"
		imageInput.files = dataTransfer.files
		announcementForm.appendChild(imageInput)

		// Enable post button
		updatePostButtonState()
	}

	function insertYouTubeVideo() {
		// Prompt for YouTube URL or video ID
		const videoUrl = prompt("Enter YouTube video URL or video ID:", "")
		if (videoUrl) {
			// Extract video ID from URL or use as is
			let videoId = videoUrl

			// Check if it's a URL and extract the video ID
			if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
				const urlObj = new URL(videoUrl)
				if (videoUrl.includes("youtube.com")) {
					videoId = urlObj.searchParams.get("v")
				} else if (videoUrl.includes("youtu.be")) {
					videoId = urlObj.pathname.substring(1)
				}
			}

			if (videoId) {
				// Create a video item
				const videoItem = document.createElement("li")
				videoItem.className = "file-item"

				// Create video preview
				const videoPreview = document.createElement("div")
				videoPreview.className = "d-flex align-items-center"

				const videoIcon = document.createElement("i")
				videoIcon.className = "fab fa-youtube text-danger fa-2x mr-2"
				videoIcon.style.marginRight = "10px"

				// Create remove button
				const removeBtn = document.createElement("button")
				removeBtn.className = "remove-file"
				removeBtn.innerHTML = '<i class="fas fa-times"></i>'
				removeBtn.onclick = (e) => {
					e.preventDefault()
					videoItem.remove()
					updatePostButtonState()
				}

				// Add elements to preview
				videoPreview.appendChild(videoIcon)
				videoPreview.appendChild(document.createTextNode("YouTube Video: " + videoId))

				// Add elements to list item
				videoItem.appendChild(videoPreview)
				videoItem.appendChild(removeBtn)

				// Add to the list
				selectedFilesList.appendChild(videoItem)

				// Add hidden input for the video
				const videoInput = document.createElement("input")
				videoInput.type = "hidden"
				videoInput.name = "videos[]"
				videoInput.value = videoId
				announcementForm.appendChild(videoInput)

				// Enable post button
				updatePostButtonState()
			} else {
				alert("Invalid YouTube URL. Please try again.")
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



/*$(document).ready(function() {
	// Initialize Summernote editor
	$('#rich-editor').summernote({
		placeholder: 'Announce something to your class',
		tabsize: 2,
		height: 120,
		toolbar: [
			['style', ['bold', 'italic', 'underline']],
			['para', ['ul', 'ol']],
			['insert', ['link']]
		],
		callbacks: {
			onChange: function(contents) {
				$('#post-button').prop('disabled', contents.trim().length === 0);
			}
		}
	});

	// Hide toolbar initially
	$('.note-toolbar').hide();

	// Switch from simple input to rich editor on focus
	$('#simple-input').on('focus', function() {
		$(this).hide();
		$('#announcement-editor-container').show();
		$('#announcement-card').addClass('expanded');
		$('#rich-editor').summernote('focus');
		$('.note-toolbar').show();
	});

	// Cancel button resets editor
	$('#cancel-button').on('click', function() {
		$('#rich-editor').summernote('code', '');
		$('#announcement-editor-container').hide();
		$('#simple-input').show().val('');
		$('#announcement-card').removeClass('expanded');
		$('.note-toolbar').hide();
		$('#selected-files-list').empty();
	});

	// Handle file selection
	$('#upload-btn').on('click', function() {
		$('#file-upload').click();
	});

	$('#file-upload').on('change', function() {
		let files = this.files;
		let fileList = $('#selected-files-list');
		fileList.empty();

		if (files.length > 0) {
			$.each(files, function(index, file) {
				fileList.append(`<li class="file-item">${file.name} <button class="remove-file" data-index="${index}">x</button></li>`);
			});
			fileList.show();
		}
	});

	// Remove file from selection
	$(document).on('click', '.remove-file', function() {
		$(this).parent().remove();
	});

	// Post announcement (simulated)
	$('#post-button').on('click', function() {
		let content = $('#rich-editor').summernote('code');
		console.log('Posting:', content);

		// Reset editor after post
		$('#rich-editor').summernote('code', '');
		$('#announcement-editor-container').hide();
		$('#simple-input').show().val('');
		$('#announcement-card').removeClass('expanded');
		$('#selected-files-list').empty();
		$('.note-toolbar').hide();
		$(this).prop('disabled', true);

		// Optionally, append the content to a hidden form field before submitting (if needed):
		$('#announcement-form').append('<input type="hidden" name="content" value="' + content + '">');

		// Submit the form
		$('#announcement-form').submit();

		// Show toast notification
		$('#announcement-toast').toast({
			delay: 2000 // Toast disappears after 3 seconds
		}).toast('show');
	});

	// Close editor when clicking outside
	$(document).on('click', function(e) {
		if ($('#announcement-editor-container').is(':visible')) {
			if ($(e.target).closest('#announcement-card').length === 0) {
				let content = $('#rich-editor').summernote('code');
				if (content.trim().length > 0 && confirm('Discard your announcement?')) {
					$('#cancel-button').click();
				} else {
					$('#cancel-button').click();
				}
			}
		}
	});
});*/