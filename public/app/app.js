
var testSend = function(game) {
	$.ajax({
		url: '/users/collection/add',
		data: {
			game: game
		},
		type: 'POST',
		success: function(data) {
			console.log('success');
		},
		error: function(error) {
			console.log('some error');
		}
	});

	$(event.target).fadeIn(function() {
		$(event.target).prop('disabled', true);
		$(event.target).html('Added!');
	});
};