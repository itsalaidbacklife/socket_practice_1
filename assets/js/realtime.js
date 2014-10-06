var socket = io.connect('http://localhost:1337');

//clear function erases all displayed doohickes
var clear = function() {
	$('#doohickies').html('');
}

//Clears #doohickes, then populates it with .doohicky divs
var render = function() {
	console.log('rendering');
	clear();
	socket.get('/doohicky', function(res) {
		if(res.length > 0){

			//console.log(res);

			//Iterate through array of doohickies returned by get request 
			//and append html tags representing them into thr #doohickies div
			$.each(res, function(index, val) {
				$('#doohickies').append("<div class='doohicky' id='" + val.id +"'>" + 'Name: ' + val.name + ' Alive: ' + val.alive + '</div>');
				console.log('rendered: ');
				console.log(val);
			});
			//Removes event listener from .doohicky.on('click') (because it won't apply to newly added doohickies)
			$('.doohicky').off('click');
			//Adds event listener to .doohicky.on('click') to toggle their alive status
			$('.doohicky').on('click', function(){
				console.log('Toggle call');
				toggle_alive($(this));
			});
		}
		else{
			console.log('No Doohickies!');
		}
	});
}

var toggle_alive = function(div){
	console.log(div);
	//Create path to doohicky to be updated
	var path = "/doohicky/" + div.prop('id');
	console.log(path);
	socket.get(path, function(data, jwres){
		console.log('current doohicky pre-put: ' );
		console.log(data);
		socket.put(path, {alive: !data.alive}, function(put_res, put_jwres){
			console.log('current doohicky post-put: ')
			console.log(put_res);
		});
		
	});

	//Render doohickes after change
	//render();


}

//////////////////////////////////////
//Button Clicks and Form Submissions//
//////////////////////////////////////

//When form is submited, create a new doohicky with the name entered in
// the form-field and alive status true
$('#create').submit(function(form){
	console.log($('#name_field').val());
	form.preventDefault();
	//Post new hoohicky through socket taking name from #name_field div 
	//and setting alive true
/*	socket.post('/doohicky', {name: $('#name_field').val(), alive: true}, function(resData) {
		//Logs response
		console.log(resData);
	}); 
*/
	socket.get('/doohicky/create', {name: $('#name_field').val(), alive: true}, function(resData) {
		//Logs response
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

//Clear displayed doohickies when clear button is clicked
$('#clear').on('click', function() {
	console.log('clearing\n');
	clear();
});

//Render all doohickies when render button is clicked
$('#render').on('click', function(){
	render();
});

//Subscribe to doohicky class room when subscribe button
//is clicked
socket.on('connect', function(){
	socket.get('/doohicky/subscribe');
});

////////////////
//Socket Stuff//
////////////////

socket.on('doohicky', function(obj){
	console.log('doohicky created: ' + obj.data);
	render();
});