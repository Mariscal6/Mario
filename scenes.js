function cargarEscenas() {

    Q.scene('endGame', function (stage) {
        var container = stage.insert(new Q.UI.Container({
            x: Q.width / 2,
            y: Q.height / 2,
            fill: "rgba(0,0,0,0.5)"
        }));
        var button = container.insert(new Q.UI.Button({
            x: 0,
            y: 0,
            fill: "#CCCCCC",
            label: "Play Again"
        }))
        var label = container.insert(new Q.UI.Text({
            x: 0,
            y: -15 - button.p.h,
            label: stage.options.label
        }));
        // When the button is clicked, clear all the stages
        // and restart the game.
        button.on("click", function () {
            Q.clearStages();
            Q.stageScene('level1');
            Q.stageScene("HUD", 1);
        });
        // Expand the container to visibily fit it's contents
        // (with a padding of 20 pixels)
        container.fit(20);
    });

    Q.scene('startScene', function (stage) {
        var behind = stage.insert(new Q.UI.Button({
            asset: 'maxresdefault.jpg',
            x: Q.width / 2,
            y: Q.height / 2,
            scaleToFit: true,
            scale: 2.85

        }))
        Q.input.on('confirm', function () {
            Q.clearStages();
            Q.stageScene('level1');
            Q.stageScene("HUD", 1);
        });
        var label = behind.insert(new Q.UI.Text({
            x: 0,
            y: 50,
            label: 'Press Enter or click to start',
            size: 12,
            color: '#000000'
        }));
        behind.on("click", function () {
            Q.clearStages();
            Q.stageScene('level1', 0);
            Q.stageScene("HUD", 1);
        });
        Q.state.set({ score: 0, lives: 1 });
    });
}