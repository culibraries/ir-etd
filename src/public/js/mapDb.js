Archive.prototype.mapDb = function() {
	
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
			"name": "Title",
			"id": "title",
			"data": this.db.title,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Full Text Url",
			"id": "fulltext_url",
			"data": this.batchUrl + this.name + '/' + this.pdf,
			"type": "text",
			"readonly": true
		},
		{
			"name": "Keywords",
			"id": "keywords",
			"data": this.db.keywords,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": this.db.abstract,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Author1 FName",
			"id": "author1_fname",
			"data": this.db.author1_fname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 MName",
			"id": "author1_mname",
			"data": this.db.author1_mname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 LName",
			"id": "author1_lname",
			"data": this.db.author1_lname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": this.db.author1_suffix,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": this.db.author1_email,
			"type": "email",
			"readonly": false
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": this.db.author1_institution,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": this.db.advisor1,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": this.db.advisor2,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": this.db.advisor3,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": this.db.advisor4,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": this.db.advisor5,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Disciplines",
			"id": "disciplines",
			"data": this.db.disciplines,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": this.db.comments,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Degree Name",
			"id": "degree_name",
			"data": this.db.degree_name,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Department",
			"id": "department",
			"data": this.db.department,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": this.db.document_type,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": this.db.embargo_date,
			"type": "date",
			"readonly": false
		},
		{
			"name": "Publication Date",
			"id": "publication_date",
			"data": this.db.publication_date,
			"type": "date",
			"readonly": false
		},
		{
			"name": "Season",
			"id": "season",
			"data": this.db.season,
			"type": "text",
			"readonly": false
		}
	];
};
