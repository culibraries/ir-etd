
$(document).ready(function() {
	// get the oldest archive

	var oldestArchive;
	var archiveData;
	// scan data dir and get the oldest archive
	$.ajax( {
		url: 'modules/archive/archive.php',
		type: 'GET',
		data: {'action': 'getOldestArchive'},
		success: function(res, status) {
			oldestArchive = res;
			$('#oldestArchive').text(res);
		},
		error: function(xhr, desc, err) {
	            console.log(xhr);
	            console.log("Details: " + desc + "\nError: " + err);
	    }
	});

	// on click Load button
	$('#fileSelect').click(function() {
		// unzip to working dir
		$.ajax( {
			url: 'modules/archive/archive.php',
			type: 'POST',
			datatype: 'JSON',
			data: {
				'action': 'selectArchive',
				'file': oldestArchive
			},
			success: function(res, status) {
				var data = JSON.parse(res);
				console.log(data);
				displayArchiveFiles(data);
				// get json object of xml data
				$.ajax({
					url: 'modules/xml/xml.php',
					type: 'GET',
					data: {
						'action': 'getJsonFromXml',
						'path': data.folder
					},
					success: function(res, status) {
						archiveData = JSON.parse(res);
						// use json2html to display json 
						visualize(archiveData);
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

	function displayArchiveFiles(data) {
		for (var i=2; i<data.folderContents.length; i++) {
			var file = data.folderContents[i];
			var ext = file.substr(file.length - 3, file.length);
			if (ext !== 'xml') {
				console.log(file);
				$('#archiveFiles').html('<a target="_blank" href="' + data.root + data.folder + '/' + file + '">' + file + '</a>');
			}
		}
	}

});