var PlatformerGame = PlatformerGame || {};

PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {


    create: function() {

            // NEXT: 
            // re-enable import of items (player start pos)
            // make the player finish the level automatically
            // add clickable places for traps (traps=1 tower type)
            // traps
            // waves of enemies (neverending)
            // done with MVP
            // moar tiles
            // levels
            // upgrade towers


        
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.scale.setTo(72 * 100, 72 * 18);

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('tiles_spritesheet', 'gameTiles');

        //this.blockedLayer = this.map.createLayer('objectLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');
        //this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

        //this.blockedLayer.body.immovable = true;
        this.blockedLayer.resizeWorld();

        this.playerCanJump = true;

        this.corpses = this.game.add.group();
/*
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
        this.ground.body.immovable = true; // player can now stand on it

        this.ledge = this.platforms.create(0, 32, 'platform');
        this.ledge.body.immovable = true;

        this.ledge = this.platforms.create(32, 32, 'platform');
        this.ledge.body.immovable = true;
*/



        //var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        //this.player = this.game.add.sprite(result[0].x + 32, result[0].y - 32, 'caveman'); //32, this.game.world.height - 150
        this.player = this.game.add.sprite(0, 72*15 - 256, 'caveman'); //32, this.game.world.height - 150

        //this.player.smoothed = false;
        this.game.physics.arcade.enable(this.player); // player now affected by physics. SCIENCE!
        this.game.camera.follow(this.player);

        this.lastTile = this.player;

        this.game.physics.arcade.gravity.y = 600;

        this.player.enableBody = true;
        this.player.body.bounce.y = 0.0; // 0.3 with bouncy shoes
        //this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = false;
        //this.player.body.setSize(128,128,-64,-128);
        
        this.player.body.setSize(128, 156, 0, 26);

        this.player.frame = 12;
        this.player.anchor.set(0.5);
        this.player.scale.set(0.5);
        // animations
        this.player.animations.add('left', [12, 20], 10, true);
//        this.player.animations.add('right', [0], 10, true);
        this.player.animations.add('right', [12, 20], 10, true);
        this.player.animations.add('jump_right', [12, 20, 52], 10, false);

        this.player.animations.add('blink', [0,15,0,15,0,15,0,15,0], 9, false);
        // [0,1,2,3,4,5,6,7,8,9,10,0,15], 1, false); //
/*
        this.coins = this.game.add.group();

        this.coins.enableBody = true;

        // create some coins
        for (var i = 0; i < 10; i++) {
            var coin = this.coins.create(i * 32, 0, 'coin');

            coin.body.gravity.y = 300; // coins can fall down
            coin.body.bounce.y = 0.3;
        }
        */


        // add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

//        this.createItems();
  //      this.createCreatures();
    //    this.creatures.add(this.boss);

        this.playerMaxHealth = 3;
        this.playerHealth = this.playerMaxHealth;

        this.star = this.game.add.sprite(0, 0 , 'objects');
        this.star.frame = 7;
        this.star.visible = false;
        this.star.animations.add('blink', [7,8,15], 10, false);
        
        this.hearts = this.game.add.group();
        for(var i=0; i<5; i++) {

            var heart = this.game.add.sprite(2 + (18*i), 2, 'objects');
            if (this.playerMaxHealth > i) {
                heart.frame = 4;
            }
            else {
                heart.frame = 15;
            }

            this.hearts.add(heart);

        }
        this.hearts.fixedToCamera = true;
        this.noPain = 0;
        this.time = 100;

        // add a score text
        this.scoreText = this.game.add.text(40, 20, '              The Frog King\n              and his minions\n              have invaded\n              your country!', { fontSize: '16px', fill: '#000'});
        this.score = 0;
        this.scoreText.alpha = 0;
        this.scoreText.fixedToCamera = true;
        this.scoreText.visible = true;        

        // add an info text
        this.infoText = this.game.add.text(43, 85, 'Game Over', { fontSize: '32px', fill: '#000'});
        this.infoText.fixedToCamera = true;
        this.infoText.visible = false;
        this.gameOver = 0;

//        this.music = this.game.add.audio('theme');
//        this.sound_land.volume = 0.5;
  //      this.music.loop = true;
    //    this.music.play();

        //this.player.scale.x *= -1;
        this.left = false;
        this.right = true;
        this.jump = false;
        this.isJumping = false;

    },

    update: function() {

        if (!this.player.inWorld) {
            this.loseLife(1);
            this.respawn();
        }

        if (this.gameOver == 1) {
            this.state.start('Preload');
        }

        if (this.gameOver > 0) {
            this.player.body.velocity.y = 10;
            this.player.body.velocity.x = 0;
            this.gameOver -= 1;
        }
        else {

            // collisions! player with platforms; coins with platforms
            this.game.physics.arcade.collide(this.player, this.blockedLayer, this.resetJump, null, this);
     //       this.game.physics.arcade.collide(this.items, this.blockedLayer);
   //         this.game.physics.arcade.collide(this.creatures, this.blockedLayer);
 //           this.game.physics.arcade.collide(this.creatures, this.creatures);
/*
            this.corpses.forEach(function(corpse) {
                this.game.physics.arcade.collide(this.player, corpse, this.resetJumpUnconditionally, null, this);
                this.game.physics.arcade.collide(corpse, this.blockedLayer);
                this.game.physics.arcade.collide(corpse, this.corpses);
                this.game.physics.arcade.collide(corpse, this.creatures, this.corpseCreatureCollision, null, this);
            }, this);

            this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
            this.game.physics.arcade.overlap(this.player, this.creatures, this.creatureCollision, null, this);
*/
            // if player overlaps a coin, call the collectCoin function
    //        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

            // reset the players velocity 
if (this.isJumping) {} else{ 

            if (this.player.body.x > 79*72) {
                this.jump = false;
            }
            else if (this.player.body.x > 73*72) {
                this.jump = true;
            }
            else if (this.player.body.x > 50*72) {
                this.jump = false;
            }
            else if (this.player.body.x > 43*72) {
                this.jump = true;
            }
            else if (this.player.body.x > 22*72) {
                this.jump = false;
            }
            else if (this.player.body.x > 20*72) {
                this.jump = true;
            }

            this.player.body.velocity.x = 0;

            if (this.cursors.left.isDown) {
                this.left = true;
                this.right = false;
            }
            else if (this.cursors.right.isDown) {
                this.left = false;
                this.right = true;
            }
            else if (this.cursors.down.isDown) {
                this.left = false;
                this.right = false;
            }


            if (this.left) {
                this.player.body.velocity.x = -300;
                this.player.scale.setTo(-0.5,0.5);
                if (this.playerCanTakeDamage() && this.playerCanJump) {
                    this.player.animations.play('right');

                }
            }
            else if (this.right) {
                this.player.body.velocity.x = 300;
                this.player.scale.setTo(0.5,0.5);
                if (this.playerCanTakeDamage() && this.playerCanJump) {
                    this.player.animations.play('right');
                }
            }
            else { // stand still
                if (this.playerCanTakeDamage() && this.playerCanJump) {
                    this.player.animations.currentAnim.loop = false;
                    this.player.frame = 44;
                }
            }

            // jump
            if ((this.cursors.up.isDown || this.jump) && this.playerCanJump) { // this.player.body.blocked.down //this.playerCanJump) { //} && this.player.body.touching.down) {
                this.player.body.velocity.y = -512;
                this.playerCanJump = false;
                //this.player.animations.stop(null, false);// = false;
                //this.player.frame = 52;
                this.player.animations.play("jump_right");
                this.isJumping = true;
            }


            if (!this.playerCanTakeDamage()) {
                this.noPain -= 1;
            }

            // for some strange reason, standing on corpses give you a velocity of 6.02 
            // for some strange reason, standing on 2 corpses give you a velocity of 12.04
            if (this.player.body.velocity.y > 13) {
                this.playerCanJump = false;
            }

            if (this.player.body.velocity.y < 0) {
                this.playerCanJump = false;
            }


}
/*
            this.creatures.forEach(function(frog) { 
                this.frogMove(frog);
            }, this);
*/
        }
    },



//-----------------------------------------------------------------------------------------------------------------



    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {
        
        if (!this.playerCanJump && this.player.body.blocked.down) {
            
            //this.sound_land.play(); // sounds horrible
        }
        if (this.player.body.blocked.down) {
            this.playerCanJump = true;
            this.isJumping = false;  
        }
    },

    resetJumpUnconditionally: function(player, tile) {

        if (!this.playerCanJump) {
    //       this.sound_crunch.volume = 0.3;
//           this.sound_crunch.play();// sounds horrible
  //         this.sound_land.play();
        }
        this.playerCanJump = true;
    },


    createItems: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        
        result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },

    createCreatures: function() {
        this.creatures = this.game.add.group();
        this.creatures.enableBody = true;
        
        result = this.findObjectsByType('creature', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.creatures);
        }, this);
        result = this.findObjectsByType('boss', this.map, 'objectsLayer');
        this.boss = this.creatures.create(result[0].x, result[0].y, 'objects');
        this.boss.scale.setTo(4, 4);
        this.boss.y -= 48;
        this.boss.frame = 1;
        this.boss['type'] = 'boss';
    },

    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },

    collect: function(player, collectable) {
        switch (collectable.frame) {
            case 6: // heart
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }
//                this.playRandomOohSound();
                break;
            case 9: // gold heart
                this.hearts.getAt(this.playerMaxHealth).frame = 5;
                this.playerMaxHealth += 1;
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }
//                this.sound_ohyeah.play();
                break;
        }
        collectable.destroy();

    },

    creatureCollision: function(player, creature) {
        if (creature.body.touching.up && player.body.touching.down) {
            //this.sound_crunch.volume = 0.9;
            //this.sound_crunch.play();
            player.body.velocity.y *= -0.5;
            this.playerCanJump = true;
            //creature.frame = creature.frame + 1;
            this.createCorpse(creature);
            creature.destroy();
        }
        else {
            this.loseLife(1);
            
        }
    },

    loseLife: function(amount) {
        if (this.playerCanTakeDamage() && this.playerHealth > 0)
        {
            this.noPain = 50;
            this.player.animations.play('blink');
            this.playerHealth -= amount;
            this.hearts.getAt(this.playerHealth).frame = 5;
            if (this.playerHealth <= 0) {
               this.playerDied();
               //this.playRandomDeathSound();
           }
           else {
                //this.playRandomOuchSound();
           }
        }
    },

    playerCanTakeDamage: function(player, thing) {
        return (this.noPain === 0);
    },

    playerDied: function() {
        //console.log("death is always an option");
        this.infoText.visible = true;
        this.gameOver = 300;
        //this.music.stop();

        // respawn all creatures etc



    },

    respawn: function() {
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.player.x = result[0].x;
        this.player.y = result[0].y;
        this.inPain = 120;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
    },

    createCorpse: function(creature) {
        var corpse = this.corpses.create(creature.x, creature.y + 10, 'objects');
        corpse.frame = creature.frame + 1;
        this.game.physics.arcade.enable(corpse);
        corpse.body.y += 10;
        corpse.body.drag.setTo(100);
        
        corpse.body.setSize(16, 6);

        this.star.y = creature.y - 2;
        this.star.x = creature.x - 2;
        this.star.visible = true;
        this.star.animations.play('blink');  
    },

    playRandomOuchSound: function() {
        switch(this.game.rnd.integerInRange(1, 5)) {
            case 1: 
                this.sound_ouch1.play();
                break;
            case 2: 
                this.sound_ouch2.play();
                break;
            case 3: 
                this.sound_ouch3.play();
                break;
            case 4: 
                this.sound_ouch4.play();
                break;
            default:
                this.sound_ouch5.play();
                break;
        }
    },
    
    playRandomDeathSound: function() {
        switch(this.game.rnd.integerInRange(1, 2)) {
            case 1: 
                this.sound_death1.play();
                break;
            default:
                this.sound_death2.play();
                break;
        }
    },


    playRandomOohSound: function() {
        switch(this.game.rnd.integerInRange(1, 2)) {
            case 1: 
                this.sound_ooh1.play();
                break;
            default:
                this.sound_ooh2.play();
                break;
        }
    },

    playRandomFrogSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_frog1.play();
                break;
            case 2: 
                this.sound_frog2.play();
                break;
            default:
                this.sound_frog3.play();
                break;
        }
    },

    endGame: function() {

        this.scoreText.text = "The Frog King's ghost\ntells you each frog\nyou killed...\nwas one of your friends.\nTurns out...\nYou are the Monster!";
        this.scoreText.visible = true;
       // this.sound_laugh.play();

    },

    corpseCreatureCollision: function(corpse, creature) {
        if (creature.body.touching.up && corpse.body.touching.down) {
            //this.sound_crunch.volume = 1.2;
            //this.sound_crunch.play();
            this.createCorpse(creature);
            creature.destroy();            
        }
    },

    distanceBetweenTwoPoints: function(a, b) {
        var xs = b.x - a.x;
        xs = xs * xs;

        var ys = b.y - a.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },

    frogMove: function(frog) {


        if (frog['type'] == 'boss') {
            if (this.distanceBetweenTwoPoints(frog, this.player) < 190 && this.player.y <= frog.y + 50) {

                if (this.game.rnd.integerInRange(1, 50) == 1) {
                  //  this.sound_bossfrog.play();
                }
                
            
                if (this.player.x > frog.x) {
                    //ghost.x += this.ghostSpeed('slow');
                    frog.body.velocity.x = this.ghostSpeedBoss;
                }
                else if (this.player.x < frog.x) {
                    frog.body.velocity.x = -this.ghostSpeedBoss;
                    //ghost.x -= this.ghostSpeed('slow');
                }

                if (this.game.rnd.integerInRange(0, 5) === 0 && frog.body.blocked.down) {
                    frog.body.velocity.y = -226; //this.ghostSpeedSlow;
                    
                }
           }
        }
        else {
            
            if (this.distanceBetweenTwoPoints(frog, this.player) < 80 && this.player.y <= frog.y + 10) {

                if (this.game.rnd.integerInRange(1, 80) == 1) {
                   // this.playRandomFrogSound(); // ideally each frog should have 1 sound but whateves
                    this.scoreText.visible = false;
                }
                
            
                if (this.player.x > frog.x) {
                    //ghost.x += this.ghostSpeed('slow');
                    frog.body.velocity.x = this.ghostSpeedSlow;
                }
                else if (this.player.x < frog.x) {
                    frog.body.velocity.x = -this.ghostSpeedSlow;
                    //ghost.x -= this.ghostSpeed('slow');
                }

                if (this.game.rnd.integerInRange(0, 5) === 0 && frog.body.blocked.down) {
                    frog.body.velocity.y = -128; //this.ghostSpeedSlow;
                    
                }
           }
       }

    }

};