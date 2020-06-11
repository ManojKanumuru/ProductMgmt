'use strict';

var express = require('express');

let apiRoutes = express.Router();

const jwt = require('./../generics/jwt');

const productController = require('./../controller/productController');

function isAuthenticated(req,res,next){

	// middleware to validate jwt token
	
	function onVerify(err, data) {
		if(err){
			console.log(err);
	        res.status(401).send(err);
	    }else{
			console.log(data);	
	        next();
	    }
	}
	jwt.verifyToken(req.headers.authorization, onVerify);
}

module.exports = function(app){

	/*product mgmt apis*/

	apiRoutes.post('/product/addProduct', productController.addProduct);

	apiRoutes.get('/product/approve', productController.approveRequest);

	apiRoutes.get('/product/reject', productController.rejectRequest);

	apiRoutes.put('/product/updateProductDetails', productController.updateProduct);

	apiRoutes.delete('/product/deleteProduct', productController.deleteProduct);

	app.use('/api', apiRoutes);
}