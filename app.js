/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), user = require('./routes/user'), http = require('http'), path = require('path'), fs = require('fs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var app = express();

var db;

var cloudant;

var fileToUpload;

var dbCredentials = {
	dbName : 'my_sample_db'
};

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

// development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

function initDBConnection() {
	
	if(process.env.VCAP_SERVICES) {
		var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
		// Pattern match to find the first instance of a Cloudant service in
		// VCAP_SERVICES. If you know your service key, you can access the
		// service credentials directly by using the vcapServices object.
		for(var vcapService in vcapServices){
			if(vcapService.match(/cloudant/i)){
//				dbCredentials.host = vcapServices[vcapService][0].credentials.host;
//				dbCredentials.port = vcapServices[vcapService][0].credentials.port;
//				dbCredentials.user = vcapServices[vcapService][0].credentials.username;
//				dbCredentials.password = vcapServices[vcapService][0].credentials.password;
//				dbCredentials.url = vcapServices[vcapService][0].credentials.url;
			dbCredentials.host = "a68fdc0a-241d-4dba-813a-597b5149884d-bluemix.cloudant.com";
		dbCredentials.port = 443;
		dbCredentials.user = "a68fdc0a-241d-4dba-813a-597b5149884d-bluemix";
		dbCredentials.password = "691ad81646af51027d9ba7bec1e082d8fb05f5f0c26e18ef5d169489ea43249b";
		dbCredentials.url = "https://a68fdc0a-241d-4dba-813a-597b5149884d-bluemix:691ad81646af51027d9ba7bec1e082d8fb05f5f0c26e18ef5d169489ea43249b@a68fdc0a-241d-4dba-813a-597b5149884d-bluemix.cloudant.com";
			
				cloudant = require('cloudant')(dbCredentials.url);
				
				// check if DB exists if not create
				cloudant.db.create(dbCredentials.dbName, function (err, res) {
					if (err) { console.log('could not create db ', err); }
				});
				
				db = cloudant.use(dbCredentials.dbName);
				break;
			}
		}
		if(db==null){
			console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
		}
	} else{
		console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
		// For running this app locally you can get your Cloudant credentials 
		// from Bluemix (VCAP_SERVICES in "cf env" output or the Environment 
		// Variables section for an app in the Bluemix console dashboard).
		// Alternately you could point to a local database here instead of a 
		// Bluemix service.
		//dbCredentials.host = "REPLACE ME";
		//dbCredentials.port = REPLACE ME;
		//dbCredentials.user = "REPLACE ME";
		//dbCredentials.password = "REPLACE ME";
		//dbCredentials.url = "REPLACE ME";
		
		//cloudant = require('cloudant')(dbCredentials.url);
		
		// check if DB exists if not create
        	//cloudant.db.create(dbCredentials.dbName, function (err, res) {
        	//    if (err) { console.log('could not create db ', err); }
        	//});
            
        	//db = cloudant.use(dbCredentials.dbName);
	}
}

initDBConnection();

//app.get('/', routes.index);


//My app code starts here -- Lucifer
app.use(session({secret:'somesecrettokenhere',  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 46800000 }
  }));
  
app.use('/myapp/*',function(req,res,next){
	console.log("session : " + JSON.stringify(req.session));

	if (!req.session){
		return res.sendFile(__dirname+'/login.html');
	} 
		console.log("session user id : " + req.session.user);
	if (!req.session.user){
		return res.sendFile(__dirname+'/login.html');
	}
		console.log("session after this user check");
	if (req.session.user===""){
		return res.sendFile(__dirname+'/login.html');
	}
		console.log("session after this user null ncheck");
	next();
});
app.get('/',function(req,res){
	if (!req.session || !req.session.user || req.session.user===""){user='Guest';} else {user=req.session.user;}
	res.render('pages/index',{userId:user},function(err,html){
		if (!err){	
			return res.send(html);
		}
		console.log(err);
	});
});

app.get('/login',function(req,res){
	res.sendFile(__dirname+'/login.html');
});

app.post('/loginValidate',function(req,res){
	var u_id=req.body.Username;
	var pass=req.body.Password;
	console.log(u_id+" " + pass);
	db.get(u_id,function(err,body2){
		if (err) {
			console.log("User ID not found");
			req.session.user="";
			res.write(JSON.stringify("WU"));
			return res.end();
		}
		console.log("Found User : " +JSON.stringify(body2));
		if ( pass == body2.password) {
			console.log("Password matched" + body2._id+ " "+u_id);
			req.session.user=u_id;
			console.log("user id overwritten:" + req.session.user);
			return res.send(JSON.stringify('SUCCESS')).end();
		} else {
			console.log("Wrong  Password");
			req.session.user="";
			res.send(JSON.stringify("WP"));
			return res.end();
		}
	});
});
app.get('/myapp/get_docs',function(req,res){
	res.render('pages/getRoster',{userId:req.session.user});
});
app.get('/myapp/insert_rows.html',function(req,res){
	res.sendFile(__dirname+'/insert_rows.html');
});
app.get('/myapp/favorites',function(req,res){
	db.get('',function(err,data){
		if (err) {
			res.send("500: Document not found");
			return res.end();
		}
		console.log("Document found, sending data");
		console.log(JSON.stringify(data));
		res.send(JSON.stringify(data));
		res.end();
		
	});
});
app.get('/myapp/db_list' , function(req,res){
	db.list(function(err,body){
		if (!err) {
			console.log(body);
			res.write(JSON.stringify(body));
			res.end();
		} else {
			console.log('Error getting database list' + err);
		}
});
});
//app.post(
app.get('/logout',function(req,res){
	req.session.user="";
	res.send("<p>Successfully logged out. Click<a href='/'> <strong>here</strong> </a> to go back to homepage</p>");
	res.end();
});
app.get('/myapp/repos',function(req,res){
	res.render('pages/repos',{userId:req.session.user});
});
app.get('/myapp/get_doc3', function(req,res){
	res.sendFile(__dirname+'/get_doc3.html');
});
app.get('/myapp/teamlist',function(req,res){
	db.get("Team_list",function(err,data){
		if (err){
			console.log('unable to read document Team_list');
			return res.status(404).end();
			}
			console.log("Sending team list" + data);
			res.send(data.teams);
			res.end();
	});
});
app.get('/myapp/teamMem',function(req,res){
	console.log("Team Name sent is " +req.query.id);
	db.get(req.query.id,function(err,data){
	if (err){
		console.log("error reading team members file for" + req.query.id);
	return res.sendStatus(404).end();
	}
		console.log("Sending team members" + JSON.stringify(data));
		res.send(data.members);
	res.end();
});
});

app.get('/myapp/getRoster', function(req,res){
	console.log("Got request for team"+req.query.id + "for month" +req.query.id);
	var doc_id=req.query.id;
	db.get(doc_id,function(err,data){
		if (err){
			console.log("Error finding/reading the doc" + doc_id);
			return res.send(JSON.stringify("FILE NOT FOUND")).end();
		}
		console.log("Found file, sending data"+ JSON.stringify(data.data));
		res.send(JSON.stringify(data.data));
		res.end();
	});
});
app.get('/myapp/getdbdoc',function(req,res){
	console.log("Got request for database support document");
	var doc_id='AppDBA_SupportApplicationsNDatabases';
	db.get(doc_id,function(err,data){
		if (err){
			console.log("Error finding/reading the doc"+doc_id);
			return res.send(JSON.stringify("FILE NOT FOUND")).end();
		}
		console.log("Found Document, sending data"+JSON.stringify(data.data));
		res.send(JSON.stringify(data.data));
		res.end();
	});
});
app.get('/myapp/teams',function(req,res){
	res.render('pages/teams', {userId:req.session.user});
});

app.get('/myapp/credits',function(req,res){
	res.render('pages/credits',{userId:req.session.user});
});
app.get('/myapp/dbasupp',function(req,res){
	res.render('pages/dbasupp',{userId:req.session.user});
});
app.get('/myapp/claims',function(req,res){
	res.render('pages/claims',{userId:req.session.user});
});
app.get('/myapp/downloadClaimsSheet',function(req,res){
	console.log(req.query);
	db.get(req.query.id,function(err,data){
		if (!err){
			console.log(data.data);
			var jsonvar2=data.data;
			res.xls('claimSheet.xlsx',jsonvar2);
		}
	});
});
app.get('/myapp/repoAttach',function(req,res){
	var rowList=[];
	db.find({"selector": {"_attachments": {"$gt": 0}},"fields":["_id","_attachments"],"sort":[{"_id": "asc"}]},function(err,body){
		if (!err) {
			console.log(body);
			var leng=body.docs.length;
			if (leng === 0){
				console.log('No Files found');
				return res.send(JSON.stringify('NO FILES')).end();
			}
			//console.log(body.rows);
			var counter=0;
			for ( var i=0;i<leng; i++){
					counter++;
					console.log('idd of doc is: '+body.docs[i]['_id']);
					var docId=body.docs[i]['_id'];
					console.log('docId is:'+docId)
					rowList.push(docId);
			}
			return res.send(JSON.stringify(rowList)).end();
		}
		console.log(err);
		return res.send(JSON.stringify("DBERR")).end();
		});
});
app.get('/myapp/repoGetAttach', function(request, response) {
    var doc = request.query.id;
    console.log(doc);
    db.attachment.get(doc,doc, function(err, body) {
        if (err) {
        	console.log("Encountered error"+err);
            response.status(500);
            response.setHeader('Content-Type', 'text/plain');
            response.write('Error: ' + err);
            response.end();
            return;
        }
		console.log('got the doc'+doc + "and boyd is "+body);
        response.status(200);
        response.setHeader("Content-Disposition", 'inline; filename="' + doc + '"');
        response.write(body);
        response.end();
        return;
    });
});
app.post('/myapp/repoAttach', multipartMiddleware, function(request, response) {

	console.log("Upload File Invoked..");
	console.log('Request: ' + JSON.stringify(request.headers));
	
	var id;
	
	db.get(request.query.id, function(err, existingdoc) {		
		
		var isExistingDoc = false;
		if (!existingdoc) {
			id = '-1';
		} else {
			id = existingdoc.id;
			isExistingDoc = true;
		}

		var name = request.query.id;
//		var value = request.query.value;

		var file = request.files.file;
		var newPath = './public/uploads/' + file.name;		
		
		var insertAttachment = function(file, id, rev, name, response) {
			
			fs.readFile(file.path, function(err, data) {
				if (!err) {
				    
					if (file) {
						  
						db.attachment.insert(id, file.name, data, file.type, {rev: rev}, function(err, document) {
							if (!err) {
								console.log('Attachment saved successfully.. ');
	
								db.get(document.id, function(err, doc) {
									console.log('Attachements from server --> ' + JSON.stringify(doc._attachments));
									console.log('Response after attachment: \n'+JSON.stringify(doc));
									return response.send(JSON.stringify("SUCCESS")).end();
								});
							} else {
								console.log(err);
							}
						});
					}
				}
			});
		}

		if (!isExistingDoc) {
			existingdoc = {
				id : name,
				create_date : new Date()
			};
			
			// save doc
			db.insert({
				name : name,
			}, name, function(err, doc) {
				if(err) {
					console.log(err);
				} else {
					
					existingdoc = doc;
					console.log("New doc created ..");
					console.log(existingdoc);
					insertAttachment(file, existingdoc.id, existingdoc.rev, name, response);
					
				}
			});
			
		} else {
			console.log('Adding attachment to existing doc.');
			console.log(existingdoc);
			insertAttachment(file, existingdoc._id, existingdoc._rev, name,  response);
		}
		
	});

});
app.put('/myapp/putRoster',function(req,res){
	console.log("Update Invoked.."+JSON.stringify(req.body));
	var id = req.body.id;
	var data = JSON.parse(req.body.data);
	
	console.log("ID: " + id);
	console.log('data : '+data);
	db.get(id, function(err, doc) {
		if (!err) {
			console.log(doc);
			doc.data = data;
			db.insert(doc, doc.id, function(err, doc) {
				if(err) {
					console.log('Error inserting data\n'+err);
					return res.send(JSON.stringify("Error Inserting File")).end();
				}
				console.log('Doc updated :'+id);
				return res.send(JSON.stringify("SUCCESS")).end();
			});
		} else{
			console.log(err);
			return res.send(JSON.stringify("File Not found")).end();
		}
	});
});

app.post('/myapp/postRoster',function(req,res){
	console.log("Create Invoked.."+JSON.stringify(req.body));
	var id = req.body.id;
	var data = JSON.parse(req.body.data);
	
	console.log("ID: " + id);
	console.log('data : ' + data)
	
			db.insert({data : data}, id, function(err, doc) {
				if(err) {
					console.log('Error inserting data\n'+err);
					return 500;
				}
				console.log("Inserted Doc"+id);
				return res.send(JSON.stringify("SUCCESS")).end();
			});
		
});

app.delete('/myapp/delRoster', function(req,res) {
	var id = req.query.id;
	console.log("Delete Invoked for Roster "+ id);
	// var rev = request.query.rev; // Rev can be fetched from request. if
	// needed, send the rev from client
	console.log("Removing document of ID: " + id);
	console.log('Request Query: '+JSON.stringify(req.query));
	
	db.get(id, { revs_info: true }, function(err, doc) {
		if (!err) {
			db.destroy(doc._id, doc._rev, function (err, status) {
			     // Handle response
				 if(err) {
					 console.log('Delete Failed for Roster: '+id );
					 console.log(err);
					 res.sendStatus(500);
				 } else {
					 //response.sendStatus(200);
					 console.log('Successfully deleted the roster' + id);
					 return res.send(JSON.stringify('SUCCESS')).end();
				 }
			});
		}
	});

});

app.put('/myapp/putTeamList',function(req,res){
	console.log("Update Invoked.."+JSON.stringify(req.body));
	var id = req.body.id;
	var data = JSON.parse(req.body.members);
	
	console.log("ID: " + id);
	console.log('data : '+data);
	db.get(id, function(err, doc) {
		if (!err) {
			console.log(doc);
			doc.members = data;
			db.insert(doc, doc.id, function(err, doc) {
				if(err) {
					console.log('Error inserting data\n'+err);
					return res.send(JSON.stringify("Error Inserting File")).end();
				}
				console.log('Doc updated :'+id);
				return res.send(JSON.stringify("SUCCESS")).end();
			});
		} else{
			console.log(err);
			return res.send(JSON.stringify("File Not found")).end();
		}
	});
});

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('Express server listening on port ' + app.get('port'));
});

