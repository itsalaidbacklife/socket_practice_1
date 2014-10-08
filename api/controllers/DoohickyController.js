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
			//console.log('It totes has the alive prop: ' + params.alive);
			Doohicky.update(params.id, {alive: params.alive}).exec(
				function updated(err, newguy){
					Doohicky.publishUpdate(params.id, {alive: params.alive});
				});
		}
	},

	destroy: function(req, res) {
		//Retrieve id of doohicky to be destroyed
		var req_id = req.param('id');
		//Retrieve all parameters
		var params = req.allParams();

		console.log('destroying id: ' + req_id);
		//Destroy doohicky
		Doohicky.destroy({id:req_id}).exec(
			function destroyed(err){
				console.log('inside destroyed function');
				Doohicky.publishDestroy(req_id);
			});
	},

};

