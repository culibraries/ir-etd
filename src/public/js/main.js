
$(document).ready(function() {

	var currentArchive;
	
	// get oldest archive from data directory
	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getOldestArchive'},
		success: function(res, status) {
			$('#oldestArchive').text(res);
		},
		error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	    }
	});

	// get archives in working, pending, and problems dirs
	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getArchives'},
		success: function(res, status) {
			var response = JSON.parse(res);
			console.log(response);
			displayArchives(response);
		},
		error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	    }
	});

	// on Load button click
	$('#fileSelect').click(function() {
		// unzip to working dir
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'POST',
			datatype: 'JSON',
			data: {
				'action': 'loadArchive'
			},
			success: function(res, status) {
				var response = JSON.parse(res);
				currentArchive = response.folder;

				var pdfFile = parseArchiveFiles(response);
				var readyUrl = response.readyUrl;

				// get json object of xml data
				$.ajax({
					url: 'modules/xml/xml.php',
					type: 'GET',
					data: {
						'action': 'getJsonFromXml',
						'archive': response.folder
					},
					success: function(res, status) {
						var xmlData = JSON.parse(stripChars(res));
						// use json2html to display json 
						visualize(xmlData);
						// using map prefill form with xmlData
						var map = mapFunc(xmlData, readyUrl, pdfFile);
						preFillForm(xmlData, map);
					},
					error: function(xhr, desc, err) {
			            console.log(xhr);
			            console.log("Details: " + desc + "\nError: " + err);
	        		}
				});
			},
			error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	        }
		});
	});

	// on submit for batch button click
	$('#submitToBatch').click(function() {
		// move to pending dir
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'POST',
			data: {
				'action': 'moveToPending',
				'archive': currentArchive
			},
			success: function(res, status) {
				console.log(res);
			},
			error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	        }
		});
	});

	// on move to problems button click
	$('#moveToProblems').click(function() {
		// move to problems dir
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'POST',
			data: {
				'action': 'moveToProblems',
				'archive': currentArchive
			},
			success: function(res, status) {
				console.log(res);
			},
			error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	        }
		});
	});
});

// parse archive folder contents displaying to DOM if not xml and returning the pdf file
function parseArchiveFiles(data) {
	var pdfFile;
	// loop through array of files in archive
	for (var i=2; i<data.folderContents.length; i++) {
		var file = data.folderContents[i];
		var ext = file.substr(file.length - 3, file.length);

		// display files that are not xml
		if (ext !== 'xml') {
			$('#archiveFiles').html('<a target="_blank" href="' + data.url + data.folder + '/' + file + '">' + file + '</a>');
			if (ext === 'pdf') {
				pdfFile = file;
			}
		}
	}
	return pdfFile;
}

// prefills the xml edit form with data from xmlData using map.js as a map
function preFillForm(xmlData, map) {

	for (var i in map) {
		// create basic html, and append to form
		var data = '<div class="form-group">' +
						'<label for="' + map[i].id + '">' + map[i].name + '</label>' +
					'</div>';
		$('#xmlEdit').append(data);

		// if type is test-long create textarea, else create input
		if (map[i].type === 'text-long') {
			//append textarea afer label
			$('label:last').after('<textarea class="form-control" id="' + map[i].id + '"></textarea>');
			//add value to <textarea>
			$('#' + map[i].id).val(map[i].data);
			//calculate how many rows based in scrollHeight
			var rows = calcRows($('#' + map[i].id)[0].scrollHeight);
			// change # of rows
			$('#' + map[i].id).attr('rows', rows);
		} else {
			// append <input> after label
			$('label:last').after('<input class="form-control" id="' + map[i].id + '">');
			//add value and type to input
			$('#' + map[i].id)
				.attr('type', map[i].type)
				.val(map[i].data);
		}
	}

	// show submit and move buttons
	$('#xmlEditBtns').show();
}

// calculate the number of rows the textareas should be to show all text
function calcRows(scrollHeight) {
	return Math.round(scrollHeight/20) - 1;
}

// remove '@' and 'DISS_' 
function stripChars(str) {
	var mapObj = {
		'@attributes': 'attributes',
		'DISS_': ''
	};

	str = str.replace(/@attributes|DISS_/g, function(matched) {
		return mapObj[matched];
	});

	return str;
}

function displayArchives(archives) {
	for (var key in archives) {
		for (var i = 0; i < archives[key].length; i++) {
			var data = '<a href="#">' + archives[key][i] + '</a><br>';
			$('#' + key + 'Archives').append(data);
		}
	}
}

function loadArchive(status) {
	
}






