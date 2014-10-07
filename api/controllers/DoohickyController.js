/**
 * DoohickyController
 *
 * @description :: Server-side logic for managing doohickies
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	subscribe: function(req, res) {
		console.log('subscribing socket: ' + req.socket.id + ' to doohicky class room');
		Doohicky.watch(req);
	},

	create: function(req, res) {
		console.log('creating doohicky');
		var req_name = req.param('name');

		Doohicky.create({name: req_name, alive: true}).exec(function created(err, newguy){
			Doohicky.publishCreate({id: newguy.id, alive: newguy.alive});
			console.log('new doohicky: ' + newguy.name + ' created');
		});
	},

	update: function(req, res) {
		var req_id = req.param('id');
		var params = req.allParams();


		console.log('updating id: ' + req_id);
		console.log(params);
		if(params.hasOwnProperty('alive')){
			console.log('It totes has the alive prop: ' + params.alive);
			Doohicky.update(params.id, {alive: params.alive}).exec(
				function updated(err, newguy){
					Doohicky.publishUpdate(params.id, {alive: params.alive});
				});
		}

	/*	if(req.param('name')){
			console.log('name given!\n');
			var req_name = req.param('name');
			if(req.param('alive')){
				var req_alive = req.param('alive');
				Doohicky.update(req_id, {name: req_name, alive: req_alive}).exec(function updated(err, newguy){
					Doohicky.publishUpdate(req_id, {name: req_name, alive: req_alive});
					console.log('doohicky: ' + req_name + ' updated');
				});
			}
		}
		else if(req.param('alive' != undefined)){
			var req_alive = req.param('alive');
			console.log('No name, alive given')
			console.log('updating doohicky: ' + req_id);
			Doohicky.update(req_id, {alive: req_alve});
			Doohicky.publishUpdate(req_id, {name: req_name, alive: req_alive});
		} 
	*/
	}

};

