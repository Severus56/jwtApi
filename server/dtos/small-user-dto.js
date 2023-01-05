module.exports = class SmallUserDto{
    id;

    constructor(model) {
        this.id = model._id;
    }
}