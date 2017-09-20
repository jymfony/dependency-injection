const AbstractRecursivePass = Jymfony.Component.DependencyInjection.Compiler.AbstractRecursivePass;
const Definition = Jymfony.Component.DependencyInjection.Definition;
const ParameterNotFoundException = Jymfony.Component.DependencyInjection.Exception.ParameterNotFoundException;

/**
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 */
class ResolveParameterPlaceHoldersPass extends AbstractRecursivePass {
    process(container) {
        /**
         * @type {Jymfony.Component.DependencyInjection.ParameterBag.ParameterBag}
         * @private
         */
        this._bag = container.parameterBag;

        try {
            super.process(container);

            const aliases = {};
            for (const [ name, target ] of __jymfony.getEntries(container.getAliases())) {
                this._currentId = name;
                aliases[this._bag.resolveValue(name)] = this._bag.resolveValue(target);
            }

            container.setAliases(aliases);
        } catch (e) {
            if (e instanceof ParameterNotFoundException) {
                e.sourceId = this._currentId;
            }

            throw e;
        }

        this._bag.resolve();
        this._bag = undefined;
    }

    _processValue(value, isRoot = false) {
        if (isString(value)) {
            return this._bag.resolveValue(value);
        }

        if (value instanceof Definition) {
            const changes = value.getChanges();
            if (changes['class']) {
                value.setClass(this._bag.resolveValue(value.getClass()));
            }
            if (changes['file']) {
                value.setFile(this._bag.resolveValue(value.getFile()));
            }
        }

        value = super._processValue(value, isRoot);

        if (isObjectLiteral(value)) {
            const res = {};
            for (const [ k, v ] of __jymfony.getEntries(value)) {
                res[this._bag.resolveValue(k)] = v;
            }

            value = res;
        }

        return value;
    }
}

module.exports = ResolveParameterPlaceHoldersPass;
