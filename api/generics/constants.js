'use strict';

let constants = {
	'success'		: 200,
    'failure'		: 201,
    'productCode'   : 'PA_',
    'requestCode'   : 'RE_',
    'userRole'  : {
        'superAdmin'    : 'superadmin',
        'staff'         : 'staff'
    },
    'userStatus'  : {
        'active'    : 'active',
        'pending'   : 'pending',
        'obselete'  : 'obselete'
    },
    'approvalStatus'  : {
        'pendingApproval'   : 'pending approval',
        'approved'          : 'approved',
        'rejected'          : 'rejected',
        'moved'             : 'moved'
    },
    'actionType' : {
        'created' : 'CREATED',
        'updated' : 'UPDATED',
        'deleted' : 'DELETED'
    },
    'requestTypes' : {
        'post'      : 'POST',
        'put'       : 'PUT',
        'delete'    : 'DELETE'
    },
    'messages' : {
        'success'               : 'success',
        'createSuccess'         : 'create success',
        'updateSuccess'         : 'update success',
        'deleteSuccess'         : 'delete success'
    },
    'htmlTemplates': {
        'createTemplate' : '<html><head></head><body><p> Hi,</p><p> An user <b>{{userName}}</b> has raised a request to add product <br/><br/>Kindly Approve/Reject using the below links.</p><a href={{approvalLink}}>Click here to Approve </a><br/><a href={{rejectionLink}}>Click here to Reject </a></body></html>', 
        'updateTemplate' : '<html><head></head><body><p> Hi,</p><p> An user <b>{{userName}}</b> has raised a request to update product details <br/><br/>Kindly Approve/Reject using the below links.</p><a href={{approvalLink}}>Click here to Approve </a><br/><a href={{rejectionLink}}>Click here to Reject </a></body></html>',
        'deleteTemplate' : '<html><head></head><body><p> Hi,</p><p> An user <b>{{userName}}</b> has raised a request to delete product <br/><br/>Kindly Approve/Reject using the below links.</p><a href={{approvalLink}}>Click here to Approve </a><br/><br/><a href={{rejectionLink}}>Click here to Reject </a></body></html>'
    }
};

module.exports =  constants;