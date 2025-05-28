// Simplified attachment handler using data attributes
document.addEventListener('DOMContentLoaded', function() {
	// Get all attachment items
	const attachmentItems = document.querySelectorAll('.attachment-item');

	// Add click event listener to each attachment item
	attachmentItems.forEach(item => {
		item.addEventListener('click', function() {
			// Get data attributes
			const fileId = this.dataset.fileId;
			const fileName = this.dataset.fileName;
			const filePath = this.dataset.filePath;
			const fileType = this.dataset.fileType;
			const fileExtension = this.dataset.fileExtension;

			// Handle different file types
			if (fileType === 'link') {
				// It's a link - open in new tab
				window.open(filePath, '_blank');
			} else if (fileType === 'image') {
				// It's an image - show in modal
				showImagePreview(fileName, filePath);
			} else if (fileType === 'video') {
				// It's a video - show in modal
				showVideoPreview(fileName, filePath, fileExtension);
			} else if (fileType === 'audio') {
				// It's an audio file - show in audio modal
				showFilePreview(fileName, fileExtension, 'fa-file-audio', 'audio', filePath);
			} else if (fileType === 'pdf') {
				// It's a PDF - show in PDF viewer
				showFilePreview(fileName, fileExtension, 'fa-file-pdf', 'pdf', filePath);
			} else if (fileType === 'text') {
				// It's a text file - show in text viewer
				showFilePreview(fileName, fileExtension, 'fa-file-alt', 'text', filePath);
			} else {
				// It's another file type - show generic file preview
				showFilePreview(fileName, fileExtension, 'fa-file', 'generic', filePath);
			}
		});
	});

	// Function to show image preview modal
	function showImagePreview(title, imageSrc) {
		const modal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
		document.getElementById('imagePreviewModalLabel').textContent = title;
		const previewImage = document.getElementById('previewImage');
		previewImage.src = imageSrc;
		previewImage.alt = title;

		// Set download link
		const downloadLink = document.getElementById('downloadImageLink');
		downloadLink.href = imageSrc;
		downloadLink.download = title;

		modal.show();
	}

	// Function to show video preview modal
	function showVideoPreview(title, videoSrc, extension) {
		const modal = new bootstrap.Modal(document.getElementById('videoPreviewModal'));
		document.getElementById('videoPreviewModalLabel').textContent = title;

		// Set video source
		const videoElement = document.getElementById('previewVideo');
		const sourceElement = videoElement.querySelector('source');
		sourceElement.src = videoSrc;

		// Set MIME type based on file extension
		const mimeTypes = {
			'mp4': 'video/mp4',
			'webm': 'video/webm',
			'ogg': 'video/ogg',
			'mov': 'video/quicktime',
			'avi': 'video/x-msvideo',
			'wmv': 'video/x-ms-wmv',
			'flv': 'video/x-flv',
			'mkv': 'video/x-matroska'
		};
		sourceElement.type = mimeTypes[extension] || 'video/mp4';

		// Load the video
		videoElement.load();

		// Set download link
		const downloadLink = document.getElementById('downloadVideoLink');
		downloadLink.href = videoSrc;
		downloadLink.download = title;

		modal.show();
	}

	// Enhanced file preview function
	function showFilePreview(title, extension, iconClass, fileType, filePath) {
		const modal = new bootstrap.Modal(document.getElementById('filePreviewModal'));
		document.getElementById('filePreviewModalLabel').textContent = 'File Preview: ' + title;
		document.getElementById('fileName').textContent = title;
		document.getElementById('fileSize').textContent = 'Loading file details...';

		// Set file icon
		const fileIcon = document.getElementById('fileTypeIcon');
		fileIcon.className = ''; // Clear existing classes
		fileIcon.className = 'fas ' + iconClass + ' fa-4x text-primary';

		// Set download link
		const downloadLink = document.getElementById('downloadFileLink');
		downloadLink.href = filePath;
		downloadLink.download = title;

		// Set up "Open in New Tab" button
		const openFileBtn = document.getElementById('openFileBtn');
		if (fileType === 'pdf' || fileType === 'text' || fileType === 'image') {
			openFileBtn.classList.remove('d-none');
			openFileBtn.onclick = function() {
				window.open(filePath, '_blank');
			};
		} else {
			openFileBtn.classList.add('d-none');
		}

		// Reset all preview elements
		document.getElementById('filePreviewFrame').style.display = 'none';
		document.getElementById('textPreviewContent').style.display = 'none';
		document.getElementById('audioPreviewContent').style.display = 'none';
		document.getElementById('videoPreviewThumbnail').style.display = 'none';
		document.getElementById('filePreviewPlaceholder').style.display = 'block';
		document.getElementById('filePreviewUnavailable').style.display = 'none';

		// Fetch file metadata
		fetchFileMetadata(title, extension);

		// Handle preview based on file type
		setTimeout(() => {
			document.getElementById('filePreviewPlaceholder').style.display = 'none';

			switch (fileType) {
				case 'pdf':
					// Show PDF in iframe
					const pdfFrame = document.getElementById('filePreviewFrame');
					pdfFrame.src = filePath;
					pdfFrame.style.display = 'block';

					// Handle iframe load errors
					pdfFrame.onerror = function() {
						pdfFrame.style.display = 'none';
						document.getElementById('filePreviewUnavailable').style.display = 'block';
					};
					break;

				case 'text':
					// Fetch and display text content
					fetchTextContent(filePath);
					break;

				case 'audio':
					// Show audio player
					const audioContent = document.getElementById('audioPreviewContent');
					const audioPlayer = document.getElementById('audioPlayer');
					const audioSource = audioPlayer.querySelector('source');

					audioSource.src = filePath;
					audioPlayer.load(); // Important: reload the audio element

					audioContent.style.display = 'block';
					break;

				case 'video':
					// Show video thumbnail with play button
					const videoThumb = document.getElementById('videoPreviewThumbnail');
					// Use a generic video thumbnail or generate one
					document.getElementById('videoThumbnail').src = '${pageContext.request.contextPath}/resources/images/video-thumbnail.jpg';

					// Set up play button
					document.getElementById('playVideoBtn').onclick = function() {
						showVideoPreview(title, filePath, extension);
					};

					videoThumb.style.display = 'block';
					break;

				default:
					// Show unavailable message for non-previewable files
					document.getElementById('filePreviewUnavailable').style.display = 'block';
			}
		}, 800); // Simulate loading

		modal.show();
	}

	// Function to fetch text content
	function fetchTextContent(filePath) {
		const textContent = document.getElementById('textPreviewContent');

		fetch(filePath)
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.text();
			})
			.then(data => {
				textContent.textContent = data;
				textContent.style.display = 'block';
			})
			.catch(error => {
				console.error('Error fetching text content:', error);
				document.getElementById('filePreviewUnavailable').style.display = 'block';
			});
	}

	// Function to fetch file metadata
	function fetchFileMetadata(fileName, extension) {
		// First set a loading message
		document.getElementById('fileSize').textContent = 'Loading file details...';

		// Simulate an AJAX call with setTimeout
		setTimeout(() => {
			// Generate a random file size between 10KB and 10MB
			const randomSize = Math.floor(Math.random() * (10 * 1024 * 1024 - 10 * 1024) + 10 * 1024);
			const formattedSize = formatFileSize(randomSize);

			// Update the file size display
			document.getElementById('fileSize').textContent = `${formattedSize} • ${extension.toUpperCase()} file`;
		}, 600);
	}

	// Function to format file size
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}

	// Add event listener for the video modal to pause video when closed
	const videoModal = document.getElementById('videoPreviewModal');
	if (videoModal) {
		videoModal.addEventListener('hidden.bs.modal', function() {
			const video = document.getElementById('previewVideo');
			if (video) {
				video.pause();
			}
		});
	}
});