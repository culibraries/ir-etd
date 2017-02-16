
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
				console.log(res);
				$.ajax({
					url: 'modules/xml/xml.php',
					type: 'GET',
					data: {
						'action': 'getJsonFromXml',
						'path': oldestArchive.substr(0, oldestArchive.length - 4)
					},
					success: function(res, status) {
						archiveData = JSON.parse(res);
						// $('#xmlView').html(
						// 	$.each(archiveData, function(key, value) {
						// 		return key + value;
						// 	}
						// );
						$('#surname').text(archiveData.DISS_authorship.DISS_author.DISS_name.DISS_surname);
						$('#fname').text(archiveData.DISS_authorship.DISS_author.DISS_name.DISS_fname);
						$('#middle').text(archiveData.DISS_authorship.DISS_author.DISS_name.DISS_middle);
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