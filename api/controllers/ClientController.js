/**
 * ClientController
 *
 * @description :: Server-side logic for managing Clients
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createClient : function(req, res){

		Client.create({
			client : req.param('clientName')
		}).exec(function (err, client){
  			if (err) { 
  				return res.serverError(err); 
  			}

  			sails.log('client\'s id is:', client.id);
  			return res.json({
  				client: client.client,
  				secretKey: client.secretKey
  			});
		});
	}	
};

