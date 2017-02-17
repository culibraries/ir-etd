
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
			data: {
				'action': 'selectArchive',
				'file': oldestArchive
			},
			success: function(res, status) {
				// get json object of xml data
				$.ajax({
					url: 'modules/xml/xml.php',
					type: 'GET',
					data: {
						'action': 'getJsonFromXml',
						'path': oldestArchive.substr(0, oldestArchive.length - 4)
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

});