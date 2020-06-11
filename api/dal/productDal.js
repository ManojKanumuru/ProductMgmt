'use strict';

var objectId = require('mongodb').ObjectID;

var constants = require('./../generics/constants');

var baseQuery = require('./../../libs/baseQuery');

var async = require('async');

const { v4: uuidv4 } = require('uuid');
const { rejectRequest } = require('../controller/productController');

let formProductObj = function(params){

    console.log("inside formProductObj:");

	return {
		"productType" 	: params.productType || null,
		"categoryId"	: params.categoryId || null,
		"price"			: params.price || 0,
		"priceType"		: params.priceType || null,
		"details"		: params.details || null,
		"specification"	: params.specification || null,
		"createdDate"	: new Date(),
		"createdBy"		: params.createdBy || null
	}
}

let insertInAduit = function(queryObj){
    console.log("insertInAduit", queryObj);
    return new Promise(function(resolve, reject) {
        queryObj.collectionName = 'productsAudit';
        baseQuery.insertData(queryObj).then(function(insertedData) {
            console.log("insert audit success");
        }).catch(function(err) {
            console.log("err in audit insert", err);
        });
    })
}

exports.insertProduct = function(params){

    console.log("inside insertProduct dal:",params);
    
    return new Promise(function(resolve, reject) {
        
        let queryObj = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'products';
            queryObj.requestBody = formProductObj(params);

            baseQuery.insertData(queryObj).then(function(insertedData) {
                let productId = constants.productCode + insertedData.ops[0]._id.toString();
                let updateQueryObj = {};
                    updateQueryObj.condition = {_id : new objectId(insertedData.ops[0]._id)};
                    updateQueryObj.update = {
                        $set : {
                            'productId' : productId
                        }
                    };
                    updateQueryObj.ops = {};
                    updateQueryObj.dbName = 'ContentManagement';
                    updateQueryObj.collectionName = 'products';
                baseQuery.updateData(updateQueryObj).then(function(updatedData) {
                    queryObj.requestBody.productId = productId;
                    queryObj.requestBody.actionType = constants.actionType.created;
                    insertInAduit(queryObj);
                    return resolve(updatedData);
                }).catch(function(error) {
                    return reject(error);
                })

            }).catch(function(err) {
                return reject(err);
            });
    });
}

let formBatchObj = function(request, requestType){

    return {
		"requestType"	: requestType,
		"requestObj"	: request,
		"requestDate"	: new Date(),
		"status"		: constants.approvalStatus.pendingApproval,
		"mailSentOn"	: new Date(),
		"code"			: uuidv4(),
		"codeValidity"	: true
    }
}

exports.createProductInBatchRequest = function(params, requestType){

    return new Promise(function(resolve, reject) {
        
        let queryObj = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'batchRequests';
            queryObj.requestBody = formBatchObj(params, requestType);

            baseQuery.insertData(queryObj).then(function(insertedData) {
                let requestId = constants.requestCode + insertedData.ops[0]._id.toString();
                let updateQueryObj = {};
                    updateQueryObj.condition = {_id : new objectId(insertedData.ops[0]._id)};
                    updateQueryObj.update = {
                        $set : {
                            'requestId' : requestId
                        }
                    };
                    updateQueryObj.ops = {};
                    updateQueryObj.dbName = 'ContentManagement';
                    updateQueryObj.collectionName = 'batchRequests';
                baseQuery.updateData(updateQueryObj).then(function(updatedData) {
                    return resolve({requestId: requestId, code: queryObj.requestBody.code});
                }).catch(function(error) {
                    return reject(error);
                })
            }).catch(function(err) {
                return reject(err);
            });
    });
}

exports.getRequestById = function(params){
    console.log("inside dal:",params);
        
    return new Promise(function(resolve, reject) {
        
        let queryObj = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'batchRequests';
            queryObj.condition = {
                requestId : params.requestId
            };
 
        baseQuery.readData(queryObj).then(function(data){
            console.log("data",data);
            return resolve(data);
        }).catch(function(error){
            return reject(error);
        });
    })
}

exports.updateBatchRequest = function(params){

    return new Promise(function(resolve, reject) {

        let queryObj = {};
            queryObj.condition = {
                requestId : params.requestId
            };
            queryObj.update = {
                $set : params.updateKeys
            };
            queryObj.ops = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'batchRequests';
        baseQuery.updateData(queryObj).then(function(updatedData) {
            return resolve(updatedData);
        }).catch(function(error) {
            return reject(error);
        })
    })
}

exports.updateProduct = function(params){

    return new Promise(function(resolve, reject){
        let queryObj = {};
        queryObj.dbName = 'ContentManagement';
        queryObj.collectionName = 'products';
        queryObj.condition = {
            productId : params.productId
        };

        baseQuery.readData(queryObj).then(function(data){
            if(data.length > 0){
                let updateObj = {};
                updateObj.condition = {
                    productId : params.productId
                };
                updateObj.update = {
                    $set : params.updateKeys
                };
                updateObj.ops = {};
                updateObj.dbName = 'ContentManagement';
                updateObj.collectionName = 'products';
                baseQuery.updateData(updateObj).then(function(updatedData){
                    console.log("data",updatedData);
                    delete data[0]._id;
                    queryObj.requestBody = Object.assign(data[0], params.updateKeys);
                    queryObj.requestBody.createdBy = params.updatedBy;
                    queryObj.requestBody.actionType = constants.actionType.updated;
                    insertInAduit(queryObj);
                    return resolve(updatedData);
                }).catch(function(err){
                    return rejectRequest(err);
                })
            }else{
                return resolve('no record to update');
            }
        }).catch(function(error){
            return reject(error);
        });
    })
}

exports.deleteProduct = function(params){

    return new Promise(function(resolve, reject){
        let queryObj = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'products';
            queryObj.condition = {productId : params.productId};

        baseQuery.readData(queryObj).then(function(data){
            if(data.length > 0){
                baseQuery.removeData(queryObj).then(function(deletedData){
                    delete data[0]._id;
                    queryObj.requestBody.createdBy = params.updatedBy;
                    queryObj.requestBody.actionType = constants.actionType.deleted;
                    insertInAduit(queryObj);
                    return resolve(deletedData);
                }).catch(function(err){
                    return rejectRequest(err);
                })
            }else{
                return resolve('no record found to delete');
            }
        }).catch(function(error){
            return reject(error);
        });
    })
}