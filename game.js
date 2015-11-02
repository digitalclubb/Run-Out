(function() {

	'use strict';

	var skier,
		trees,
		snowmen,
		cursors;

	function Game() {}

	Game.prototype = {
		preload: function() {

			game.load.spritesheet( 'skier', 'assets/skier.png', 75, 175, 5 );
			game.load.image('tree', 'assets/tree.png');
			game.load.image('snow', 'assets/snow.png');
			game.load.image('snowman', 'assets/snowman.png');
			game.load.image('finish', 'assets/finish.png');

		},
		create: function () {

			game.add.tileSprite(0, 0, 3000, 10000, 'snow');
    		game.world.setBounds(0, 0, 3000, 10000);

    		// Add finish line
    		var finish = game.add.sprite(200, game.world.height-350, 'finish');
    		finish.scale.setTo(1.5, 1.5);


			//  use Arcade Physics system
    		game.physics.startSystem( Phaser.Physics.ARCADE );

		    //  Add the skier to the screen, top left
		    skier = game.add.sprite( 0, 0, 'skier' );

		    // Enable physics on skier
		    game.physics.arcade.enable( skier );

		    // Follow skier with camera
		    game.camera.follow( skier );

		    // Add grabity and bounce
   			skier.body.bounce.y = 0.2;
		    skier.body.gravity.y = 300;
		    skier.body.collideWorldBounds = true;

		    //  Our two animations, walking left and right.
		    skier.animations.add( 'left', [0, 1], true );
		    skier.animations.add( 'right', [3, 4], true );

		    // Create trees group and enable physics
		    trees = game.add.group();
    		trees.enableBody = true;

    		snowmen = game.add.group();
    		snowmen.enableBody = true;

			// start off on the left 220px above the ground
			var x = 0, y = game.world.height - 220;

			// keep adding platforms until close to the top
			while(y > 200) {

				var tree = trees.create( x, y, 'tree' );
				tree.body.immovable = true;

				var snowman = snowmen.create( x+150, y+300, 'snowman' );
				snowman.body.immovable = true;

				// find center of game canvas
				var center = game.world.width / 2;

				if( x > center ) {
					// if the last platform was to the right of the
					// center, put the next one on the left
					x = Math.random() * center;
				} else {
					// if it was on the left, put the next one on the right
					x = center + Math.random() * (center - game.world.width);
				}

				// place the next platform at least 200px higher and at most 300px higher
				y = y - 200 - 100 * Math.random();
			}

		    //  Our controls.
    		cursors = game.input.keyboard.createCursorKeys();


		},
		update: function () {

			// Create collisions between player and trees
			game.physics.arcade.collide( skier, trees );

			//  Reset the players velocity (movement)
		    skier.body.velocity.x = 0;
		    skier.body.velocity.y = 300;

		    // Up goes slow, down goes fast
		    if (cursors.up.isDown) {

		    	skier.body.velocity.y = 10;

			} else if ( cursors.down.isDown ) {

				skier.body.velocity.y = 1200;

			}

			// Turn side to side or default to still
			if (cursors.left.isDown) {

		        //  Move to the left
		        skier.body.velocity.x = -150;
		        skier.animations.play('left');

		    } else if (cursors.right.isDown) {

		        //  Move to the right
		        skier.body.velocity.x = 150;
		        skier.animations.play('right');

		    } else {

		        //  Stand still
		        skier.animations.stop();
		        skier.frame = 2;

		    }

		},
		render: function() {

		//	game.debug.cameraInfo( game.camera, 32, 32 );
    	//	game.debug.spriteCoords( skier, 32, 500 );

		}
	};

	var game = new Phaser.Game( 1920, 900, Phaser.AUTO, 'game' );

	game.state.add( 'game', Game );
	game.state.start( 'game' );

}());