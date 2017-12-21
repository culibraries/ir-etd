Archive.prototype.mapDb = function() {

	return [
		{
			"name": "Workflow Status",
			"id": "workflow_status",
			"data": _.get(this,'status',''),
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
			"data": _.get(this,'name',''),
			"type": "text",
			"readonly": true
		},
		{
			"name": "Acceptance",
			"id": "acceptance",
			"data": (_.get(this,'db.acceptance','Blank')=='Bl')? 'Blank':_.get(this,'db.acceptance',''),
			//(_.isUndefined(this.json.repository)) ? 'Blank': (_.isObject(this.json.repository.acceptance))? 'Blank': this.json.repository.acceptance,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Title",
			"id": "title",
			"data": _.get(this,'db.title',''),
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
			"data": _.get(this,'db.keywords',''),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": _.get(this,'db.abstract',''),
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Author1 Fname",
			"id": "author1_fname",
			"data": _.get(this,'db.author1_fname',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Mname",
			"id": "author1_mname",
			"data": _.get(this,'db.author1_mname',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Lname",
			"id": "author1_lname",
			"data": _.get(this,'db.author1_lname',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": _.get(this,'db.author1_suffix',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": _.get(this,'db.author1_email',''),
			"type": "email",
			"readonly": false
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": _.get(this,'db.author1_institution',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": _.get(this,'db.advisor1',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": _.get(this,'db.advisor2',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": _.get(this,'db.advisor3',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": _.get(this,'db.advisor4',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": _.get(this,'db.advisor5',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Disciplines (Subject Categories)",
			"id": "discipline",
			"data": this.db.disciplines.split(';'),
			"type": "disciplines",
			"readonly": false
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": _.get(this,'db.comments',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Degree name",
			"id": "degree_name",
			"data": _.get(this,'db.degree_name',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Department",
			"id": "department",
			"data": _.get(this,'db.department',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": _.get(this,'db.document_type',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": _.get(this,'db.embargo_date',''),
			"type": "text",
			"readonly": false
		},
		{
			"name": "Publication Date",
			"id": "publication_date",
			"data": _.get(this,'db.publication_date',''),
			"type": "date",
			"readonly": false
		},
		{
			"name": "Season",
			"id": "season",
			"data": _.get(this,'db.season',''),
			"type": "text",
			"readonly": false
		}
	];
};
