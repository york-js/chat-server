
module.exports = function( server ) {
	return function( request, response ) {
		server.messages.forEach(function( message ) {
			response.write(
				"<p>" +
				message.nick + ": " +
				message.msg +
				" [" + message.timestamp.getHours() + ":" +
					message.timestamp.getMinutes() + ":" +
					message.timestamp.getSeconds() + "]" +
				"</p>"
			);
		});
		response.end();
	};
};
