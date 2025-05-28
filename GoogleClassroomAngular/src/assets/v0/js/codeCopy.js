/**
 * 
 */

function copyClassCode() {
	console.log("Clicked copy icon"); // Debugging

	const classCodeElement = document.getElementById('classCode');
	if (!classCodeElement) {
		console.error("classCode element not found!");
		return;
	}

	const classCodeText = classCodeElement.textContent.trim();

	navigator.clipboard.writeText(classCodeText)
		.then(() => {
			showToast("Class code copied successfully!");
		})
		.catch(err => {
			console.error('Failed to copy:', err);
		});
}

function showToast(message) {
	const toastElement = document.getElementById('copyToast');
	const toastBody = document.getElementById('toastBody');

	if (!toastElement || !toastBody) {
		console.error("Toast elements not found!");
		return;
	}

	toastBody.textContent = message; // Set message dynamically

	const toast = new bootstrap.Toast(toastElement, { delay: 2000 }); // Set delay to 2 seconds
	toast.show();
}