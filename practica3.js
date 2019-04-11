var game = function () {
    // Set up an instance of the Quintus engine and include
    // the Sprites, Scenes, Input and 2D module. The 2D module
    // includes the `TileLayer` class as well as the `2d` componet.
    var Q = window.Q = Quintus({ development: true , audioSupported: ['mp3', 'ogg'] })
        .include("Sprites, Scenes, Input, 2D, Anim, Touch, UI, TMX, Audio")
        // Maximize this game to whatever the size of the browser is
        .setup("myGame",{
            maximize: true,
            width:800, 
            height:600, 
            scaleToFit: true
        })
        .enableSound().controls().touch();
        // And turn on default
       
   
    Q.scene("level1", function (stage) {
        Q.stageTMX("levelObject.tmx", stage);
        // Create the player and add them to the stage
        var player = stage.insert(new Q.Player());
        
        stage.add("viewport").follow(player,{x:true,y:false});
        stage.viewport.offsetX=-380;

        stage.insert(new Q.Bloopa({
            x: 700
        }));
        // Finally add in the tower goal
        stage.insert(new Q.Princess({
            x: 1500
        }));
        Q.audio.stop();
        Q.audio.play('music_main.mp3', { loop: true });
    });

    Q.scene("HUD", function (stage) {
          stage.insert(new Q.Score());
          /// Q.state.inc("score", 10);
    });
    // To display a game over / game won popup box,
    // create a endGame scene that takes in a `label` option
    // to control the displayed message
    /*Cambio de variables globales para el score*/
    Q.UI.Text.extend("Score", {
        init: function (p) {
            this._super({
                label: "score: 0",
                x: 100,
                y: 0
            });
            //stage.add("viewport").follow(player,{x:true,y:false});
            Q.state.on("change.score", this, "score");
        },
        score: function (score) {
            this.p.label = "score: " + score;
        }
    });
        
    // ## Asset Loading and Game Launch
    // Q.load can be called at any time to load additional assets
    // assets that are already loaded will be skipped
    // The callback will be triggered when everything is loaded
    //"sprites.png,"sprites.json"
    Q.load([ "level.json", "tiles.png", "bg.png",
             "mario_small.png","mario_small.json",
             "enemies/bloopa.gif","bloopa.json",
             "enemies/goomba.gif","goomba.json",
             "other/princess.gif","princess.json",
             "other/main_title.gif","other/splash_screen.jpg",
             'maxresdefault.jpg',"music_main.mp3",
             "coin.mp3","music_die.mp3","music_main.mp3",
             "coin.png","coin.json","music_level_complete.mp3"
            ], function () {
        // Sprites sheets can be created manually
        Q.sheet("tiles", "tiles.png", {
            tilew: 32,
            tileh: 32
        });

        Q.compileSheets("mario_small.png","mario_small.json");
        Q.compileSheets("enemies/bloopa.gif","bloopa.json");
        Q.compileSheets("enemies/goomba.gif","goomba.json");
        Q.compileSheets("other/princess.gif","princess.json");
        Q.compileSheets("coin.png","coin.json");
        cargarEscenas();
        cargarAnimaciones();
        cargarPesonajes();
        Q.stageScene("startScene", 0);
        
    });

    /*Q.loadTMX("level.tmx", function () {
        Q.stageScene("level1");
    });*/
    Q.loadTMX("levelObject.tmx", function () {
        Q.stageScene("level1");
    });
}
window.onload = game;