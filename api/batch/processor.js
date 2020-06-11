'use strict';

var Promise = require('bluebird');

const constants = require('./../generics/constants.js');

var reader = require('./reader');

var writer = require('./writer');

exports.processBatchRequests = function(){

    console.log("inside processBatchRequests");

    Promise.coroutine(function *(){
        
        let approvedRequests = yield reader.readApprovedRequests();

        console.log('approvedRequests', approvedRequests.length);

        if(approvedRequests.length > 0){
            let processRequests = yield writer.processRequests(approvedRequests);
            console.log("processing complete");
        }else{
            console.log("no records to process");
        }
    })().catch(function (err) {
        console.log("err",err);
    });
}