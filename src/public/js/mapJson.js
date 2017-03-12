function mapJson(archive) {

	
	return [
		{
			"name": "Editor",
			"id": "identikey",
			"data": identikey,
			"type": "text",
			"readonly": true
		},
		{
			"name": "Archive Name",
			"id": "sequence_num",
			"data": archive.name,
			"type": "text",
			"readonly": true
		},
		{
			"name": "Title",
			"id": "title",
			"data": archive.json.description.title.toTitleCase(),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Full Text Url",
			"id": "fulltext_url",
			"data": archive.readyUrl + archive.pdf,
			"type": "url",
			"readonly": true
		},
		{
			"name": "Keywords",
			"id": "keywords",
			"data": archive.json.description.categorization.keyword,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": concatParas(archive.json.content.abstract.para),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Author1 FName",
			"id": "author1_fname",
			"data": archive.json.authorship.author.name.fname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 MName",
			"id": "author1_mname",
			"data": (archive.json.authorship.author.name.middle[0]) ? archive.json.authorship.author.name.middle : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 LName",
			"id": "author1_lname",
			"data": archive.json.authorship.author.name.surname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": (archive.json.authorship.author.name.suffix[0]) ? archive.json.authorship.author.name.suffix : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": archive.json.authorship.author.contact[1].email || archive.json.authorship.author.contact[0].email,
			"type": "email",
			"readonly": false
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": archive.json.description.institution.inst_name,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": (archive.json.description.cmte_member[0]) ? archive.json.description.cmte_member[0].name.surname + ', ' + archive.json.description.cmte_member[0].name.fname : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": (archive.json.description.cmte_member[1]) ? archive.json.description.cmte_member[1].name.surname + ', ' + archive.json.description.cmte_member[1].name.fname : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": (archive.json.description.cmte_member[2]) ? archive.json.description.cmte_member[2].name.surname + ', ' + archive.json.description.cmte_member[2].name.fname : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": (archive.json.description.cmte_member[3]) ? archive.json.description.cmte_member[3].name.surname + ', ' + archive.json.description.cmte_member[3].name.fname : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": (archive.json.description.cmte_member[4]) ? archive.json.description.cmte_member[4].name.surname + ', ' + archive.json.description.cmte_member[4].name.fname : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Disciplines",
			"id": "disciplines",
			"data": archive.json.description.institution.inst_contact,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": "",
			"type": "text",
			"readonly": false
		},
		{
			"name": "Degree Name",
			"id": "degree_name",
			"data": archive.json.description.degree.replace(/\./g, ''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Department",
			"id": "department",
			"data": archive.json.description.institution.inst_contact,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": (archive.json.description.attributes.type === 'doctoral') ? 'Dissertation' : 'Thesis',
			"type": "text",
			"readonly": false
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": embargoDate(archive.json.attributes.embargo_code),
			"type": "date",
			"readonly": false
		},
		{
			"name": "Publication Date",
			"id": "publication_date",
			"data": archive.json.description.dates.comp_date + '-01-01',
			"type": "date",
			"readonly": false
		},
		{
			"name": "Season",
			"id": "season",
			"data": "Spring",
			"type": "text",
			"readonly": false
		}
	];
}

String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), 
      function(txt) {
        return txt.toLowerCase();
      });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv'];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), 
      uppers[i].toUpperCase());

  return str;
};

var embargoDate = function(code) {
	// get todays date and format for HTML5 date format ie yyyy-mm-dd
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);

	if (code === '0') {
		return today;
	}

};

// concat the paragraphs under abstract adding <p></p> tags if multiple paragraphs
var concatParas = function(paras) {
	if (typeof(paras) === 'object') {
		var str = '';
		for (var i = 0; i < paras.length; i++) {
			str += '<p>' + paras[i] + '</p>';
		}
		return str;
	} else {
		return paras;
	}
}

