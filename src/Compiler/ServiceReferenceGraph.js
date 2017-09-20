const ServiceReferenceGraphEdge = Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphEdge;
const ServiceReferenceGraphNode = Jymfony.Component.DependencyInjection.Compiler.ServiceReferenceGraphNode;

/**
 * Graph representation of services
 *
 * Use this in compiler passes instead of collecting these info
 * in every pass
 *
 * @memberOf Jymfony.Component.DependencyInjection.Compiler
 * @internal
 */
module.exports = class ServiceReferenceGraph {
    __construct() {
        this.clear();
    }

    hasNode(id) {
        return this._nodes[id] !== undefined;
    }

    getNode(id) {
        if (! this._nodes[id]) {
            throw new InvalidArgumentException(`There is no node with id "${id}"`);
        }

        return this._nodes[id];
    }

    getNodes() {
        return Object.assign({}, this._nodes);
    }

    clear() {
        this._nodes = {};
    }

    connect(sourceId, sourceValue, destId, destValue = null, reference = null) {
        const sourceNode = this._createNode(sourceId, sourceValue);
        const destNode = this._createNode(destId, destValue);
        const edge = new ServiceReferenceGraphEdge(sourceNode, destNode, reference);

        sourceNode.addOutEdge(edge);
        destNode.addInEdge(edge);
    }

    _createNode(id, value) {
        if (this._nodes[id] && this._nodes[id].getValue() === value) {
            return this._nodes[id];
        }

        return this._nodes[id] = new ServiceReferenceGraphNode(id, value);
    }
};
