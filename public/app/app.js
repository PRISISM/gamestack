
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
		},
		async: false
	});

	$(event.target).fadeIn(function() {
		$(event.target).prop('disabled', true);
		$(event.target).html('Added!');
	});
};

var removeGame = function(game) {
	$.ajax({
		url: '/users/collection/remove',
		data: {
			game: game
		},
		type: 'POST',
		success: function(data) {
			console.log(data);
			location.reload();
		},
		error: function(error) {
			console.log('some error');
		}
		// async: false
	});


};