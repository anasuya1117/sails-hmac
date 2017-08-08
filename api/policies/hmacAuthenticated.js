var crypto = require('crypto');

function signedString(request, privateKey) {
  var jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ];

  var type = request.headers['content-type'] || '';
  type = type.split(';')[0];

  // support parsing of json; otherwise, new string from request.body
  var body = (jsonTypes.indexOf(type) > -1) ? JSON.stringify(request.body) : '';

  const stringToSign = new Buffer(
        request.method + ',' +
        (request.body ? crypto.createHash('md5').update(body, 'utf8').digest('hex') : '') + ',' +
        type + ',' + request.headers.date,
        'utf-8'
      );

  return crypto.createHmac('sha1', privateKey)
    .update(stringToSign.toString()).digest('hex');
};

module.exports = function(req, res, next) {
  var authString = req.headers.authorization;
  if (!authString) 
  	return res.badRequest('Authorization header not present');

  var matches = authString.match(/^([^ ]+) ([^:]+):((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/);

  if (!matches) 
    return res.status(401).json({error:"Bad authorization header"});

  var publicKey = matches[2];
  var signature = new Buffer(matches[3] || '', 'base64').toString('hex');
  // retrieve authorized client
  Client.findOne({client:publicKey}).exec(function (err, client){
        if(err || !client){
          return res.status(403).json({error:"Invalid client"});
        }
    var generatedSign = signedString(req, client.secretKey);

    if (generatedSign !== signature) {
      return res.status(401).json({error:"Bad signature"});
    } 
    return next();
	});
};