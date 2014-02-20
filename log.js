
module.exports = function( server ) {
	return function( request, response ) {
		server.messages.forEach(function( message ) {
			response.write(
				"<p>" +
				message.nick + ": " +
				message.msg +
				"</p>"
			);
		});
		response.end();
	};
};
