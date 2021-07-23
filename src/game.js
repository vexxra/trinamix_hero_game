const { Monster, Player } = require('./units.js');


class Game {
    input = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })

    player;
    monsters = [];

    // Tracks the time for monster attacks
    lastLoopDate;
    // Monster timer
    intervalTimer;
    // To stop the user input loop
    userInputPromise;

    initialize() {
        this.player = new Player("Hero", 40, 2);
        this.monsters.push(new Monster("Orc", 7, 1, 1500));
        this.monsters.push(new Monster("Dragon", 20, 3, 2000));
    }

    async run() {
        this.lastLoopDate = new Date();
        this.intervalTimer = setInterval(() => {
            const currentLoop = new Date();
            this.tickMonsters(currentLoop - this.lastLoopDate);
            this.lastLoopDate = currentLoop;
            this.checkEndCondition();
        }, 100);

       
        await this.initProcessInput();
    }

    initProcessInput() {
        return new Promise((resolve, reject) => {
            this.userInputPromise = resolve;

            this.input.prompt();
            this.input.on('line', input => {
                this.player.processInput(input, this.monsters);
                this.clearDeadMonsters();
                if(!this.checkEndCondition()) {
                    this.input.prompt();
                }
            });
        });
    }

    tickMonsters(miliseconds) {
        this.monsters.forEach(monster => {
            monster.tick(miliseconds, this.player);
        });
    }

    clearDeadMonsters() {
        this.monsters = this.monsters.filter(monster => monster.isAlive());
    }

    endGame() {
        clearInterval(this.intervalTimer);
        this.userInputPromise();
        this.input.close();
    }

    checkEndCondition() {
        if (!this.monsters.some(monster => monster.isAlive())) {
            console.log("You win");
            this.endGame();
            return true;
        } else if (!this.player.isAlive()) {
            console.log("You lose");
            this.endGame();
            return true;
        } else {
            return false;
        }
    }
}

exports.Game = Game;