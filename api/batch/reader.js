'use strict';

var baseQuery = require('./../../libs/baseQuery');

let constants = require('./../generics/constants');

exports.readApprovedRequests = function(){

    return new Promise(function(resolve, reject){

        let queryObj = {};
            queryObj.dbName = 'ContentManagement';
            queryObj.collectionName = 'batchRequests';
            queryObj.condition = {
                status : constants.approvalStatus.approved
            };
 
        baseQuery.readData(queryObj).then(function(data){
            console.log("data",data);
            return resolve(data);
        }).catch(function(error){
            return reject(error);
        });
    })
}