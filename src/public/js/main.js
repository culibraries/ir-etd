
$(document).ready(function() {
	// get the oldest archive

	var oldestArchive;

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

	// on click Loac button
	$('#fileSelect').click(function() {
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
						'action': 'getXmlFile',
						'path': oldestArchive.substr(0, oldestArchive.length - 4)
					},
					success: function(res, status) {
						console.log(res);
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