'use strict';

var Promise = require('bluebird');

const responses = require('../generics/responses.js');

const constants = require('../generics/constants.js');

const productDal = require('../dal/productDal.js');

let validator = require('../generics/validator');

const errorCodes = require('../generics/errorCodes');

var config = require('../../config/devConfig.json');

let remoteApis = require('../remoteApis/remote');

var path = require('path');

exports.addProduct = function(req, res){

	console.log("inside addProduct:"+JSON.stringify(req.body));
	let request = {};
		request = req.body;

	Promise.coroutine(function *(){

		if(!request.createdBy){
			return responses.sendError(res, 'createdBy is mandatory', constants.failure);
		}

		let userDetails = yield remoteApis.getUserDetails(request);

		yield validator.validateProductKeys(request);

		//yield validateCategoryItem(request.categoryId);

		if(userDetails.length > 0){
			if(userDetails[0].status === constants.userStatus.active){
				if(userDetails[0].userRole && userDetails[0].userRole === constants.userRole.superAdmin){
					// create directly in products collection
					console.log("inside superAdmin flow");
					let addProduct = yield productDal.insertProduct(request);

					console.log("addProduct", addProduct);
					
					return responses.sendResponse(res, constants.messages.createSuccess, constants.success, {});
		
				}else{
					console.log("inside normal user flow");
					// create in batch requests
					let adminDetails = yield remoteApis.getSuperAdminDetails();
					console.log("adminDetails", adminDetails);
					let addProductInBatch = yield productDal.createProductInBatchRequest(request, constants.requestTypes.post);
					console.log("addProductInBatch", addProductInBatch);
					//send email to superAdmin
					remoteApis.sendHtmlMail(formEmailRequest(adminDetails[0], userDetails[0], addProductInBatch));
					return responses.sendResponse(res, constants.messages.createSuccess, constants.success, {});	
				}
			}
			return responses.sendError(res, 'user is not active to add product', constants.failure);
		}
		return responses.sendError(res, 'user is not valid to add product', constants.failure);
	})().catch(function (error) {
		 console.log('error',error);
		return responses.sendError(res, error, constants.failure);
    });
}

let formEmailRequest = function(adminObj,userObj, data){
	return {
		"from" : adminObj.officialEmail,
		"to" : userObj.officialEmail,
		"subject": "product creation request",
		"template":  constants.htmlTemplates.createTemplate,
		"htmlContent": {
			"userName" : userObj.firstName + " " + userObj.lastName,
			"approvalLink" : config['links'][config.env].approvalLink + data.code + "&requestId=" + data.requestId,
			"rejectionLink" : config['links'][config.env].rejectionLink + data.code + "&requestId=" + data.requestId
		}
	}
}

exports.approveRequest = function(req, res){

    Promise.coroutine(function*() {
		
		let request = req.query;
		
            console.log("request for approveRequest is",request)
            
            if(!request.code) {
                return res.sendFile(path.join(__dirname + '/approvedErrorMsg.html')); 
			}
			
            if(!request.requestId) {
                return res.sendFile(path.join(__dirname + '/approvedErrorMsg.html'));
            }

            var batchDetails = yield productDal.getRequestById(request);

			console.log("batchDetails is ::::", batchDetails);
			
			if(batchDetails.length > 0){
				if(!batchDetails[0].codeValidity) {
					return res.sendFile(path.join(__dirname + '/alreadyApprovedRejectedMsg.html'))
				}
	
				let updateKeys = {};
				   if(request.code == batchDetails[0].code) {
						updateKeys.codeValidity = false;
						updateKeys.approvedDate = new Date();
						updateKeys.status = constants.approvalStatus.approved;
				   }
	
			   request.updateKeys = updateKeys;
	
			   yield productDal.updateBatchRequest(request);
	
			   return res.sendFile(path.join(__dirname + '/approvedSuccessMsg.html'))
			}else{
				return res.sendFile(path.join(__dirname + '/alreadyApprovedRejectedMsg.html'))
			}
    })().catch(function (error) {
		console.log("error in catch--->>>>:",error);
	    return responses.sendError(res, error, constants.failure);
	});
}

exports.rejectRequest = function(req, res){

	console.log("inside rejectRequest");

    Promise.coroutine(function*() {
		
		let request = req.query;
		
            console.log("request for rejectRequest is",request)
            
            if(!request.code) {
                return res.sendFile(path.join(__dirname + '/rejectErrorMsg.html')); 
			}
			
            if(!request.requestId) {
                return res.sendFile(path.join(__dirname + '/rejectErrorMsg.html'));
            }

            var batchDetails = yield productDal.getRequestById(request);

			console.log("batchDetails is ::::", batchDetails);
			
			if(batchDetails.length > 0){
				if(!batchDetails[0].codeValidity) {
					return res.sendFile(path.join(__dirname + '/alreadyApprovedRejectedMsg.html'))
				}
	
				let updateKeys = {};
				   if(request.code == batchDetails[0].code) {
						updateKeys.codeValidity = false;
						updateKeys.rejectedDate = new Date();
						updateKeys.status = constants.approvalStatus.rejected;
				   }
	
			   request.updateKeys = updateKeys;
	
			   yield productDal.updateBatchRequest(request);
	
			   return res.sendFile(path.join(__dirname + '/rejectSuccessMsg.html'))
			}else{
				return res.sendFile(path.join(__dirname + '/alreadyApprovedRejectedMsg.html'))
			}
    })().catch(function (error) {
		console.log("error in catch--->>>>:",error);
	    return responses.sendError(res, error, constants.failure);
	});
}

let formEmailUpdateRequest = function(adminObj,userObj, data){
	return {
		"from" : adminObj.officialEmail,
		"to" : userObj.officialEmail,
		"subject": "product updation request",
		"template":  constants.htmlTemplates.updateTemplate,
		"htmlContent": {
			"userName" : userObj.firstName + " " + userObj.lastName,
			"approvalLink" : config['links'][config.env].approvalLink + data.code + "&requestId=" + data.requestId,
			"rejectionLink" : config['links'][config.env].rejectionLink + data.code + "&requestId=" + data.requestId
		}
	}
}

exports.updateProduct = function(req, res){

	console.log("inside updateProduct:"+JSON.stringify(req.body));
	let request = {};
		request = req.body;

	Promise.coroutine(function *(){

		if(!request.updatedBy){
			return responses.sendError(res, 'updatedBy is mandatory', constants.failure);
		}

		if(!request.productId){
			return responses.sendError(res, 'productId is mandatory', constants.failure);
		}

		if(!request.updateKeys || !Object.keys(request.updateKeys).length){
			return responsses.sendError(res, 'updateKeys cannot be empty', constants.failure);
		}
		
		yield validator.validateUpdateKeys(request.updateKeys);

		let userDetails = yield remoteApis.getUserDetails({'createdBy' : request.updatedBy});

		if(userDetails.length > 0){
			if(userDetails[0].status === constants.userStatus.active){
				if(userDetails[0].userRole && userDetails[0].userRole === constants.userRole.superAdmin){
					// update directly in products collection
					console.log("inside superAdmin flow");
					let updateProduct = yield productDal.updateProduct(request);

					console.log("updateProduct", updateProduct);
					
					return responses.sendResponse(res, constants.messages.updateSuccess, constants.success, {});
		
				}else{
					console.log("inside normal user flow");
					// create in batch requests
					let adminDetails = yield remoteApis.getSuperAdminDetails();
					console.log("adminDetails", adminDetails);
					let addProductInBatch = yield productDal.createProductInBatchRequest(request, constants.requestTypes.put);
					console.log("addProductInBatch", addProductInBatch);
					//send email to superAdmin
					remoteApis.sendHtmlMail(formEmailUpdateRequest(adminDetails[0], userDetails[0], addProductInBatch));
					return responses.sendResponse(res, constants.messages.createSuccess, constants.success, {});	
				}
			}
			return responses.sendError(res, 'user is not active to update product', constants.failure);
		}
		return responses.sendError(res, 'user is not valid to update product', constants.failure);
	})().catch(function (error) {
		 console.log('error',error);
		return responses.sendError(res, error, constants.failure);
    });
}

let formEmailDeleteRequest = function(adminObj,userObj, data){
	return {
		"from" : adminObj.officialEmail,
		"to" : userObj.officialEmail,
		"subject": "product deletion request",
		"template":  constants.htmlTemplates.deleteTemplate,
		"htmlContent": {
			"userName" : userObj.firstName + " " + userObj.lastName,
			"approvalLink" : config['links'][config.env].approvalLink + data.code + "&requestId=" + data.requestId,
			"rejectionLink" : config['links'][config.env].rejectionLink + data.code + "&requestId=" + data.requestId
		}
	}
}

exports.deleteProduct = function(req, res){

	console.log("inside deleteProduct:"+JSON.stringify(req.body));
	let request = {};
		request = req.body;

	Promise.coroutine(function *(){

		if(!request.updatedBy){
			return responses.sendError(res, 'updatedBy is mandatory', constants.failure);
		}

		if(!request.productId){
			return responses.sendError(res, 'productId is mandatory', constants.failure);
		}

		let userDetails = yield remoteApis.getUserDetails({'createdBy' : request.updatedBy});

		if(userDetails.length > 0){
			if(userDetails[0].status === constants.userStatus.active){
				if(userDetails[0].userRole && userDetails[0].userRole === constants.userRole.superAdmin){
					// update directly in products collection
					console.log("inside superAdmin flow");
					let deleteProduct = yield productDal.deleteProduct(request);

					console.log("deleteProduct", deleteProduct);
					
					return responses.sendResponse(res, constants.messages.deleteSuccess, constants.success, {});
		
				}else{
					console.log("inside normal user flow");
					// create in batch requests
					let adminDetails = yield remoteApis.getSuperAdminDetails();
					console.log("adminDetails", adminDetails);
					let addProductInBatch = yield productDal.createProductInBatchRequest(request, constants.requestTypes.delete);
					console.log("addProductInBatch", addProductInBatch);
					//send email to superAdmin
					remoteApis.sendHtmlMail(formEmailDeleteRequest(adminDetails[0], userDetails[0], addProductInBatch));
					return responses.sendResponse(res, constants.messages.deleteSuccess, constants.success, {});	
				}
			}
			return responses.sendError(res, 'user is not active to delete product', constants.failure);
		}
		return responses.sendError(res, 'user is not valid to delete product', constants.failure);
	})().catch(function (error) {
		 console.log('error',error);
		return responses.sendError(res, error, constants.failure);
    });
}