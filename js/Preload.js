var PlatformerGame = PlatformerGame || {};

PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {

    preload: function() {
        // show preloadingbar
        this.preloadingbar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadingbar');
        this.preloadingbar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadingbar);

        // load game assets:
        this.load.tilemap('level1', 'assets/tilemaps/level4.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('sky', 'assets/images/sky.png');
        this.game.load.image('gameTiles', 'assets/images/grass2.png');
        
        this.game.load.spritesheet('tiles', 'assets/images/grass2.png', 70, 70, 14*9);
        this.game.load.spritesheet('caveman', 'assets/images/spritesheet_players.png', 128, 256, 8*8);
        this.game.load.spritesheet('tnt', 'assets/images/tnt.png', 70, 114, 3);

        this.game.load.audio('theme', 'assets/audio/Super_Mario_Bros_2_Gypsy_Jazz_OC_ReMix.mp3');

        this.game.load.image('ground', 'assets/images/platform.png');
        this.game.load.spritesheet('logo-tiles', 'assets/images/logo-tiles.png', 17, 16);

        },

    create: function() {
        this.state.start('Intro');
    }
};