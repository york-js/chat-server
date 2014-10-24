$(function() {

var session;
var lastMessageId = 0;

$( "#login").on( "submit", function( event ) {
	event.preventDefault();

	$.ajax({
		url: this.action,
		dataType: "json",
		data: {
			nick: $( "#nick" ).val()
		}
	}).then(function( data ) {
		session = data.session;
		$( "#login" ).hide();
		$( "#chat" ).show();
		startListening();
	}, function() {
		alert( "uhoh" );
	});
});

$( "#chat" ).on( "submit", function( event ) {
	event.preventDefault();

	$.ajax({
		url: this.action,
		data: {
			session: session,
			msg: $( "#msg" ).val()
		}
	}).then(function( data ) {
		$( "#msg" ).val( "" );
	}, function() {
		alert( "uhoh" );
	});
});

function startListening() {
	$.ajax({
		url: "/update",
		dataType: "json",
		data: {
			session: session,
			since: lastMessageId
		}
	}).then(function( messages ) {
		$.each( messages, function( index, message ) {
			$( "<p>" ).text( message.nick + ": " + message.msg )
				.appendTo( "#log" );
			lastMessageId = message.id;
		});
		startListening();
	}, function() {
		alert( "uhoh" );
	});
}

});
