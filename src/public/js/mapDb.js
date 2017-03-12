function mapDb(archive) {
	
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
			"data": archive.db.title,
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
			"data": archive.db.keywords,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": archive.db.abstract,
			"type": "text-long",
			"readonly": false
		},
		{
			"name": "Author1 FName",
			"id": "author1_fname",
			"data": archive.db.author1_fname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 MName",
			"id": "author1_mname",
			"data": archive.db.author1_mname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 LName",
			"id": "author1_lname",
			"data": archive.db.author1_lname,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Suffix",
			"id": "author1_suffix",
			"data": archive.db.author1_suffix,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Author1 Email",
			"id": "author1_email",
			"data": archive.db.author1_email,
			"type": "email",
			"readonly": false
		},
		{
			"name": "Author1 Institution",
			"id": "author1_institution",
			"data": archive.db.author1_institution,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": archive.db.advisor1,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": archive.db.advisor2,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": archive.db.advisor3,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": archive.db.advisor4,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": archive.db.advisor5,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Disciplines",
			"id": "disciplines",
			"data": archive.db.disciplines,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": archive.db.comments,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Degree Name",
			"id": "degree_name",
			"data": archive.db.degree_name,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Department",
			"id": "department",
			"data": archive.db.department,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Document Type",
			"id": "document_type",
			"data": archive.db.document_type,
			"type": "text",
			"readonly": false
		},
		{
			"name": "Embargo Date",
			"id": "embargo_date",
			"data": archive.db.embargo_date,
			"type": "date",
			"readonly": false
		},
		{
			"name": "Publication Date",
			"id": "publication_date",
			"data": archive.db.publication_date,
			"type": "date",
			"readonly": false
		},
		{
			"name": "Season",
			"id": "season",
			"data": archive.db.season,
			"type": "text",
			"readonly": false
		}
	];
}
