var socket = io.connect('http://localhost:1337');

//When form is submited, create a new doohicky with the name entered in the form-field and alive status true
$('#create').submit(function(form){
	//console.log('Sending Form\n');
	console.log($('#name_field').val());
	form.preventDefault();
	socket.post('/doohicky', {name: $('#name_field').val(), alive: true}, function(resData) {
		console.log(resData);
	});
	$('#name_field').val('');
});

var count = 0;

//When Request button is clicked, make get request for next doohicky and append its info as a div inside doohickies element
$('#req_button').on('click', function() {
	console.log('button clicked');
	socket.get('/doohicky', function(res, jwres){
		if(res[count]) {
			console.log('count = ' + count);
			console.log(res[count].name + ' id#: ' + res[count].id);
			$('#doohickies').append("<div class='doohicky' id='" + res[count].id +"'>" + 'Name: ' + res[count].name + ' Alive: ' + res[count].alive + '</div>');
	//		if(count == 0){
			//Remove event listener on doohicky class (because it doesn't apply to the new doohicky)
			$('.doohicky').off('click');
			//Add event listener to doohicky class that will apply to newest doohicky
			$('.doohicky').on('click', function(){
				console.log('clicked\n');
				var conf = confirm("Do you want to delete doohicky: " + $(this).prop('id'));
				if(conf){
					console.log("Destroy req confirmed");
					//creates path to doohicky to be destryoed
					var path = "/doohicky/" + $(this).prop('id');
					socket.delete(path, function(resdata) {
						console.log(resdata);
					});
				}
			});
	//		}
			count++;
		}
	});
});

