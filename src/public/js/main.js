var currentArchive;

// object holding info about archive currently being edited
function Archive(data) {
	console.log(data);
	this.name = data.name;
	this.status = data.status;
	this.contents = data.contents;
	this.archiveUrl = data.archiveUrl;
	this.readyUrl = data.readyUrl;
	this.getPdf = function() {
		for (var i = 0; i < this.contents.length; i++) {
			if (this.contents[i].substr(-3) === 'pdf') {
				return this.contents[i];
			}
		}
	};
	this.pdf = this.getPdf();
	this.json = JSON.parse(stripChars(data.json));
	this.db = data.db;
}


// Initial data gets for sidebar ===================================================================

function refreshSideBar() {
	// hide edit buttons
	// $('#xmlEditBtns').hide();

	// empty working, pending, and problems views
	// $('#W').empty();
	// $('#P').empty();
	// $('#L').empty();

	// call API get function getOldestArchive to get oldest archive in currentArchive dir
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
		// call API get function getOneArchive(archive, id, status) to get data about archive 
		getOneArchive('', '', '').done(function(res) {
			// create currentArchive object from response
			currentArchive = new Archive(res);

			// use json2html to display json 
			visualize(currentArchive.json);

			displayArchiveFiles(currentArchive);

			// prefill the form using function mapJson
			preFillForm(mapJson(currentArchive)).done(function(res) {
				// once form is filled post this to database and set the subId
				postFormData(currentArchive).done(function(res) {
					currentArchive.subId = res.id;
					refreshSideBar();
				});
			});
		});
	}); 

	// submit for batch upload button click
	$('#submitToBatch').click(function() {
		// submit updated data and mark Pending
		currentArchive.status = 'P';
		postFormData(currentArchive).done(function(res) {
			refreshSideBar();
			// clearEditView();
		});
		
	});

	// move to problems button click
	$('#moveToProblems').click(function() {
		// submit updated data and mark problem
		currentArchive.status = 'L';
		postFormData(currentArchive).done(function(res) {
			refreshSideBar();
			// clearEditView();
		});
	});
});

// click handlers for archive links in working, pending, and problems on sidebar
// since these elements are created dynamically create event watchers that will attach to these 
$(document).on('click', '.getme', function(event) {
	var subId = event.target.attributes.subId.textContent;
	var archive = event.target.attributes.archive.textContent;

	getOneArchive(archive, subId, '').done(function(res) {

		currentArchive = new Archive(res);

		// call map function that maps database data to the edit form's fields
		preFillForm(mapDb(currentArchive));

		// use json2html to display json 
		visualize(currentArchive.json);

		displayArchiveFiles(currentArchive);

	});

});

// Display Functions ===============================================================================

// parse archive folder contents displaying to DOM if not xml and returning the pdf file
function displayArchiveFiles(archive) {
	var html = '';

	// loop through array of files in archive
	for (var i = 2; i <  archive.contents.length; i++) {
		var file = archive.contents[i];
		var ext = file.substr(-3);

		// display files that are not xml
		if (ext !== 'xml') {
			html += '<a target="_blank" href="' + archive.archiveUrl + file + '">' + file + '</a><br>';
		}
	}

	$('#archiveFiles').html(html);
}

// prefills the xml edit form with data from xmlData using map.js as a map
function preFillForm(map) {
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
				.val(map[i].data)
				.attr('readonly', map[i].readonly);
		}
	}
	dfd.resolve();
	// show submit and move buttons
	$('#xmlEditBtns').show();
	return dfd.promise();
}

// append archive files in working, pending, and problems to sidebar
function displayArchives(archives) {
	var workingHtml = '',
		pendingHtml = '',
		problemHtml = '';

	for (var i = 0; i < archives.length; i++) {
		switch (archives[i].workflow_status) {
			case 'W':
				workingHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
			case 'P':
				pendingHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
			case 'L':
				problemHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
		}
	}
	
	$('#working').html(workingHtml);
	$('#pending').html(pendingHtml);
	$('#problem').html(problemHtml);
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
function getOneArchive(archive, id, status) {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		datatype: 'JSON',
		data: {
			'action': 'getOneArchive',
			'status': status,
			'subId': id,
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

// move archive to pending dir
function postFormData(archive) {


	console.log(archive);

	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'POST',
		data: {
			'action': 'postFormData',
			'archive': archive.name,
			'status': archive.status,
			'subId': archive.subId,
			'data': $('#xmlEdit').serialize()
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








