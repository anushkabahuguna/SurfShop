// function geoFindMe(e)
// {	
// // 	prevent the form from submitting
// 	e.preventDefault();
// 	const status = document.querySelector("#status");
// 	const locationInput = document.querySelector("#location");
		
// 	function success(positon)
// 	{
// 		const longitude = position.coords.longitude;
// 		const latitude = position.coords.latitude;
// 		status.textContent = "";
// 		locationInput.value = `[${longitude}, ${latitude}]`;
// 	}
	
// 	function error()
// 	{
// 		status.textContent = 'Unable to retrieve your location';
// 	}
// // 	default api on window object - navigator
	
// 	if(!navigator.geolocation)
// 		{
// 			status.textContent = "Geolcation is not supported in your browser";
// 		}
// 	else{
// 		status.textContent = "Locating...";
// 		navigator.geolocation.getCurrentPosition(success, error);
// 	}
// }

// document.querySelector('#find-me').addEventListener('click', geoFindMe);



function geoFindMe(e) {
	e.preventDefault();

	const status = document.querySelector('#status');
	const locationInput = document.querySelector('#location');

	function success(position) {
		const longitude = position.coords.longitude;
		const latitude = position.coords.latitude;

		status.textContent = '';
		locationInput.value = `[${longitude}, ${latitude}]`;
	}

	function error() {
		status.textContent = 'Unable to retrieve your location';
	}

	if (!navigator.geolocation) {
		status.textContent = 'Geolocation is not supported in your browser';
	} else {
		status.textContent = 'Locating...';
		navigator.geolocation.getCurrentPosition(success, error);
	}

}

document.querySelector('#find-me').addEventListener('click', geoFindMe);


