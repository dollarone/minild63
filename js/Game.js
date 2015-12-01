var PlatformerGame = PlatformerGame || {};

PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {


    create: function() {

            // NEXT: 
            // mouse select to buy/upgrade towers -- could just have a text next to it @spawn slime tower@ level 0. click again to ugprade: $40
            // diffenent types of towers/spawners
            // upgradable (and sellable) towers
            // waves of enemies (neverending)
            // different player types (with different money yield)
            // levels

        
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.scale.setTo(72 * 100, 72 * 18);

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('grass2', 'gameTiles');

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

        
        this.blockedLayer.resizeWorld();

        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
    
        this.spawnX = result[0].x;
        this.spawnY = result[0].y;
        this.players = this.game.add.group();
        this.corpses = this.game.add.group();
        this.spawners = this.game.add.group();

        this.game.world.scale.set(0.2, 0.2);

        // add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.playerMaxHealth = 5;
        this.playerHealth = this.playerMaxHealth;
        this.hearts = this.game.add.group();
        for(var i=0; i<5; i++) {

            var heart = this.game.add.sprite(2 + (70*i), 2, 'tiles');
            if (this.playerMaxHealth > i) {
                heart.frame = 49;
            }
            else {
                heart.frame = 35;
            }

            this.hearts.add(heart);

        }
        this.hearts.fixedToCamera = true;
        this.time = 100;
        // add an info text
        this.winText = this.game.add.text(900, 10, 'Congrats - you cleared all the waves!!', { fontSize: '42px', fill: '#fff'});
        this.winText.fixedToCamera = true;
        this.winText.visible = false;

        // add an info text
        this.introText = this.game.add.text(900, 10, "            Control camera with arrows\n\nClick on        boxes to build creep spawners\n\n     Don't let the players steal your flags!", { fontSize: '42px', fill: '#fff'});
        this.introText.fixedToCamera = true;
        this.introText.visible = true;
        this.introBox = this.game.add.sprite(1074, 100, 'tiles');
        this.introBox.fixedToCamera = true;
        this.introBox.frame = 19;

        
        // add an info text
        this.infoText = this.game.add.text(2500/2-100, 10, 'Game Over', { fontSize: '42px', fill: '#fff'});
        this.infoText.fixedToCamera = true;
        this.infoText.visible = false;
        this.gameOver = false;

        this.waveText = this.game.add.text(1000, 200, 'Prepare', { fontSize: '52px', fill: '#fff'});
        this.waveText.fixedToCamera = true;
        this.waveText.visible = false;
        this.waveNumber = 0;


        // add an info text
        this.errorText = this.game.add.text(2500/2, 1250/2, 'Not enough money!', { fontSize: '32px', fill: '#000'});
        
        this.errorText.visible = false;

        // add an info text
        this.towerText = this.game.add.text(43, 85, 'Click again to purchase\ncreep spawner (10 gold)\n                   |', { fontSize: '32px', fill: '#000'});
        this.towerText.visible = false;

        this.music = this.game.add.audio('theme');
        this.music.loop = true;
        this.music.play();



        this.creatures = this.game.add.group();
        this.creatures.enableBody = true;

        this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.worldScale = 1;
        this.timer = -2000;

        this.wave1 = [200,300,400,500,600];
        this.wave2 = [1500,1600];
        // extend them somehow ... or just hardcode:
        this.wave = [200,    300,  400,  500,  600, 
                     3000,  3100, 3250, 3380, 3500, 3610,
                     6000,  6050, 6100, 6300, 6350, 6555, 6666,
                     9000,  9200, 9330, 9490, 9600, 9615, 9630, 9670, 9690,
                     12000,12060,12120,12170,12250,12300,12400,12550,12600,12620,12635,
                     15000,15020,15040,15070,15090,15125,15200,15261,15301,15333,15348,15363,15380,15399,
                     18000,18014,18028,18042,18056,18070,18084,18096,18110,18124,18136,18150,18164,18178,18192,18206,18220,18234,18246,18260
                     ];

        this.waveWarning = [-300, 2500, 5500, 8500, 11500, 14500, 17500];

        this.createItems();
        this.spawnInterval = 400;
        this.spawnStartTimes = new Array();

        this.startingMoney = 40;
        this.money = this.startingMoney;
        this.price = 10;
        var coin = this.game.add.sprite(2430, 0, 'tiles');
        coin.fixedToCamera = true;
        coin.frame = 91;
        this.moneyText = this.game.add.text(2385, 15, '' + this.money, { fontSize: '34px', fill: '#fff'});
        this.moneyText.fixedToCamera = true;
        this.moneyPerDeath = 3;

        this.worldScale = Phaser.Math.clamp(this.worldScale, 0.25, 2);
        // set our world scale as needed
        this.game.world.scale.set(this.worldScale);
        this.towerText.bringToTop();
    },

    update: function() {
        if (!this.gameOver) {
            this.timer++;
        }
        else {
            if (this.music.volume > 0.1 ) {
                this.music.volume -= 0.005;
            }
            else {
                this.music.stop();
            }

        }

        if (this.timer == 19800) {
            this.winText.visible = true;
        }

        if (this.include(this.waveWarning, this.timer)) {
            this.introText.visible = false;
            this.introBox.visible = false;
            this.waveNumber++;
            this.waveText.text = "Prepare for wave " + this.waveNumber + "!";
            if (this.waveNumber == 7) {
                this.waveText.text = "Prepare for the final wave!";
            }
            this.waveText.visible = true
            this.waveText.alpha = 0;
            var tween = this.game.add.tween(this.waveText).to( { alpha: 1 }, 500, "Linear", true, 0, 4);
            tween.yoyo(true, 500);
        }


        if (this.include(this.wave, this.timer)) {
            this.spawnPlayer();
        }

        this.spawnStartTimes.forEach(function(spawnStartTime) {
            if ((this.timer - spawnStartTime) % this.spawnInterval == 0) {
                this.spawners.forEach(function(spawner) {
                    if (spawner["spawnStartTime"] == spawnStartTime) {
                        this.spawnCreature(spawner.x+10, spawner.y+25);
                    }
                }, this);
            }
        }, this);

        // collisions! player with platforms; creatures with platforms
        this.game.physics.arcade.collide(this.players, this.blockedLayer, this.resetJump, null, this);
        this.game.physics.arcade.collide(this.items, this.blockedLayer);
        this.game.physics.arcade.collide(this.creatures, this.blockedLayer);
        this.game.physics.arcade.overlap(this.players, this.creatures, this.creatureCollision, null, this);

        this.players.forEach(function(player) {

            if (player.body.y > 70*16 || player.body.x < -40) {
                //player.kill();
                this.loseLife(player, 1, true);
            }
            else if (player.body.x > 70*99) {
                this.loseLife(player, 1, false); 
            }

            if (player.body.x > 70*90 && !player["finished"]) {
                this.loseFlag();
                player["finished"] = true;
            }

            var jump = false

            if(this.game.rnd.integerInRange(1, 200) == 1) {
                jump = true;
            }

            if (!jump) {
                if (player.body.x > 82*70) {
                    jump = false;
                }
                else if (player.body.x > 72*70) {
                    jump = true;
                }
                else if (player.body.x > 49*70) {
                    jump = false;
                }
                else if (player.body.x > 42*70) {
                    jump = true;
                }
                else if (player.body.x > 22*70) {
                    jump = false;
                }
                else if (player.body.x > 21*70) {
                    jump = true;
                }
                else if (player.body.x > 18*70 && player.body.y < 13*70) {
                    jump = true;
                }
            }

            if (!jump) {
                this.creatures.forEach(function(creature) {

                    if (this.distanceBetweenTwoPoints(player, creature) < 100) {
                        jump = true
                    }
                }, this);

            }

            player.body.velocity.x = 0;

            if (player["direction"] == "left") {
                player.body.velocity.x = -300;
                player.scale.setTo(-0.5,0.5);
                if (this.playerCanTakeDamage(player) && player["playerCanJump"]) {
                    player.animations.play('left');

                }
            }
            else if (player["direction"] == "right") {
                player.body.velocity.x = 300;
                player.scale.setTo(0.5,0.5);
                if (this.playerCanTakeDamage(player) && player["playerCanJump"]) {
                    player.animations.play('right');
                }
            }
            else { // stand still
                if (this.playerCanTakeDamage(player) && player["playerCanJump"]) {
                    player.animations.currentAnim.loop = false;
                    player.frame = 44;
                }
            }

            // jump
            if (jump && player["playerCanJump"]) { 
                player.body.velocity.y = -512;
                player["playerCanJump"] = false;
                
                player.animations.play("jump_right");
            }


            if (!this.playerCanTakeDamage(player)) {
                player["noPain"] -= 1;
            }

            // for some strange reason, standing on corpses give you a velocity of 6.02 
            // for some strange reason, standing on 2 corpses give you a velocity of 12.04
            if (player.body.velocity.y > 13) {
                player["playerCanJump"] = false;
            }

            if (player.body.velocity.y < 0) {
                player["playerCanJump"] = false;
            }
        }, this);

        if (this.cursors.up.isDown)
        {
            this.game.camera.y -= 32;
        }
        else if (this.cursors.down.isDown)
        {
            this.game.camera.y += 32;
        }

        if (this.cursors.left.isDown)
        {
            this.game.camera.x -= 32;
        }
        else if (this.cursors.right.isDown)
        {
            this.game.camera.x += 32;
        }

        this.creatures.forEach(function(creature) {

            if (creature.body.y > 70*16 || creature.body.x < -40) {
                creature.kill();
                
            }
        }, this);
    },

    mouseListener : function(sprite, pointer) {
        

        // make into tower
        if (this.selected == sprite && sprite.hasOwnProperty("special") && sprite.special == "spawn" && sprite.tower != "spawn_down") {
            if (this.money - this.price >= 0) { // should be variable price per tower
                this.money -= this.price;
                this.moneyText.text = '' + this.money;
                sprite.tower = "spawn_down";
                sprite.frame = sprite.frame_spawn1;
                this.towerText.visible = false;
                this.errorText.visible = false;
                sprite["spawnStartTime"] = this.timer+1;
                this.spawnStartTimes.push(this.timer+1);
                this.spawners.add(sprite);
            }
            else {
                this.errorText.x = sprite.x - 2*70+35;
                this.errorText.y = sprite.y - 3*70;
                this.errorText.visible = true;
            }
        }
        else if (sprite.tower != "spawn_down") { // TODO: remove for up/downgrades
            // display
            this.towerText.x = sprite.x - 2*70;
            this.towerText.y = sprite.y - 2*70;
            this.towerText.visible = true;
            this.errorText.visible = false;
        }
        else {
            this.towerText.visible = false;
            this.errorText.visible = false;
        }

        this.selected = sprite;

      },

    spawnCreature: function(x, y) {
        var creature = this.creatures.create(x, y, 'tiles');
        //creature.scale.setTo(4, 4);
        //creature.y -= 48;
        creature.frame = 92;
        creature.body.setSize(56, 32, 4, 39);
        creature.body.debug = true;
        creature.body.gravity.y = 600;
        creature.body.velocity.x = -100;
        creature['type'] = 'boss';
        creature.animations.add('left', [92, 50], 10, true);
        creature.animations.play('left');
        return creature;
    },

    spawnPlayer: function() { // type

        var player = this.game.add.sprite(this.spawnX, this.spawnY,  'caveman'); 
        this.game.physics.arcade.enable(player);
        player.enableBody = true;
        player.body.bounce.y = 0.0; // 0.3 with bouncy shoes

        // use this instead
        player.body.gravity.y = 600;
        player.body.collideWorldBounds = false;
        
        player.body.setSize(128, 156, 0, 26);

        player.frame = 12;
        player.anchor.set(0.5);
        player.scale.set(0.5);
        // animations
        player.animations.add('left', [12, 20], 10, true);
        player.animations.add('right', [12, 20], 10, true);
        player.animations.add('jump_right', [12, 20, 52], 10, false);

        player.animations.add('blink', [20,12,20,12,20,12,20,12,20], 9, false);

        this.game.physics.arcade.enable(player); 
        player["playerCanJump"] = true;
        player["noPain"] = 0;
        player["direction"] = "right";
        

        this.players.add(player);
        return player;
    },

    include: function(arr, obj) {
        for(var i=0; i<arr.length; i++) {
            if (arr[i] == obj) return true;
        }
        return false;
    },

    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {
    
        if (!player["playerCanJump"] && player.body.blocked.down) {
                
                //this.sound_land.play(); // sounds horrible
        }
        if (player.body.blocked.down) {
                player["playerCanJump"] = true;
        
        }
    },

    resetJumpUnconditionally: function(player, tile) {

        if (!player["playerCanJump"]) {
    //         this.sound_land.play();
        }
        player["playerCanJump"] = true;
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
        this.boss = this.creatures.create(result[0].x, result[0].y, 'tiles');
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
        var sprite = group.create(element.x, element.y, 'tiles');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
        if (element.properties.special == "spawn") {
            sprite.inputEnabled = true;
            sprite.events.onInputDown.add(this.mouseListener, this);
            sprite.frame_spawn1 = parseInt(element.properties.frame_spawn1);
            sprite.frame_spawn2 = parseInt(element.properties.frame_spawn2);
    
        }
        else if (element.properties.special == "flag") {
            sprite.body.gravity.y = 0;
            this.flag = sprite;
        }
    },

    collect: function(player, collectable) {
        switch (collectable.frame) {
            case 6: // heart
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }

                break;
            case 9: // gold heart
                this.hearts.getAt(this.playerMaxHealth).frame = 5;
                this.playerMaxHealth += 1;
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }
                break;
        }
        collectable.destroy();

    },

    creatureCollision: function(player, creature) {
        if (creature.body.touching.up && player.body.touching.down) {
            player.body.velocity.y *= -0.5;
            player["playerCanJump"] = true;
            //this.createCorpse(creature);
            creature.destroy();
        }
        else {
            creature.destroy();
            this.loseLife(player, 1, true);            
        }
    },

    loseLife: function(player, amount, cash) {
        if (this.playerCanTakeDamage(player) && this.playerHealth > 0 && player.alive)
        {
            this.noPain = 50;
            player.kill();
            if (cash) {
                this.money += this.moneyPerDeath;
                this.moneyText.text = '' + this.money;
            }
        }
    },

    loseFlag: function() {
        this.playerHealth--;
        this.hearts.getAt(this.playerHealth).frame = 35;
        if (this.playerHealth <= 0) {
            this.playerDied();
        }
    },

    playerCanTakeDamage: function(player) {
        return (player["noPain"] == 0);
    },

    playerDied: function() {
        this.infoText.visible = true;
        this.flag.frame = 35;

        this.gameOver = true;

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
        var corpse = this.corpses.create(creature.x, creature.y + 10, 'tiles');
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

    corpseCreatureCollision: function(corpse, creature) {
        if (creature.body.touching.up && corpse.body.touching.down) {

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
};