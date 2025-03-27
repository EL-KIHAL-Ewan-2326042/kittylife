export default class Cat {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.health = 100;
        this.fullness = 100;
        this.happiness = 100;
        this.lastUpdated = new Date().toISOString();
    }
}