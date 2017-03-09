var currentArchive;

// Initial data gets for sidebar ===================================================================

function refreshSideBar() {
	// hide edit buttons
	$('#xmlEditBtns').hide();
	// empty working, pending, and problems views
	$('#workingArchives').empty();
	$('#pendingArchives').empty();
	$('#problemsArchives').empty();
	// empty edit view
	$('#xmlEdit').empty();
	// empty view view
	$('#top').empty();
	// empty files in archive view
	$('#archiveFiles').empty();

	// call API get function getOldestArchive to get oldest archive in data dir
	getOldestArchive().done(function(res) {
		$('#oldestArchive').text(res);
	});

	// call API get function getArchives to get archives in working, pending, and problems dirs
	getArchives().done(function(res) {
		//display in sidebar
		displayArchives(res);
	});
}

refreshSideBar();

// JQUERY event watchers ===========================================================================

$(document).ready(function() {

	// Load button click (oldest archive)
	$('#loadOldestArchive').click(function() {
		// call API get function getOneArchive(archive, status) to get data about archive 
		getOneArchive('', 'oldest').done(function(res) {
			currentArchive = res.name;
			var pdfFile = parseArchiveFiles(res);

			// call API get function getJsonFromXml to get the json data from current archive
			getJsonFromXml(currentArchive).done(function(res) {
				// use json2html to display json 
				visualize(res.json);
				// call map function that maps xml data to the edit form's fields
				var map = mapFunc(res.json, res.readyUrl, pdfFile);
				// prefill the form
				preFillForm(res.json, map).done(function(res) {
					postFormData(currentArchive, 'W');
				});
			});
		});
		refreshSideBar();
	}); 

	// submit for batch upload button click
	$('#submitToBatch').click(function() {
		// move to ready dir
		postFormData(currentArchive, 'P').done(function(res) {
			refreshSideBar();
			console.log(res);
		});
		
	});

	// move to problems button click
	$('#moveToProblems').click(function() {
		// move to problems dir
		postFormData(currentArchive, 'L').done(function(res) {
			refreshSideBar();
			console.log(res);
		});
	});
});

// since these elements are created dynamically create event watchers that will attach to these 
$(document).on('click', '.getme', function(event) {
	var status = event.target.attributes.itemtype.textContent;
	var archive = event.target.text;

	getOneArchive(archive, status).done(function(res) {
		currentArchive = res.name;
		var pdfFile = parseArchiveFiles(res);

		// call API get function getJsonFromXml to get the json data from current archive
		getJsonFromXml(currentArchive).done(function(res) {
			// use json2html to display json 
			visualize(res);
			// call map function that maps xml data to the edit form's fields
			var map = mapFunc(res.json, res.readyUrl, pdfFile);
			// prefill the form
			preFillForm(res, map);
		});
	});

});

// Display Functions ===============================================================================

// parse archive folder contents displaying to DOM if not xml and returning the pdf file
function parseArchiveFiles(data) {
	var pdfFile;
	// loop through array of files in archive
	for (var i=2; i<data.contents.length; i++) {
		var file = data.contents[i];
		var ext = file.substr(file.length - 3, file.length);

		// display files that are not xml
		if (ext !== 'xml') {
			$('#archiveFiles').html('<a target="_blank" href="' + data.archiveUrl + file + '">' + file + '</a>');
			if (ext === 'pdf') {
				pdfFile = file;
			}
		}
	}
	return pdfFile;
}

// prefills the xml edit form with data from xmlData using map.js as a map
function preFillForm(xmlData, map) {
	var dfd = $.Deferred();

	$('#xmlEdit').empty();

	for (var i in map) {
		// create basic html, and append to form
		var data = '<div class="form-group">' +
						'<label for="' + map[i].id + '">' + map[i].name + '</label>' +
					'</div>';
		$('#xmlEdit').append(data);

		// if type is test-long create textarea, else create input
		if (map[i].type === 'text-long') {
			//append textarea afer label
			$('label:last').after('<textarea class="form-control" id="' + map[i].id + '" name="' + map[i].id + '"></textarea>');
			//add value to <textarea>
			$('#' + map[i].id).val(map[i].data);
			//calculate how many rows based in scrollHeight
			var rows = calcRows($('#' + map[i].id)[0].scrollHeight);
			// change # of rows
			$('#' + map[i].id).attr('rows', rows);
		} else {
			// append <input> after label
			$('label:last').after('<input class="form-control" id="' + map[i].id + '" name="' + map[i].id + '">');
			//add value and type to input
			$('#' + map[i].id)
				.attr('type', map[i].type)
				.val(map[i].data);
		}
	}
	dfd.resolve();
	// show submit and move buttons
	$('#xmlEditBtns').show();
	return dfd.promise();
}

// append archive files in working, pending, and problems to sidebar
function displayArchives(archives) {

	// update to parse data from database and refer to insert_id ?????????????????????????????????????????
	
	// for (var item in archives) {
	// 	for (var i = 0; i < archives[item].length; i++) {
	// 		var data = '<a href="#" class="getme" itemtype="' + item + '">' + archives[item][i] + '</a><br>';
	// 		$('#' + item + 'Archives').append(data);
	// 	}
	// }
}

// Helper Functions ================================================================================

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


// API CALLS =======================================================================================

// get oldest archive from ftp directory
function getOldestArchive() {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getOldestArchive'},
		success: function(res, status) {
			dfd.resolve(res);
		},
		error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	    }
	});

	return dfd.promise();
}

// get archive's dir names in working, pending, and problems dirs
function getArchives() {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getArchives'},
		success: function(res, status) {
			dfd.resolve(JSON.parse(res));
		},
		error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	    }
	});

	return dfd.promise();
}

// get one archive's properties
function getOneArchive(archive, status) {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		datatype: 'JSON',
		data: {
			'action': 'getOneArchive',
			'status': status,
			'archive': archive
		},
		success: function(res, status) {
			dfd.resolve(JSON.parse(res));
		},
		error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError: " + err);
        }
	});

	return dfd.promise();
}

// get contents of XML file in json
function getJsonFromXml(archive) {
	var dfd = $.Deferred();

	$.ajax({
		url: 'modules/xml/xml.php',
		type: 'GET',
		data: {
			'action': 'getJsonFromXml',
			'archive': archive
		},
		success: function(res, status) {
			dfd.resolve(JSON.parse(stripChars(res)));
		},
		error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError: " + err);
		}
	});

	return dfd.promise();
}

// move archive to pending dir
function postFormData(archive, status) {

	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'POST',
		data: {
			'action': 'postFormData',
			'archive': archive,
			'status': status,
			'data': $('#xmlEdit').serialize(),  
		},
		success: function(res, status) {
			console.log(JSON.parse(res));
			dfd.resolve(res);
		},
		error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError: " + err);
        }
	});

	return dfd.promise();
}








