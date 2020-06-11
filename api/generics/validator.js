'use strict';

 var Joi= require('joi');

 var _ = require('underscore');

 var errorCodes = require('./errorCodes');

const schema = {
	productType	    :	Joi.string().required().trim().label(errorCodes.errorMessages.productTypeRequired),
	categoryId	    :	Joi.string().required().trim().label(errorCodes.errorMessages.categoryIdRequired),
    price	        : 	Joi.number().label(errorCodes.errorMessages.priceError),
    priceType       :   Joi.string().label(errorCodes.errorMessages.priceTypeError),
    details         :   Joi.string().label(errorCodes.errorMessages.detailsTypeError),
    specification   :   Joi.string().label(errorCodes.errorMessages.specificationTypeError),
    createdBy       :   Joi.string().label(errorCodes.errorMessages.createdByTypeError)
}

exports.validateProductKeys = function(request){
	return new Promise(function(resolve, reject){
        Joi.validate(request, schema, function(err, value){
            if(err && Array.isArray(err.details) && err.details.length) {
				if(err.details[0].type === "object.allowUnknown"){
					return reject(err.details[0].message.replace(/"/g,""));
				}else{
					return reject(err.details[0].message.split('"')[1]);
				} 
            } else {
                return resolve();
            }
		});
	});
}

const updateSchema = {
	productType	    :	Joi.string().label(errorCodes.errorMessages.productTypeError),
	categoryId	    :	Joi.string().label(errorCodes.errorMessages.categoryIdTypeError),
    price	        : 	Joi.number().label(errorCodes.errorMessages.priceError),
    priceType       :   Joi.string().label(errorCodes.errorMessages.priceTypeError),
    details         :   Joi.string().label(errorCodes.errorMessages.detailsTypeError),
    specification   :   Joi.string().label(errorCodes.errorMessages.specificationTypeError),
    updatedBy       :   Joi.string().label(errorCodes.errorMessages.updatedByTypeError)
}

exports.validateUpdateKeys = function(request){
	return new Promise(function(resolve, reject){
        Joi.validate(request, updateSchema, function(err, value){
            if(err && Array.isArray(err.details) && err.details.length) {
				if(err.details[0].type === "object.allowUnknown"){
					return reject(err.details[0].message.replace(/"/g,""));
				}else{
					return reject(err.details[0].message.split('"')[1]);
				} 
            } else {
                return resolve();
            }
		});
	});
}
