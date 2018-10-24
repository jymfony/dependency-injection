const Container = Jymfony.Component.DependencyInjection.Container;
const LogicException = Jymfony.Component.DependencyInjection.Exception.LogicException;
const FrozenParameterBag = Jymfony.Component.DependencyInjection.ParameterBag.FrozenParameterBag;
const RewindableGenerator = Jymfony.Component.DependencyInjection.Argument.RewindableGenerator;

class ProjectContainer extends Jymfony.Component.DependencyInjection.Container {
    __construct(buildParameters = {}) {
        super.__construct(new FrozenParameterBag(Object.assign({}, ProjectContainer._getDefaultsParameters(), buildParameters)));

        this._methodMap = {
        };

        this._aliases = {
        };

        this._privates = {};
    }

    compile() {
        throw new LogicException('You cannot compile a dumped container');
    }

    get frozen() {
        return true;
    }

    static _getDefaultsParameters() {
        return {
            "foo": "bar",
            "baz": "bar",
            "bar": "foo is %foo bar",
            "escape": "@escapeme",
            "values": [true,false,null,0,1000.3,"true","false","null"],
        };
    }
}

module.exports = ProjectContainer;
