function mapFunc(xmlData) {
	return [
		{
			"name": "Title",
			"id": "title",
			"data": xmlData.DISS_description.DISS_title,
			"type": "text-long"
		},
		{
			"name": "Full Text Url",
			"id": "fullTextUrl",
			"data": "will be internet accessable url",
			"type": "url"
		},
		{
			"name": "Keywords",
			"id": "keywords",
			"data": xmlData.DISS_description.DISS_categorization.DISS_keyword,
			"type": "text-long"
		},
		{
			"name": "Abstract",
			"id": "abstract",
			"data": xmlData.DISS_content.DISS_abstract.DISS_para,
			"type": "text-long",
		},
		{
			"name": "Author1 FName",
			"id": "fName",
			"data": xmlData.DISS_authorship.DISS_author.DISS_name.DISS_fname,
			"type": "text"
		},
		{
			"name": "Author1 MName",
			"id": "mName",
			"data": xmlData.DISS_authorship.DISS_author.DISS_name.DISS_middle,
			"type": "text"
		},
		{
			"name": "Author1 LName",
			"id": "lname",
			"data": xmlData.DISS_authorship.DISS_author.DISS_name.DISS_surname,
			"type": "text"
		},
		{
			"name": "Author1 Suffix",
			"id": "suffix",
			"data": (xmlData.DISS_authorship.DISS_author.DISS_name.DISS_suffix[0]) ? xmlData.DISS_authorship.DISS_author.DISS_name.DISS_suffix : undefined,
			"type": "text"
		},
		{
			"name": "Author1 Email",
			"id": "email",
			"data": xmlData.DISS_authorship.DISS_author.DISS_contact[0].DISS_email,
			"type": "email"
		},
		{
			"name": "Author1 Institution",
			"id": "institution",
			"data": xmlData.DISS_description.DISS_institution.DISS_inst_name,
			"type": "text"
		},
		{
			"name": "Advisor1",
			"id": "advisor1",
			"data": (xmlData.DISS_description.DISS_cmte_member[0]) ? xmlData.DISS_description.DISS_cmte_member[0].DISS_name.DISS_surname + ', ' + xmlData.DISS_description.DISS_cmte_member[0].DISS_name.DISS_fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor2",
			"id": "advisor2",
			"data": (xmlData.DISS_description.DISS_cmte_member[1]) ? xmlData.DISS_description.DISS_cmte_member[1].DISS_name.DISS_surname + ', ' + xmlData.DISS_description.DISS_cmte_member[1].DISS_name.DISS_fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor3",
			"id": "advisor3",
			"data": (xmlData.DISS_description.DISS_cmte_member[2]) ? xmlData.DISS_description.DISS_cmte_member[2].DISS_name.DISS_surname + ', ' + xmlData.DISS_description.DISS_cmte_member[2].DISS_name.DISS_fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor4",
			"id": "advisor4",
			"data": (xmlData.DISS_description.DISS_cmte_member[3]) ? xmlData.DISS_description.DISS_cmte_member[3].DISS_name.DISS_surname + ', ' + xmlData.DISS_description.DISS_cmte_member[3].DISS_name.DISS_fname : undefined,
			"type": "text"
		},
		{
			"name": "Advisor5",
			"id": "advisor5",
			"data": (xmlData.DISS_description.DISS_cmte_member[4]) ? xmlData.DISS_description.DISS_cmte_member[4].DISS_name.DISS_surname + ', ' + xmlData.DISS_description.DISS_cmte_member[4].DISS_name.DISS_fname : undefined,
			"type": "text"
		},
		{
			"name": "Disciplines",
			"id": "disciplines",
			"data": "???",
			"type": "text"
		},
		{
			"name": "Comments",
			"id": "comments",
			"data": "???",
			"type": "text"
		},
		{
			"name": "Degree Name",
			"id": "degreeName",
			"data": "xmlData.DISS_description.attributes.type",
			"type": "text"
		},
		{
			"name": "Department",
			"id": "department",
			"data": "xmlData.DISS_description.DISS_title",
			"type": "text"
		},
		{
			"name": "Document Type",
			"id": "docType",
			"data": "xmlData.DISS_description.DISS_title",
			"type": "text"
		},
		{
			"name": "Embargo Date",
			"id": "embargoDate",
			"data": "xmlData.DISS_description.DISS_title",
			"type": "date"
		},
		{
			"name": "Publication Date",
			"id": "pubDate",
			"data": "xmlData.DISS_description.DISS_title",
			"type": "date"
		},
		{
			"name": "Season",
			"id": "season",
			"data": "xmlData.DISS_description.DISS_title",
			"type": "text"
		}
	];
}