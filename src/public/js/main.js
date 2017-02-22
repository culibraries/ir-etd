
$(document).ready(function() {
	var oldestArchive;
	var archiveData;
	
	// get oldest archive from data directory
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
				'action': 'loadArchive'
			},
			success: function(res, status) {
				var data = JSON.parse(res);
				
				displayArchiveFiles(data);

				// get json object of xml data
				$.ajax({
					url: 'modules/xml/xml.php',
					type: 'GET',
					data: {
						'action': 'getJsonFromXml',
						'archive': data.folder
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

	// function to display the non xml files in archive
	function displayArchiveFiles(data) {
		// loop through array of files in archive
		for (var i=2; i<data.folderContents.length; i++) {
			var file = data.folderContents[i];
			var ext = file.substr(file.length - 3, file.length);

			// display files that are not xml
			if (ext !== 'xml') {
				$('#archiveFiles').html('<a target="_blank" href="' + data.url + data.folder + '/' + file + '">' + file + '</a>');
			}
		}
	}

});