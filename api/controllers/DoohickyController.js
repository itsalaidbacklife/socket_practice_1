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


	}
};

