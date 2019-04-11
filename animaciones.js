function cargarAnimaciones(){
    Q.animations("player_anim", {
        run_right: { frames: [4,3,2,1], rate: 1/15},
        run_left: { frames: [17,16,15,14], rate: 1/15 },
        fire_right: { frames: [9,10,10], next: 'stand_right', rate: 1/30,
        trigger: "fired" },
        fire_left: { frames: [20,21,21], next: 'stand_left', rate: 1/30,
        trigger: "fired" },
        jump_right: { frames: [4], rate: 1/5 },
        jump_left: { frames: [18], rate: 1/5 },
        stand_right: { frames: [0], rate: 1/5 },
        stand_left: { frames: [14], rate: 1/5 },
        fall_right: { frames: [13], loop: false },
        fall_left: { frames: [12], loop: false }
    });
    Q.animations("Bloopa_anim", {
        swim: { frames: [1,0], rate: 8/15, next: 'static'},
        die:{frames: [0], rate: 10/15}
    });
    Q.animations('goomba_animation', {
        'walk': { frames: [0, 1], rate: 1/5 },
        'die': { frames: [2]}
    });
}