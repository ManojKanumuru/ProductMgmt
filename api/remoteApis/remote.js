var   request = require("request");
var   Promise = require("bluebird");
var config 	  = require('config');
var remoteConfig =require("./remoteConfig");
var constants = require('./../generics/constants');

exports.getUserDetails = function(params){

	console.log("inside getUserDetails remote call - ",params);

	return new Promise(function(resolve, reject) {
		request({
			uri 	: remoteConfig.completeApiUrls.getUserDetails + "?userId=" + params.createdBy,
			method	: "GET",
			timeout : 15000
	  }, function(error, response, body) {
		  if(error) {
			return reject(error);
		  } 
		  try {
			console.log("body is :::", body);
			body = JSON.parse(body);
			if(body.status == 200) {
				return resolve(body.data || []);
			} else {
				return resolve([]);
			}
		} catch(e) {
			return reject(e);
		}
	  });
	})
}

exports.getSuperAdminDetails = function(){

	console.log("inside getSuperAdminDetails remote call - ");

	return new Promise(function(resolve, reject) {
		request({
			uri 	:  remoteConfig.completeApiUrls.adminUserDetails + "?userRole=" + constants.userRole.superAdmin,
			method	: "GET",
			timeout : 15000
	  }, function(error, response, body) {
		  if(error) {
			return reject(error);
		  } 
		  try {
			console.log("body is :::", body);
			body = JSON.parse(body);
			if(body.status == 200) {
				return resolve(body.data || []);
			} else {
				return resolve([]);
			}
		} catch(e) {
			return reject(e);
		}
	  });
	})
}

exports.sendHtmlMail = function(payload) {
	console.log("inside sendBulkMail", payload);
	return new Promise(function(resolve, reject) {

		request({
			uri 	: remoteConfig.completeApiUrls.sendHtmlMail,
			method	: "POST",
			timeout : 15000,
			body   	: payload,
			json    : true
	  }, function(error, response, body) {

		  console.log("body is - ",body);
		  if(error) {
			  console.log("Error in  sending mails", error);
		  } else {
			  console.log("send mails success");
			  if(body.data) {
                console.log("body.data", body.data);
			  } else {
				console.log("not sent");
			  }
		  }
	  });
	})
}