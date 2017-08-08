/**
 * Client.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var randomstring = require("randomstring");

module.exports = {

  attributes: {
  	client: {
  		type: 'string',
  		unique: true,
  		required: true
  	},
  	secretKey: {
  		type: 'string'
  	}
  },
  beforeCreate : function (values, next) {
    values.secretKey = randomstring.generate({
		length: 12,
		charset: 'hex'
	});
    next();
   }
};
