const Container = Jymfony.DependencyInjection.Container;

/**
 * @memberOf Jymfony.DependencyInjection
 * @type {Jymfony.DependencyInjection.Reference}
 */
module.exports = class Reference {
    constructor(id, invalidBehavior = Container.EXCEPTION_ON_INVALID_REFERENCE) {
        this._id = id.toLowerCase();
        this._invalidBehavior = invalidBehavior;
    }

    toString() {
        return this._id;
    }

    get invalidBehavior() {
        return this._invalidBehavior;
    }
};
