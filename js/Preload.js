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
        this.game.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
        
        this.game.load.image('heart', 'assets/images/heart.png');
        this.game.load.spritesheet('objects', 'assets/images/objects.png', 16, 16, 16);
        this.game.load.spritesheet('tiles', 'assets/images/tiles_spritesheet.png', 72, 72, 13*13);
        this.game.load.spritesheet('caveman', 'assets/images/spritesheet_players.png', 128, 256, 8*8);

        //this.game.load.audio('theme', 'assets/audio/theme.ogg');
        },

    create: function() {
        this.state.start('Game');
    }
};