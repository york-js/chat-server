var http = require( "http" );
var url = require( "url" );
var crypto = require( "crypto" );

process.on( "uncaughtException", function( error ) {
	console.log( "OH NO" );
	console.log( error.stack );
	process.exit();
});

var users = {};
var nicks = {};

var routes = {
	GET: {},
	POST: {}
};

function notFound( request, response ) {
	response.writeHead( 404 );
	response.end();
}

var server = http.createServer(function( request, response ) {
	var parsedUrl = url.parse( request.url, true );
	var route = routes[ request.method ][ parsedUrl.pathname ] || notFound;

	request.parsedUrl = parsedUrl;

	setTimeout(function() {
		route( request, response );
	});
});

server.messages = [];

routes.GET[ "/" ] = function( request, response ) {
	var nick = request.parsedUrl.query.nick;

	if ( !nick ) {
		response.writeHead( 400 );
		response.write( JSON.stringify({
			msg: "Missing required field: nick"
		}));
		response.end();
		return;
	}

	if ( !/[a-z0-9_-]/i.test( nick ) ) {
		response.writeHead( 400 );
		response.write( JSON.stringify({
			msg: "Invalid nick"
		}));
		response.end();
		return;
	}

	if ( nicks[ nick ] ) {
		response.writeHead( 400 );
		response.write( JSON.stringify({
			msg: "Nick already in use"
		}));
		response.end();
		return;
	}

	var md5 = crypto.createHash( "md5" );
	md5.update( "" + Math.random() );
	var sessionId = md5.digest( "hex" );
	var session = {
		nick: nick,
		sessionId: sessionId,
		timestamp: Date.now()
	};
	nicks[ nick ] = true;
	users[ sessionId ] = session;

	response.write( JSON.stringify({
		session: sessionId
	}));
	response.end();
};

routes.GET[ "/who" ] = function( request, response ) {
	response.end( JSON.stringify( Object.keys( nicks ) ) );
};

routes.GET[ "/log" ] = require( "./log" )( server );

routes.GET[ "/msg" ] = function( request, response ) {
	var sessionId = request.parsedUrl.query.session;
	if ( !users[ sessionId ] ) {
		response.writeHead( 400 );
		response.write( JSON.stringify({
			msg: "Invalid session"
		}));
		response.end();
		return;
	}

	server.messages.push({
		nick: users[ sessionId ].nick,
		msg: request.parsedUrl.query.msg
	});
	response.end();
};

server.listen( 3000 );
