var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(1600, 960, Phaser.AUTO, 'LD33', null, false, false);

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');