var socket = io.connect('http://localhost:1337');

$('#create').submit(function(form){
	console.log('Sending Form\n');
	console.log($('#name_field').val());
	form.preventDefault();
	socket.post('/doohicky', {name: $('#name_field').val()}, function(resData) {
		console.log(resData);
	});
	$('#name_field').val('');
});

$('#req_button').on('click', function() {
	console.log('button clicked');
	socket.get('/doohicky', function(res, jwres){console.log(res);});
	});