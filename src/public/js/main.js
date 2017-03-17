var currentArchive;
refreshSideBar();

// object holding info about archive currently being edited
function Archive(data) {
	this.name = data.name;
	this.status = data.status;
	this.contents = data.contents;
	this.archiveUrl = data.archiveUrl;
	this.batchUrl = data.batchUrl;
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
	this.subId = data.subId;
}

// parse archive folder contents for non XML files, return links to those files
Archive.prototype.parseArchiveFiles = function() {
	var html = '';

	// loop through array of files in archive
	for (var i = 2; i <  this.contents.length; i++) {
		var file = this.contents[i];
		var ext = file.substr(-3);

		// display files that are not xml
		if (ext !== 'xml') {
			html += '<a target="_blank" href="' + this.archiveUrl + file + '">' + file + '</a><br>';
		}
	}

	return html;
};

// prefills the xml edit form with data from xmlData using map.js as a map
Archive.prototype.preFillForm = function(map) {
	var dfd = $.Deferred();

	$('#xmlEdit').empty();

	for (var i in map) {
		// create basic html, and append to form
		var data = '<div class="form-group">' +
						'<label for="' + map[i].id + '">' + map[i].name + '</label>' +
					'</div>';
		$('#xmlEdit').append(data);

		// if type is test-long create textarea, else create input
		switch (map[i].type) {
			case 'text-long':
				//append textarea afer label
				$('label:last').after('<textarea class="form-control" id="' + map[i].id + '" name="' + map[i].id + '"></textarea>');
				//add value to <textarea>
				$('#' + map[i].id).val(map[i].data);
				//calculate how many rows based in scrollHeight
				var rows = calcRows($('#' + map[i].id)[0].scrollHeight);
				// change # of rows
				$('#' + map[i].id).attr('rows', rows);
				break;
			case 'text':
			case 'date':
				// append <input> after label
				$('label:last').after('<input class="form-control" id="' + map[i].id + '" name="' + map[i].id + '">');
				//add value and type to input
				$('#' + map[i].id)
					.attr('type', map[i].type)
					.val(map[i].data)
					.attr('readonly', map[i].readonly);
				break;
			case 'drop-down':
				var select = '<select class="form-control" name="' + map[i].id + '" id="' + map[i].id + '">' +
								'<option value="W">Working</option>' +
								'<option value="P">Pending</option>' +
								'<option value="L">Problem</option>' +
							'</select>';
				$('label:last').after(select);
				$('#' + map[i].id).val(map[i].data);
		}
	}

		dfd.resolve();
		// show submit and move buttons
		$('.xmlEditBtns').show();
		return dfd.promise();
};

// post form data to DB
Archive.prototype.postFormData = function() {

	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'POST',
		data: {
			'action': 'postFormData',
			'subId': this.subId,
			'data': $('#xmlEdit').serialize()
		},
		success: function(res, status) {
			console.log(res);
			dfd.resolve(JSON.parse(res));
		},
		error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError: " + err);
        }
	});

	return dfd.promise();
};

// JQUERY event watchers ===========================================================================

$(document).ready(function() {

	// Load button click (oldest archive)
	$('#loadOldestArchive').click(function() {
		// call API get function getOneArchive(archive, id, status) to get data about archive 
		getOneArchive(null, 'oldest', null).done(function(res) {
			// create currentArchive object from response
			currentArchive = new Archive(res);

			// use json2html to display json 
			visualize(currentArchive.json);

			// display archive files that are not XML
			$('#archiveFiles').html(currentArchive.parseArchiveFiles());

			// prefill the form using function mapJson
			currentArchive.preFillForm(currentArchive.mapJson()).done(function(res) {
				// once form is filled post to database and set the subId
				currentArchive.postFormData().done(function(res) {
					currentArchive.subId = res.id;
					refreshSideBar();
				});
			});
		});
	}); 

	// submit button click
	$('.submit').click(function() {

		currentArchive.postFormData().done(function(res) {
			refreshSideBar();
			clearViews();
		});
	});

	// API call to have backend prepare batch uplaod spreadsheets
	$('#prepBatch').click(function() {
		prepBatch().done(function(res) {
			// ?????????????????????????????????????????????????????????
		});
	});

});

// click handlers for archive links in working, pending, and problems on sidebar
// since these elements are created dynamically create event watchers that will attach to these 
$(document).on('click', '.getme', function(event) {
	var subId = event.target.attributes.subId.textContent;
	var archive = event.target.attributes.archive.textContent;
	var status = event.target.attributes.status.textContent;

	getOneArchive(archive, subId, status).done(function(res) {

		currentArchive = new Archive(res);

		// use json2html to display json 
		visualize(currentArchive.json);

		// display archive files that are not XML
		$('#archiveFiles').html(currentArchive.parseArchiveFiles());

		// call map function that maps database data to the edit form's fields
		currentArchive.preFillForm(currentArchive.mapDb());
	});

});

// Display Functions ===============================================================================

// Initial data gets for sidebar 
function refreshSideBar() {

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

// append archive files in working, pending, and problems to sidebar
function displayArchives(archives) {
	var workingHtml = '',
		pendingHtml = '',
		problemHtml = '';

	for (var i = 0; i < archives.length; i++) {
		switch (archives[i].workflow_status) {
			case 'W':
				workingHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '" status="' + archives[i].workflow_status + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
			case 'P':
				pendingHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '" status="' + archives[i].workflow_status + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
			case 'L':
				problemHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '" status="' + archives[i].workflow_status + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
				break;
		}
	}
	
	$('#working').html(workingHtml);
	$('#pending').html(pendingHtml);
	$('#problem').html(problemHtml);
}

function clearViews() {
	$('.xmlEditBtns').hide();
	$('#xmlEdit').empty();
	$('#top').empty();
	$('#archiveFiles').empty();
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
function getOneArchive(archive, subId, status) {
	var dfd = $.Deferred();

	if (subId === 'oldest') {
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'GET',
			datatype: 'JSON',
			data: {
				'action': 'getExtractOldestArchive',
			},
			success: function(res, status) {
				dfd.resolve(JSON.parse(res));
			},
			error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	        }
		});
	} else {
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'GET',
			datatype: 'JSON',
			data: {
				'action': 'getOneArchive',
				'status': status,
				'subId': subId,
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
	}

	return dfd.promise();
}

function prepBatch() {
	var dfd = $.Deferred();
	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'POST',
		data: {'action': 'prepBatch'},
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










