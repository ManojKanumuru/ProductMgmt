`use strict`;

let async = require('async');

const constants = require('./../generics/constants.js');

var productDal = require('./../dal/productDal.js');

var baseQuery = require('./../../libs/baseQuery');

exports.processRequests = function(data){

    return new Promise(function(resolve, reject){
        async.forEachSeries(data, (obj,callback) => {
            if(obj.requestType === constants.requestTypes.post){
                processPostRequests(obj).then(data => {
                    console.log("insert success");
                    callback();
                }).catch(err => {
                    console.log("error while inserting", err);
                    callback();
                })
            }else if(obj.requestType === constants.requestTypes.put){
                processUpdateRequests(obj).then(data => {
                    console.log("update success");
                    callback();
                }).catch(err => {
                    console.log("error while updating", err);
                    callback();
                })
            }else if(obj.requestType === constants.requestTypes.delete){
                processDeleteRequests(obj).then(data => {
                    console.log("delete success");
                    callback();
                }).catch(err => {
                    console.log("error while deleting", err);
                    callback();
                })
            }else{
                console.log("invalid requestType");
                callback();
            }
        }, function(){
            return resolve();
        })
    })
}

let processPostRequests = function(req){

    console.log("inside processPostRequests");

    return new Promise(function(resolve, reject){
        productDal.insertProduct(req.requestObj).then(data => {
            updateBatchStatus(req).then(updatedData => {
                return resolve(updatedData);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    })
}

let processUpdateRequests = function(req){
    return new Promise(function(resolve, reject){
        productDal.updateProduct(req.requestObj).then(data => {
            updateBatchStatus(req).then(updatedData => {
                return resolve(updatedData);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    })
}

let processDeleteRequests = function(req){
    
    return new Promise(function(resolve, reject){
        productDal.deleteProduct(req.requestObj).then(data => {
            updateBatchStatus(req).then(updatedData => {
                return resolve(updatedData);
            }).catch(err => {
                return reject(err);
            });
        }).catch(err => {
            return reject(err);
        });
    })
}

let updateBatchStatus = function(obj){

    console.log("inside updateBatchStatus");

    return new Promise(function(resolve, reject){

        let updateObj = {};
            updateObj.condition = {requestId : obj.requestId};
            updateObj.update = {
                $set : {
                    'status' : constants.approvalStatus.moved
                }
            };
            updateObj.ops = {};
            updateObj.dbName = 'ContentManagement';
            updateObj.collectionName = 'batchRequests';
        baseQuery.updateData(updateObj).then(updatedData => {
            return resolve(updatedData);
        }).catch(err => {
            return reject(err);
        })
    })
}