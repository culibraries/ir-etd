var currentArchive;
var id = '';
refreshSideBar();

// object holding info about archive currently being edited
function Archive(data) {
	this.name = data.name;
	this.status = data.status;
	this.contents = data.contents;
	this.archiveUrl = data.archiveUrl;
	this.batchUrl = data.batchUrl;
	this.getPdf = function () {
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

$(document).ready(function () {

	// Load next ETD button (oldest archive)
	$('#loadBtn').click(function () {

		// call API get function getOneArchive(archive, id, status) to get data about archive
		getOneArchive(null, 'oldest', null).done(function (res) {
			//Disable Button
			$('#loadBtn').attr("disabled", "disabled");
			// create currentArchive object from response
			currentArchive = new Archive(res);
			//Validate data
			currentArchive.json = validation_etd_data(currentArchive.json)
			// use json2html to display json
			visualize(currentArchive.json);
			// display archive files that are not XML
			$('#archiveFiles').html(currentArchive.parseArchiveFiles());

			// prefill the form using function mapJson
			currentArchive.preFillForm(currentArchive.mapJson()).done(function (res) {
				// create disciplines string from disciplines inputs
				createDisciplinesString();
				// once form is filled post to database and set the subId
				currentArchive.postFormData().done(function (res) {
					if (res.success) {
						currentArchive.subId = res.id;
						refreshSideBar();
					} else {
						console.log('Error: ' + res.error);
					}
					//Enable Button
					$('#loadBtn').removeAttr("disabled");
				});
			});

		});

	});

	// submit button
	$('.submit').click(function () {

		// check if any discipline is in error and prevent moving to pending
		if ($('.discipline').hasClass('errorInput') && $('#workflow_status').val() === 'P') {
			alert('There is an error in Discipline. Change workflow status to Problem not Pending.');
		} else if ($('#acceptance').val() != "1" && $('#workflow_status').val() === 'P') {
			alert('Pending status requires an Acceptance code of 1.');
		} else {
			var workflowStatus = $('#workflow_status').val();
			var archiveURL = createArchiveURL(currentArchive.archiveUrl);

			createDisciplinesString();

			currentArchive.postFormData().done(function (res) {
				refreshSideBar();
				clearViews();

				// if the status is changed to R then download the file since we are taking out of app
				if (workflowStatus === 'R') {
					window.location.assign(archiveURL);
				}
			});
		}
	});

	// batch download button
	$('#batchBtn').click(function () {
		window.location.assign('prepbatch.php');
		setTimeout(function () {
			refreshSideBar();
			clearViews();
		}, 3000);
	});

	// initial settings for dialog modal
	$('#dialog').dialog({
		autoOpen: false,
		modal: true
	});

});

// click handlers for dynamically created elements
$(document).on('click', '.getme', function (event) {
	var subId = event.target.attributes.subId.textContent;
	var archive = event.target.attributes.archive.textContent;
	var status = event.target.attributes.status.textContent;

	getOneArchive(archive, subId, status).done(function (res) {

		currentArchive = new Archive(res);

		// use json2html to display json
		visualize(currentArchive.json);

		// display archive files that are not XML
		$('#archiveFiles').html(currentArchive.parseArchiveFiles());

		// call map function that maps database data to the edit form's fields
		currentArchive.preFillForm(currentArchive.mapDb());
	});
});

// looks up and validates the discipline on click out
$(document).on('focusout', '.discipline', function (event) {
	markDiscipline(event.target.value, event.target);
});

// launches discipline search modal
$(document).on('click', '#editDiscipline', function (event) {
	// id needed for angular modal
	id = $(event.target).closest('div').find('input').attr('id');
	// open the modal
	$('#dialog').dialog('open');
});

// add additional discipline input box
$(document).on('click', '#addDiscipline', function () {
	var nextDisciplineId = 0;

	// if there are already inputs add after
	if ($('.discipline-group')[0]) {
		nextDisciplineId = Number($('.discipline-group:last').find('input').attr('id').substring(10)) + 1;
		$('.discipline-group:last').after(html(nextDisciplineId));
	} else {
		$('label[for="discipline"]').after(html(nextDisciplineId));
	}

	// mark as error since blank
	$('#discipline' + nextDisciplineId).addClass("errorInput");

	function html(id) {
		return '<div class="input-group discipline-group">' +
			'<input class="form-control discipline" id="discipline' + id + '">' +
			'<span id="editDiscipline" class="btn input-group-addon">Edit</span>' +
			'<span id="deleteDiscipline" class="btn input-group-addon">X</span>' +
			'</div>';
	}
});

$(document).on('click', '#deleteDiscipline', function () {
	$(this).closest('div').remove();

});

// Display Functions ===============================================================================

// parse archive folder contents for non XML files, return links to those files
Archive.prototype.parseArchiveFiles = function () {
	var html = '';

	// loop through array of files in archive
	for (var i = 2; i < this.contents.length; i++) {
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
Archive.prototype.preFillForm = function (maps) {
	var dfd = $.Deferred();

	$('#xmlEdit').empty();

	maps.forEach(function (map) {
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
				if (map.id === 'acceptance' && map.data !== '1') {
					$('#acceptance').addClass("errorInput");
				}
				break;
			case 'drop-down':
				var select = '<select class="form-control" name="' + map.id + '" id="' + map.id + '">' +
					'<option value="W">Working</option>' +
					'<option value="P">Pending</option>' +
					'<option value="L">Problem</option>' +
					'<option value="R">Real Problem *will download and remove this ETD*</option>'
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
				map.data.forEach(function (discipline, index) {
					$('.form-group:last').append('<div class="input-group discipline-group">' +
						'<input class="form-control discipline" id="' + map.id + index + '" name="' + map.id + index + '">' +
						'<span id="editDiscipline" class="btn input-group-addon">Edit</span>' +
						'<span id="deleteDiscipline" class="btn input-group-addon">X</span>' +
						'</div>');
					$('#' + map.id + index).val(discipline);
					// mark diciplines not in db list
					markDiscipline(discipline, '#' + 'discipline' + index);
				});
				// add additional discipline input btn
				$('.input-group:last').after('<button type="button"class="btn btn-sm" id="addDiscipline">Add Discipline</button>');
				// create hidden input for disciplines
				$('#xmlEdit').append('<input type="hidden" class="form-control" id="disciplines" name="disciplines">');
		}
	});

	dfd.resolve();
	// show submit and move buttons
	$('.submitBtn').show();
	return dfd.promise();
};
//Validate json data elements
function validation_etd_data(data) {
	//Check ETD Discipline and convert to Title Case format.
	if (data.description.categorization.category instanceof Array) {
		$.each(data.description.categorization.category, function (index, value) {
			value.cat_desc = value.cat_desc.toTitleCase();
			data.description.categorization.category[index] = value
		})
	} else {
		value = data.description.categorization.category.cat_desc.toTitleCase();
		data.description.categorization.category.cat_desc = value;
	}
	//Convert Keyword to lower case
	try {
		data.description.categorization.keyword = data.description.categorization.keyword.toLowerCase();
	}
	catch (err) { }

	return data;
}
// Initial data gets for sidebar
function refreshSideBar() {
	$('#batchBtn').hide();

	// call API get function getOldestArchive to get oldest archives in ftp dir
	getOldestArchive().done(function (res) {
		// if there is at least one archive
		if (res.numArchives) {
			var date = new Date(res.oldestModifiedDate * 1000);
			$('#oldestArchive').text(res.oldestArchive);
			$('#modifiedDate').text(date);
			$('#numArchives').text(res.numArchives);
		} else {
			$('#numArchives').text(0);
			$('#oldestArchive').text('No more archives');
			$('#loadBtn').hide();
		}
	});

	// call API get function getArchives to get archives in working dir and their status
	getArchives().done(function (res) {
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
				if (archives[i].identikey === identikey) {
					$('#batchBtn').show();
				}
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
	$('.discipline').each(function (index) {
		strDisciplines += $(this).val() + ';';
	});
	strDisciplines = strDisciplines.substring(0, strDisciplines.length - 1);
	// add value to hidden disciplines input
	$('#disciplines').val(strDisciplines);
}

// look up disciplines in db and mark those that don't exist
function markDiscipline(discipline, target) {
	lookupDiscipline(discipline).done(function (res) {
		if (!res) {
			$(target).addClass("errorInput");
		} else {
			$(target).removeClass("errorInput");
		}
	});
}

// Helper Functions ================================================================================

// calculate the number of rows the textareas should be to show all text
function calcRows(scrollHeight) {
	return Math.round(scrollHeight / 20) - 1;
}

// remove '@' and 'DISS_'
function stripChars(str) {
	var mapObj = {
		'@attributes': 'attributes',
		'DISS_': ''
	};

	str = str.replace(/@attributes|DISS_/g, function (matched) {
		return mapObj[matched];
	});

	return str;
}

// creates the URL to download the real problem archive
function createArchiveURL(url) {
	var urlString = url.split('/');
	var ID = urlString[urlString.length - 1];
	return ('getArchive.php?file=' + ID);
	//return ('getArchive.php?file=etdadmin_upload_' + ID + '.zip');
}
// API CALLS =======================================================================================

function lookupDiscipline(discipline) {
	var dfd = $.Deferred();

	$.ajax({
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {
			'action': 'lookupDiscipline',
			'data': discipline
		},
		success: function (res, status) {
			if (res.length > 5) {
				console.log('Error: ' + res);
			} else {
				dfd.resolve(JSON.parse(res));
			}
		},
		error: function (xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError: " + err);
		}
	});

	return dfd.promise();
}

// post form data to DB
Archive.prototype.postFormData = function () {

	var dfd = $.Deferred();

	$.ajax({
		url: 'modules/archive/archive.php',
		type: 'POST',
		data: {
			'action': 'postFormData',
			'subId': this.subId,
			'data': $('#xmlEdit').serialize()
		},
		success: function (res, status) {
			console.log(res);
			dfd.resolve(JSON.parse(res));
		},
		error: function (xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError: " + err);
		}
	});

	return dfd.promise();
};

// get oldest archive from ftp directory
function getOldestArchive() {
	var dfd = $.Deferred();

	$.ajax({
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: { 'action': 'getOldestArchive' },
		success: function (res, status) {
			dfd.resolve(JSON.parse(res));
		},
		error: function (xhr, desc, err) {
			console.log(xhr);
			console.log("Details: " + desc + "\nError: " + err);
		}
	});

	return dfd.promise();
}

// get archive's dir names in working, pending, and problems dirs
function getArchives() {
	var dfd = $.Deferred();

	$.ajax({
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: { 'action': 'getArchives' },
		success: function (res, status) {
			try {
				dfd.resolve(JSON.parse(res));
			} catch (err) {
				console.log(res, "ERROR:", err);
			}

		},
		error: function (xhr, desc, err) {
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
		$.ajax({
			url: 'modules/archive/archive.php',
			type: 'GET',
			datatype: 'JSON',
			data: {
				'action': 'getExtractOldestArchive',
			},
			success: function (res, status) {
				dfd.resolve(JSON.parse(res));
			},
			error: function (xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError: " + err);
			}
		});
	} else {
		$.ajax({
			url: 'modules/archive/archive.php',
			type: 'GET',
			datatype: 'JSON',
			data: {
				'action': 'getOneArchive',
				'status': status,
				'subId': subId,
				'archive': archive
			},
			success: function (res, status) {
				dfd.resolve(JSON.parse(res));
			},
			error: function (xhr, desc, err) {
				console.log(xhr);
				console.log("Details: " + desc + "\nError: " + err);
			}
		});
	}

	return dfd.promise();
}
