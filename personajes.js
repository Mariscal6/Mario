function cargarPesonajes() {

    Q.Sprite.extend("Player", {
        // the init constructor is called on creation
        init: function (p) {
            // You can call the parent's constructor with this._super(..)
            this._super(p, {
                sheet: "marioR", // Setting a sprite sheet sets sprite width and height
                sprite: "player_anim",
                x: 20, // You can also set additional properties that can
                y: 528, // be overridden on object creation
                dead: false,
                fallen: false,
                win:false
            });
            this.add('2d, platformerControls');
            this.add('animation');
            // Write event handlers to respond hook into behaviors.
            // hit.sprite is called everytime the player collides with a sprite
            Q.input.on("fire", this, "fire");
            this.on("hit.sprite", function (collision) {
                if (collision.obj.isA("Tower")) {
                    Q.stageScene("endGame", 1, {
                        label: "You Won!"
                    });
                    this.destroy();
                }
            });
        },
        fire: function () {
            var marios = Q("Player");
            marios.each(function () {
                this.p.hidden = !this.p.hidden;

            })
        },
        step: function (dt) {
            if(this.p.win){
                this.p.vx = 0;
            }
            else if (!this.p.dead) {
                if (this.p.y > 528 && this.p.y < 560) {
                    this.play("fall_left");
                    this.p.vx = 0;
                } else if (this.p.y > 560) {
                    this.p.vx = 0;
                    this.play("fall_left");
                    this.p.vy = -350;
                    this.p.dead = true;
                    this.p.fallen = true;
                } else if (this.p.vx > 0) {
                    this.play("run_right");
                } else if (this.p.vx < 0) {
                    this.play("run_left");
                } else if (this.p.vy < 0) {
                    this.play("jump_" + this.p.direction);
                }
                else {
                    this.play("stand_" + this.p.direction);
                }
            } else if (this.p.dead) {
                this.p.vx = 0;
                this.play("fall_left");
                if (this.p.y > 580 && this.p.fallen) {
                    this.fall();
                } else if (!this.p.fallen && this.p.vy >= 0) {
                    this.fall();
                }

            }
        },
        fall: function () {
            Q.audio.stop();
            Q.audio.play("music_die.mp3");
            Q.stageScene("endGame", 1, {
                label: "You Died"
            });
            this.destroy();
        },
        die: function () {
            this.play("fall_left");
            this.p.dead = true;
            this.p.vy = -300;
        },
        win: function () {
            Q.stageScene("endGame", 1, {
                label: "You Win"
            });
            this.p.win = true;
            this.p.vx = 0;
            this.play("stand_" + this.p.direction);
            Q.audio.stop();
            Q.audio.play('music_level_complete.mp3', { loop: true });
        }

    });

    Q.Sprite.extend("Princess", {
        init: function (p) {
            this._super(p, {
                sheet: 'princess',
                y: 400,
            });
            // Enemies use the Bounce AI to change direction
            // whenver they run into something.
            this.add('2d, aiBounce');
            this.add('animation');
            // Listen for a sprite collision, if it's the player,
            // end the game unless the enemy is hit on top
            this.on("bump.left,bump.right,bump.bottom,bump.top", function (collision) {
                if (collision.obj.isA("Player")) {
                    collision.obj.win();
                }
            });
        },
    });

    // ## Enemy Sprite
    Q.component('Enemy', {
        added: function() {
            this.entity.add('2d, aiBounce');
            this.entity.add('animation');

            this.entity.currentAnimation = "walk";
            this.entity.timeDead = 5;

            this.entity.on('bump.top', this, function (collision) {
                if (collision.obj.isA("Player")) { 
                    this.entity.p.vx=0;
                    //this.entity.p.dead=true;
                    //this.entity.destroy();
                    //
                    this.entity.currentAnimation = "die";
                    if(--this.entity.timeDead <= 0){
                        collision.obj.p.vy = -400;
                        this.entity.destroy();
                    }
                }
            });
            this.entity.on('bump.left, bump.right, bump.bottom', this, function (collision) {
                if (collision.obj.isA("Player") && !collision.obj.dead) {
                    collision.obj.die();
                }
            });
        },
    });
    // Create the Enemy class to add in some baddies
    Q.Sprite.extend("Goomba", {
        init: function (p) {
            this._super(p, {
                sheet: 'goomba',
                sprite: "goomba_animation",
                vx: 100,
                dead:false
            });
            this.add('Enemy');
        },
        step: function (dt) {
            this.play(this.currentAnimation);
        },

    });


    Q.Sprite.extend("Bloopa", {
        init: function (p) {
            this._super(p, {
                sheet: 'bloopa',
                y: 0,
                sin: 0,
                sin_dir: true,
                sprite: "Bloopa_anim",
                gravity: false,
                vy: 100
            });
            this.add('Enemy');
        },
        step: function (dt) {
            this.play("swim");
            this.p.x += Math.sin(this.p.sin);
            if (this.p.sin > 0.9 || this.p.sin < -0.9) {
                this.p.sin_dir = !this.p.sin_dir;
            }
            if (this.p.sin_dir) {
                this.p.sin += 0.01;
            } else {
                this.p.sin -= 0.01;
            }

            if (this.p.vy == 0) {
                this.p.vy = -100;
            } else if (this.p.y <= 20) {
                this.p.vy = 100;
            }

        }
    });

    Q.Sprite.extend("Coin", {
        init: function (p) {
            this._super(p, {
                sheet: 'coin',
                y: 400,
                gravity:false
            });
            // Enemies use the Bounce AI to change direction
            // whenver they run into something.
            this.add('2d');
            this.add('animation');
            this.add("tween");
            // Listen for a sprite collision, if it's the player,
            // end the game unless the enemy is hit on top
            this.on('bump.left,bump.top, bump.right, bump.bottom', this, function (collision) {
                if (collision.obj.isA("Player") && !collision.obj.dead) {
                Q.state.inc("score", 10);
                this.animate({ x: this.p.x, y: this.p.y-20, angle: 0},0.1,{callback :function(){this.destroy();}});
                Q.audio.play('coin.mp3');
            }
            });

        }
    });

}