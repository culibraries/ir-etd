Archive.prototype.mapJson = function() {
	//set Pub Date and Label Array [stringDate,label]
  pubDateLabel = publicationDate(this.json)
	return [
		{
			"name": "Workflow Status",
			"id": "workflow_status",
			"data": this.status,
			"type": "drop-down",
			"readonly": true
		},
		{
			"name": "Editor",
			"id": "identikey",
			"data": identikey,
			"type": "text",
			"readonly": true
		},
		{
			"name": "ETD Sequence",
			"id": "sequence_num",
			"data": this.name,
			"type": "text",
			"readonly": true
		},
		{
			"name": "Acceptance",
			"id": "acceptance",
			"data": (_.isUndefined(this.json.repository)) ? 'Blank': (_.isObject(this.json.repository.acceptance))? 'Blank': this.json.repository.acceptance,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Title",
			"id": "title",
			"data": this.json.description.title.toTitleCase(),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Full Text Url",
			"id": "fulltext_url",
			"data": [this.batchUrl,this.name,'/',this.pdf].join(''),
			"type": "text",
			"readonly": true
		},
		{
			"name": "Keywords",
			"id": "keywords",
			"data": (typeof this.json.description.categorization.keyword === 'string') ? this.json.description.categorization.keyword : undefined,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": concatParas(this.json.content.abstract.para),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Author1 FName",
			"id": "author1_fname",
			"data": this.json.authorship.author.name.fname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 MName",
			"id": "author1_mname",
			"data": (this.json.authorship.author.name.middle[0]) ? addPeriodToMiddle(this.json.authorship.author.name.middle) : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 LName",
			"id": "author1_lname",
			"data": this.json.authorship.author.name.surname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": (this.json.authorship.author.name.suffix[0]) ? this.json.authorship.author.name.suffix : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": this.json.authorship.author.contact[1].email || this.json.authorship.author.contact[0].email,
			"type": "email",
			"readonly": false
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": this.json.description.institution.inst_name,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": createAdvisors(this.json.description)[0],
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": (createAdvisors(this.json.description)[1]) ? createAdvisors(this.json.description)[1] : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": (createAdvisors(this.json.description)[2]) ? createAdvisors(this.json.description)[2] : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": (createAdvisors(this.json.description)[3]) ? createAdvisors(this.json.description)[3] : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": (createAdvisors(this.json.description)[4]) ? createAdvisors(this.json.description)[4] : undefined,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Disciplines (Subject Categories)",
			"id": "discipline",
			"data": arrayDisciplines(this.json.description.categorization.category),
			"type": "disciplines",
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
			"data": this.json.description.degree.replace(/\./g, ''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Department",
			"id": "department",
			"data": this.json.description.institution.inst_contact,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": (this.json.description.attributes.type === 'doctoral') ? 'dissertation' : 'thesis',
			"type": "text",
			"readonly": false
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": embargoCode(this.json.attributes.embargo_code),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Publication Date: Calculated( " + pubDateLabel[1] + " = " + pubDateLabel[0] + " )",
			"id": "publication_date",
			"data": pubDateLabel[0],//.description.dates.comp_date + '-01-01',
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
};

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
};

// create array of the disciplines
var arrayDisciplines = function(category) {
	var arrayCategory = [];
	// if category is an array of objects ie more than one discipline
	if (category.length) {
		// create array of the discliplines
		category.forEach(function(item) {
			arrayCategory.push(item.cat_desc);
		});
		// and return it
		return arrayCategory;
	} else {
		// else there is only one discipline so return it in an array
		return [category.cat_desc];
	}
};
// Publication Date Calculation
function publicationDate(json){
	embargo_days = parseInt(embargoCode(json.attributes.embargo_code));
	if (checkNested(json,'restriction','sales_restriction','attributes','remove')){
		if(json.restriction.sales_restriction.attributes.remove.trim() !== ""){
			dateParts = json.restriction.sales_restriction.attributes.remove.trim().split(" ")[0].split("/");
			strDate = [dateParts[2],dateParts[0],dateParts[1]].join('-')
			label = "sales_restriction Remove Date: " + strDate
			return [strDate,label];
	 	}
	}
	if (checkNested(json,'repository','agreement_decision_date')){
    try {
		  if(json.repository.agreement_decision_date.trim() !== ""){
			  strAgreeDate = json.repository.agreement_decision_date.trim().split(" ")[0]
			  startDate = new Date(json.repository.agreement_decision_date.trim())
			  label = "agreement_decision_date: " + strAgreeDate + " + " + embargo_days + " days"
			  return [calculateEmbargoDate(startDate,embargo_days),label];
	    }
    }catch(err){
      //pass 
    }
	}
	startDate =  new Date(json.description.dates.comp_date + '-01-01 12:00:00 GMT-0700 (MST)')
	label = "accept_date: " + json.description.dates.comp_date + "-01-01 + " + embargo_days + " days"
	return [calculateEmbargoDate(startDate,embargo_days),label];
}
function calculateEmbargoDate(startDate,days){
	newdate = new Date(startDate);
	if (days != 0){
			if (days===365){
				newdate.setFullYear(newdate.getFullYear() + 1)
			}
			else if (days===730){
				newdate.setFullYear(newdate.getFullYear() + 2)
			}
			else if (days==1095){
				newdate.setFullYear(newdate.getFullYear() + 3)
			}else{
				newdate.setDate(newdate.getDate() + (days));
			}
	}
	return [newdate.getFullYear(),('0'+ (newdate.getMonth()+1)).slice(-2),('0' + newdate.getDate()).slice(-2)].join('-');
}
// lookup function for embargo codes
var embargoCode = function(code) {
	switch (code) {
		case '0': return '0';
		case '1': return '184';
		case '2': return '365';
		case '3': return '730';
		case '4': return '1095';
	}
};

var concatAdvisor = function(advisor) {
	var str = '';
	str += advisor.name.fname + ' ';
	if (typeof advisor.name.middle === 'string') {
		if (advisor.name.middle.length > 1 && advisor.name.middle[advisor.name.middle.length - 1] === '.') {
			str += advisor.name.middle + ' ';
		} else  {
			str += advisor.name.middle + '. ';
		}
	}
	str += advisor.name.surname;
	return str;
};

var createAdvisors = function(member) {
	var advisors = member.advisor;
	var committee = member.cmte_member || [];
	var advisorArray = [];

	if (advisors.constructor === Array) {
		advisors.forEach(function(item) {
			advisorArray.push(concatAdvisor(item));
		});
	} else {
		advisorArray.push(concatAdvisor(advisors));
	}

	if (committee.constructor === Array) {
		committee.forEach(function(item) {
			advisorArray.push(concatAdvisor(item));
		});
	} else {
		advisorArray.push(concatAdvisor(committee));
	}
	return advisorArray;
};

var addPeriodToMiddle = function(name) {
	if (name.length === 1) {
		return name + '.';
	} else {
		return name;
	}
};

function checkNested(obj /*, level1, level2, ... levelN*/) {
  var args = Array.prototype.slice.call(arguments, 1);

  for (var i = 0; i < args.length; i++) {
    if (!obj || !obj.hasOwnProperty(args[i])) {
      return false;
    }
    obj = obj[args[i]];
  }
  return true;
}
