// Sets and saves the theme when changed
function setTheme(theme){
	// Update the current page to include the theme
	$('head').append('<link rel="stylesheet" type="text/css" href="/css/theme_'+theme+'.css">');
	
	// Save change to local storage for next time
	if (typeof(localStorage) !== "undefined") {
		localStorage.theme = theme;
	} 
}

// Event handler for the user picking a new theme
$('#themePicker').on('change', function(){
	setTheme($('#themePicker').val());
});

// Load theme from local storage
if (typeof(localStorage) !== "undefined") {
	var theme = localStorage.theme;
	if(theme != '' && theme != undefined){
		setTheme(theme);
		$('#themePicker').val(theme);
	}
	
} else {
    console.log('No localStorage support found, themes disabled.');
}