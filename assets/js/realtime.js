var socket = io.connect('http://localhost:1337');

//clear function erases all displayed doohickes
var clear = function() {
	$('#doohickies').html('');
}

//Clears #doohickes, then populates it with .doohicky divs
var render = function() {
	clear();
	socket.get('/doohicky', function(res) {
		if(res.length > 0){

			//console.log(res);

			//Iterate through array of doohickies returned by get request 
			//and append html tags representing them into the #doohickies div
			$.each(res, function(index, val) {
				$('#doohickies').append("<div class='doohicky' id='" + val.id +"'>" + 'Name: ' + val.name + ' Alive: ' + val.alive + '</div>');
				//console.log(val);
			});
			//Removes event listener from .doohicky.on('click') (because it won't apply to newly added doohickies)
			$('.doohicky').off('click');

			//Adds event listener to .doohicky when clicked

			//If left click, confirms that user wishes to toggle alive

			//If right click, confirms that user wishes to delete doohicky

			//$('.doohicky').on('click', function(){
			$('.doohicky').mousedown(function(event) {
				var req_id = $(this).prop('id');
				console.log('You clicked div w/ id: ' + req_id);
				//Get path to doohicky on server
				var path = '/doohicky/' + req_id;
				console.log('the path is: ' + path);
				//Preserve $(this) div as var div
				var div = $(this);
				//Check which type of click was made
			    switch (event.which) {
			    	//If doohicky was left clicked, give option to toggle alive
			        case 1:
			          //  alert('Left Mouse button pressed.');
						socket.get(path, function(data, jwres){
							var req_name = data.name;
							var req_alive = data.alive;
							//console.log(data);
							//console.log(req_name + ' ' + req_alive);
							
							//If doohicky was alive, ask if user wishes to kill it
							if(req_alive){
								var conf = confirm('Are you sure you want to kill ' + req_name + '?');
								if(conf){
									toggle_alive(div);
								}
							}

							//If doohicky was dead, ask if user wishes to resurrect it
							else{
								var conf = confirm('Are you sure you want to resurrect ' + req_name + '?');
								if(conf){
									toggle_alive(div);
								}
							}
						});
			            break;
			        case 2:
			            alert('Middle Mouse button pressed.');
			            break;
			        //If Right click, confirm that user wishes to destroy doohicky
			        case 3:
			            var conf = confirm('Do you want to delete this doohicky?');
			            if(conf){
			            	delete_doohicky(div);
			            }
			            break;
			        default:
			            alert('You have a strange Mouse!');
			    }
			});				

				//toggle_alive($(this));
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
}

//Sends a delete request to server based on div id
var delete_doohicky = function(div){
	//Create path to doohicky to be deleted
	//using id of div
	var path = "/doohicky/" + div.prop('id');

	console.log('path: ' + path);
	socket.delete(path, function(data, jwres){
		console.log('Deleted doohicky: ' + data.name);
	});


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
	console.log('doohicky event fired');
	if(obj.verb == 'created'){
		var data = obj.data;
		console.log('doohicky created: ' + data.name);
		render();
	}

	if(obj.verb == 'updated'){
		var data = obj.data;
		console.log('doohicky updated: ' + obj.data);
		render();
	}

	if(obj.verb == 'destroyed'){
		console.log('doohicky destroyed: ' + obj);
		render();
	}
});