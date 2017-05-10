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
	if (data.db) { this.db = JSON.parse(data.db); }
	this.json = JSON.parse(stripChars(data.json));
	this.subId = data.subId;
}

// JQUERY event watchers ===========================================================================

$(document).ready(function() {

	// Load next ETD button (oldest archive)
	$('#loadBtn').click(function() {
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
				// create disciplines string from disciplines inputs
				createDisciplinesString();
				// once form is filled post to database and set the subId
				currentArchive.postFormData().done(function(res) {
					currentArchive.subId = res.id;
					refreshSideBar();
				});
			});
		});
	});

	// submit button
	$('.submit').click(function() {

		// check is any discipline is in error and prevent moving to pending
		if ($('.discipline').hasClass('errorInput') && $('#workflow_status').val() === 'P') {
			alert('There is a Discipline in error so cannot move to pending');
		} else {
			createDisciplinesString();
			currentArchive.postFormData().done(function(res) {
				refreshSideBar();
				clearViews();
			});
		}
	});

	// batch download button
	$('#batchBtn').click(function() {
		window.location.assign('prepBatch.php');
	});

});

// click handlers for archive links in working, pending, and problems on sidebar
// since these elements are created dynamically create event watchers that will attach to these
$(document).on('click', '.getme', function(event) {
	var subId = event.target.attributes.subId.textContent;
	var archive = event.target.attributes.archive.textContent;
	var status = event.target.attributes.status.textContent;

	getOneArchive(archive, subId, status).done(function(res) {

		console.log(res);

		currentArchive = new Archive(res);

		// use json2html to display json
		visualize(currentArchive.json);

		// display archive files that are not XML
		$('#archiveFiles').html(currentArchive.parseArchiveFiles());

		// call map function that maps database data to the edit form's fields
		currentArchive.preFillForm(currentArchive.mapDb());
	});
});

$(document).on('focusout', '.discipline', function(event) {
	lookupDiscipline(event.target.value).done(function(res) {
		if (!res) {
			$(event.target).addClass("errorInput");
		} else {
			$(event.target).removeClass("errorInput");
		}
	});
});

// Display Functions ===============================================================================

// parse archive folder contents for non XML files, return links to those files
Archive.prototype.parseArchiveFiles = function() {
	var html = '';

	// loop through array of files in archive
	for (var i = 2; i <  this.contents.length; i++) {
		var file = this.contents[i];
		var ext = file.substr(-3);

		// display files that are not xml
		if (ext !== 'xml') {
			html += '<a target="_blank" href="' + this.archiveUrl + '/' + file + '">' + file + '</a><br>';
		}
	}

	return html;
};

// prefills the xml edit form with data from xmlData using map.js as a map
Archive.prototype.preFillForm = function(maps) {
	var dfd = $.Deferred();

	$('#xmlEdit').empty();

	maps.forEach(function(map) {
		// create basic html, and append to form
		var data = '<div class="form-group">' +
						'<label for="' + map.id + '">' + map.name + '</label>' +
					'</div>';
		$('#xmlEdit').append(data);

		switch (map.type) {
			case 'text-long':
				//append textarea afer label
				$('label:last').after('<textarea class="form-control" id="' + map.id + '" name="' + map.id + '"></textarea>');
				//add value to <textarea>
				$('#' + map.id).val(map.data);
				//calculate how many rows based in scrollHeight
				var rows = calcRows($('#' + map.id)[0].scrollHeight);
				// change # of rows
				$('#' + map.id).attr('rows', rows);
				break;
			case 'text':
			case 'date':
				// append <input> after label
				$('label:last').after('<input class="form-control" id="' + map.id + '" name="' + map.id + '">');
				//add value and type to input
				$('#' + map.id)
					.attr('type', map.type)
					.val(map.data)
					.attr('readonly', map.readonly);
				break;
			case 'drop-down':
				var select = '<select class="form-control" name="' + map.id + '" id="' + map.id + '">' +
								'<option value="W">Working</option>' +
								'<option value="P">Pending</option>' +
								'<option value="L">Problem</option>' +
							'</select>';
				$('label:last').after(select);
				$('#' + map.id).val(map.data);
				break;
			case 'email':
				$('label:last').after('<input class="form-control" id="' + map.id + '" name="' + map.id + '">');
				$('#' + map.id)
					.val(map.data)
					.attr('type', map.type);
				break;
			case 'disciplines':
				map.data.forEach(function(discipline, index) {
					$('label:last').after('<input class="form-control discipline" id="' + map.id + index + '" name="' + map.id + index + '">');
					$('#' + map.id + index).val(discipline);
					// lookup discipline in db and highlight if not exist
					lookupDiscipline(discipline, index).done(function(res) {
						if (!res) {
							$('#' + 'discipline' + index).addClass("errorInput");
						}
					});
				});
				// create hidden input for disciplines
				$('#xmlEdit').append('<input type="hidden" class="form-control" id="disciplines" name="disciplines">');
		}
	});

		dfd.resolve();
		// show submit and move buttons
		$('.submitBtn').show();
		return dfd.promise();
};

// Initial data gets for sidebar
function refreshSideBar() {

	// call API get function getOldestArchive to get oldest archives in ftp dir
	getOldestArchive().done(function(res) {
		// if there is at least one archive
		if (res.numArchives) {
			$('#oldestArchive').text(res.oldestArchive);
			$('#numArchives').text(res.numArchives);
		} else {
			$('#numArchives').text(0);
			$('#oldestArchive').text('No more archives');
			$('#loadBtn').hide();
		}
	});

	// call API get function getArchives to get archives in working dir and their status
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
				$('#batchBtn').show();
				break;
			case 'L':
				problemHtml += '<a href="#" class="getme" subId="' + archives[i].submission_id + '" archive="' + archives[i].sequence_num + '" status="' + archives[i].workflow_status + '">' + archives[i].identikey + '-' + archives[i].sequence_num + '</a><br>';
		}
	}

	$('#working').html(workingHtml);
	$('#pending').html(pendingHtml);
	$('#problem').html(problemHtml);
}

function clearViews() {
	$('.submitBtn').hide();
	$('#xmlEdit').empty();
	$('#top').empty();
	$('#archiveFiles').empty();
	$('#batchBtn').hide();
}

// create a string from the disciplines inputs and add as value to hidden desciplines input
function createDisciplinesString() {
	var strDisciplines = '';
	$('.discipline').each(function(index) {
		strDisciplines += $(this).val() + ';';
	});
	strDisciplines = strDisciplines.substring(0, strDisciplines.length -1);
	// add value to hidden disciplines input
	$('#disciplines').val(strDisciplines);
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

function lookupDiscipline(discipline) {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {
			'action': 'lookupDiscipline',
			'data': discipline
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
			dfd.resolve(JSON.parse(res));
		},
		error: function(xhr, desc, err) {
            console.log(xhr);
            console.log("Details: " + desc + "\nError: " + err);
        }
	});

	return dfd.promise();
};

// get oldest archive from ftp directory
function getOldestArchive() {
	var dfd = $.Deferred();

	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getOldestArchive'},
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
