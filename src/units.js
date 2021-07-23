class Unit {
    name;
    hitpoints;
    damage;

    isAlive() {
        return this.hitpoints > 0;
    }

    attack(unit) {
        unit.hitpoints -= this.damage;
        let result = `${this.name} attacks ${unit.name} for ${this.damage.toString()} damage. `;
        if (unit.hitpoints > 0) {
            result += `${unit.hitpoints} hitpoints remaining.`;
        } else {
            result += `${unit.name} dies.`
        }
        console.log(result);
    };
}

class Monster extends Unit {
    attackCD;
    attackTime = 0;

    constructor(name, hitpoints, damage, attackCD) {
        super();

        this.name = name;
        this.hitpoints = hitpoints;
        this.damage = damage;
        this.attackCD = attackCD;
    }

    tick(miliseconds, hero) {
        this.attackTime += miliseconds;
        if (this.attackTime >= this.attackCD) {
            this.attack(hero);
            this.attackTime = 0;
        }
    }
}

class Player extends Unit {
    constructor(name, hitpoints, damage) {
        super();

        this.name = name;
        this.hitpoints = hitpoints;
        this.damage = damage;
    }

    processInput(input, monsters) {
        const splitInput = input.split(' ');
        if (splitInput.length === 2 && splitInput[0] === 'attack') {
            monsters.some(monster => {
                if (monster.name.toLowerCase() === splitInput[1].toLowerCase()) {
                    this.attack(monster);
                    return true;
                }
                return false;
            });
        }
    }
}

exports.Monster = Monster;
exports.Player = Player;