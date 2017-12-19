Archive.prototype.mapDb = function() {

	return [
		{
			"me": "Workflow Status",
			"id": "workflow_status",
			"data": _.get(this,'status',''),
			"type": "drop-down",
			"readonly": true
		},
		{
			"me": "Editor",
			"id": "identikey",
			"data": identikey,
			"type": "text",
			"readonly": true
		},
		{
			"me": "ETD Sequence",
			"id": "sequence_num",
			"data": _.get(this,'me',''),
			"type": "text",
			"readonly": true
		},
		{
			"me": "Acceptance",
			"id": "acceptance",
			"data": (_.isUndefined(this.json.repository)) ? 'Not Set': (_.isObject(this.json.repository.acceptance))? 'Not Set': this.json.repository.acceptance,
			"type": "text",
			"readonly": true
		},
		{
			"me": "Title",
			"id": "title",
			"data": _.get(this,'db.title',''),
			"type": "text-long",
			"readonly": false
		},
		{
			"me": "Full Text Url",
			"id": "fulltext_url",
			"data": [this.batchUrl,this.me,'/',this.pdf].join(),
			"type": "text",
			"readonly": true
		},
		{
			"me": "Keywords",
			"id": "keywords",
			"data": _.get(this,'db.keywords',''),
			"type": "text-long",
			"readonly": false
		},
		{
			"me": "Abstract",
			"id": "abstract",
			"data": _.get(this,'db.abstract',''),
			"type": "text-long",
			"readonly": false
		},
		{
			"me": "Author1 Fme",
			"id": "author1_fme",
			"data": _.get(this,'db.author1_fme',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Author1 Mme",
			"id": "author1_mme",
			"data": _.get(this,'db.author1_mme',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Author1 Lme",
			"id": "author1_lme",
			"data": _.get(this,'db.author1_lme',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Author1 Suffix",
			"id": "author1_suffix",
			"data": _.get(this,'db.author1_suffix',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Author1 Email",
			"id": "author1_email",
			"data": _.get(this,'db.author1_email',''),
			"type": "email",
			"readonly": false
		},
		{
			"me": "Author1 Institution",
			"id": "author1_institution",
			"data": _.get(this,'db.author1_institution',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Advisor1",
			"id": "advisor1",
			"data": _.get(this,'db.advisor1',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Advisor2",
			"id": "advisor2",
			"data": _.get(this,'db.advisor2',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Advisor3",
			"id": "advisor3",
			"data": _.get(this,'db.advisor3',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Advisor4",
			"id": "advisor4",
			"data": _.get(this,'db.advisor4',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Advisor5",
			"id": "advisor5",
			"data": _.get(this,'db.advisor5',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Disciplines (Subject Categories)",
			"id": "discipline",
			"data": this.db.disciplines.split(';'),
			"type": "disciplines",
			"readonly": false
		},
		{
			"me": "Comments",
			"id": "comments",
			"data": _.get(this,'db.comments',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Degree me",
			"id": "degree_me",
			"data": _.get(this,'db.degree_me',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Department",
			"id": "department",
			"data": _.get(this,'db.department',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Document Type",
			"id": "document_type",
			"data": _.get(this,'db.document_type',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Embargo Date",
			"id": "embargo_date",
			"data": _.get(this,'db.embargo_date',''),
			"type": "text",
			"readonly": false
		},
		{
			"me": "Publication Date",
			"id": "publication_date",
			"data": _.get(this,'db.publication_date',''),
			"type": "date",
			"readonly": false
		},
		{
			"me": "Season",
			"id": "season",
			"data": _.get(this,'db.season',''),
			"type": "text",
			"readonly": false
		}
	];
};
