function mapFunc(xmlData, readyUrl, pdfFile) {
	return [
		{
			"name": "Title",
			"id": "title",
			"data": xmlData.description.title.toTitleCase(),
			"type": "text-long"
		},
		{
			"name": "Full Text Url",
			"id": "fulltext_url",
			"data": readyUrl + pdfFile,
			"type": "url"
		},
		{
			"name": "Keywords",
			"id": "keywords",
			"data": xmlData.description.categorization.keyword,
			"type": "text-long"
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": concatParas(xmlData.content.abstract.para),
			"type": "text-long",
		},
		{
			"name": "Author1 FName",
			"id": "author1_fname",
			"data": xmlData.authorship.author.name.fname,
			"type": "text"
		},
		{
			"name": "Author1 MName",
			"id": "author1_mname",
			"data": (xmlData.authorship.author.name.middle[0]) ? xmlData.authorship.author.name.middle : undefined,
			"type": "text"
		},
		{
			"name": "Author1 LName",
			"id": "author1_lname",
			"data": xmlData.authorship.author.name.surname,
			"type": "text"
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": (xmlData.authorship.author.name.suffix[0]) ? xmlData.authorship.author.name.suffix : undefined,
			"type": "text"
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": xmlData.authorship.author.contact[1].email || xmlData.authorship.author.contact[0].email,
			"type": "email"
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": xmlData.description.institution.inst_name,
			"type": "text"
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": (xmlData.description.cmte_member[0]) ? xmlData.description.cmte_member[0].name.surname + ', ' + xmlData.description.cmte_member[0].name.fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": (xmlData.description.cmte_member[1]) ? xmlData.description.cmte_member[1].name.surname + ', ' + xmlData.description.cmte_member[1].name.fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": (xmlData.description.cmte_member[2]) ? xmlData.description.cmte_member[2].name.surname + ', ' + xmlData.description.cmte_member[2].name.fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": (xmlData.description.cmte_member[3]) ? xmlData.description.cmte_member[3].name.surname + ', ' + xmlData.description.cmte_member[3].name.fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": (xmlData.description.cmte_member[4]) ? xmlData.description.cmte_member[4].name.surname + ', ' + xmlData.description.cmte_member[4].name.fname : undefined,
			"type": "text"
		},
		{
			"name": "Disciplines",
			"id": "disciplines",
			"data": xmlData.description.institution.inst_contact,
			"type": "text"
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": "",
			"type": "text"
		},
		{
			"name": "Degree Name",
			"id": "degree_name",
			"data": xmlData.description.degree.replace(/\./g, ''),
			"type": "text"
		},
		{
			"name": "Department",
			"id": "department",
			"data": xmlData.description.institution.inst_contact,
			"type": "text"
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": (xmlData.description.attributes.type === 'doctoral') ? 'Dissertation' : 'Thesis',
			"type": "text"
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": embargoDate(xmlData.attributes.embargo_code),
			"type": "date"
		},
		{
			"name": "Publication Date",
			"id": "publication_date",
			"data": xmlData.description.dates.comp_date + '-01-01',
			"type": "date"
		},
		{
			"name": "Season",
			"id": "season",
			"data": "Spring",
			"type": "text"
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

