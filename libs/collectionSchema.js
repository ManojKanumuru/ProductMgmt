exports.collectionSchema = {
	"users": {
		"userName"		: {type: String},
		"password"		: {type: String},
        "firstName"		: {type: String},
		"lastName"		: {type: String}, 
        "officialEmail"	: {type: String},
        "contactPhone"	: {type: String},
        "userRole"      : {type: String},
        "status"        : {type: String},
        "createdBy"		: {type: String},
		"createdDate"	: {type: Date},
		"code"			: {type: String},
		"approvedDate"  : {type: Date},
		"codeValidity"	: {type: Boolean}
	},
	"categories": {
		"categoryId" 	: {type: String},
		"categoryName"	: {type: String},
		"categoryType"	: {type: String},
		"createdBy"		: {type: String},
		"createdDate"	: {type: String}
	},
	"products": {
		"productId" 	: {type: String},
		"productType" 	: {type: String},
		"categoryId"	: {type: String},
		"price"			: {type: String},
		"priceType"		: {type: String},
		"details"		: {type: String},
		"specification"	: {type: String},
		"createdDate"	: {type: Date},
		"createdBy"		: {type: String}
	},
	"productsAudit": {
		"productId" 	: {type: String},
		"productType" 	: {type: String},
		"categoryId"	: {type: String},
		"price"			: {type: String},
		"priceType"		: {type: String},
		"details"		: {type: String},
		"specification"	: {type: String},
		"actionType"	: {type: String},
		"createdDate"	: {type: Date},
		"createdBy"		: {type: String}
	},
	"batchRequests": {
		"requestId"		: {type: String},
		"requestType"	: {type: String},
		"requestObj"	: {type: Object},
		"requestDate"	: {type: Date},
		"approvedDate"	: {type: Date},
		"RejectedDate"	: {type: Date},
		"status"		: {type: String},
		"mailSentOn"	: {type: Date},
		"code"			: {type: String},
		"codeValidity"	: {type: Boolean}
	}
}
