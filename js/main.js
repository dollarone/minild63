var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(2500, 1260, Phaser.AUTO, 'LD33', null, false, false);

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Intro', PlatformerGame.Intro);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');