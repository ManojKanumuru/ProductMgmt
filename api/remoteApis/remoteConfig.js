var apiRoutes = {
	"getUserDetails"		: "/api/user/getUserDetails",
	"adminUserDetails"		: "/api/user/adminUserDetails",
	"sendHtmlMail"   		: "/api/util/sendHtmlMail"
}

var staticUrls = {
	"contentMgmt"		: "http://localhost:3000",
	"utilService"		: "http://localhost:3001"
}

var dynamicUrls = {
	"contentMgmt"	: "",
	"utilService" 	: ""
}

exports.completeApiUrls = {
	"getUserDetails"		: (dynamicUrls.contentMgmt || staticUrls.contentMgmt) +  apiRoutes.getUserDetails,
	"adminUserDetails"		: (dynamicUrls.contentMgmt || staticUrls.contentMgmt) +  apiRoutes.adminUserDetails,
	"sendHtmlMail" 	    	: (dynamicUrls.utilService || staticUrls.utilService) +  apiRoutes.sendHtmlMail
}