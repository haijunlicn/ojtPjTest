/**
 * 
 */
// Get references to the elements
const pointsInput = document
	.getElementById('pointsInput');
const ungradedSwitch = document
	.getElementById('ungradedSwitch');

// Add event listener to the ungraded switch
ungradedSwitch
	.addEventListener(
		'change',
		function() {
			if (this.checked) {
				// If "Ungraded" is selected, disable the points input
				pointsInput.disabled = true;
				pointsInput.value = '';
			} else {
				// If "Ungraded" is not selected, enable the points input and set default value
				pointsInput.disabled = false;
				pointsInput.value = '100';
			}
		});

// Add event listener to the points input to uncheck "Ungraded" when points are entered
pointsInput
	.addEventListener(
		'input',
		function() {
			if (this.value !== '') {
				ungradedSwitch.checked = false;
			}
		});