const CompilerPassInterface = Jymfony.DependencyInjection.Compiler.CompilerPassInterface;
const Reference = Jymfony.DependencyInjection.Compiler.Reference;
const Container = Jymfony.DependencyInjection.Container;
const RuntimeException = Jymfony.DependencyInjection.Exception.RuntimeException;

/**
 * @memberOf Jymfony.DependencyInjection.Compiler
 * @type {Jymfony.DependencyInjection.Compiler.ResolveInvalidReferencesPass}
 */
module.exports = class ResolveInvalidReferencesPass extends implementationOf(CompilerPassInterface) {
    process(container) {
        this._container = container;

        for (let definition of container.getDefinitions()) {
            if (definition.isSynthetic() || definition.isAbstract()) {
                continue;
            }

            definition.setArguments(this._processArguments(definition.getArguments()));

            let calls = [];
            for (let call of definition.getMethodCalls()) {
                try {
                    calls.push([call[0], this._processArguments(call[1], true)]);
                } catch (e) {
                    // Call is removed
                }
            }

            definition.setMethodCalls(calls);

            let properties = {};
            for (let [name, value] of __jymfony.getEntries(definition.getProperties())) {
                try {
                    value = this._processArguments([value], true);
                    properties[name] = value[0];
                } catch (e) {
                    // Property ignored
                }
            }

            definition.setProperties(properties);
        }
    }

    _processArguments(arguments, inMethodCall, inCollection) {
        for (let [k, argument] of __jymfony.getEntries(arguments)) {
            if (isArray(argument) || isObjectLiteral(argument)) {
                arguments[k] = this._processArguments(argument, inMethodCall, true);
            } else if (argument instanceof Reference) {
                let id = argument.toString();
                let invalidBehavior = argument.invalidBehavior;
                let exists = this._container.has(id);

                if (!exists && invalidBehavior === Container.NULL_ON_INVALID_REFERENCE) {
                    arguments[k] = null;
                } else if (!exists && invalidBehavior === Container.IGNORE_ON_INVALID_REFERENCE) {
                    if (inCollection) {
                        if (isArray(arguments)) {
                            arguments.splice(k, 1);
                        } else {
                            delete arguments[k];
                        }
                        continue;
                    }

                    if (inMethodCall) {
                        throw new RuntimeException('Method shouldn\'t be called.');
                    }

                    arguments[k] = null;
                }
            }
        }

        return arguments;
    }
};
