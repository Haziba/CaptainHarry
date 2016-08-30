var menuState = {
  preload: function(){
    game.load.spritesheet('start_button', 'imgs/start_button_sprite_sheet.png', 200, 75);
  },

  create: function(){
    var titleText = game.add.text(0, 0, 'Learning Phaser.IO\nwith Tech Nottigham',
      {
        font: '50px Arial',
        fill: '#ffffff',
        boundsAlignH: 'center',
      });

    // Set the text's bounding box to centre it
    titleText.setTextBounds(0, 80, 800, 50);

    var startLabel = game.add.text(0, 0, 'Click to Start to begin',
      {
        font: '25px Arial',
        fill: '#ffffff',
        boundsAlignH: 'center',
      });

    startLabel.setTextBounds(0, game.world.height / 2, game.world.width, 100);

    // Add a button in the given position, with the sprite 'start_button', and when clicked call `this.start()`,
    // use frame 1 for mouse-over, use frame 1 for mouse-out, use frame 0 for mouse-down
    var startButton = game.add.button(game.world.centerX - 100, game.world.height / 2 + 100, 'start_button', this.start, this, 1, 1, 0);
  },

  start: function(){
    game.state.start('play');
  }
}
