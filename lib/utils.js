'use babel';

export default {
    turnNamespaceIntoPath: function (namespace) {
        return namespace.replace(/\\/g, '/');
    }
};
