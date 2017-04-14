'use babel';

export default {
    turnNamespaceIntoPath: function (namespace) {
        return namespace.replace(/\\/g, '/');
    },

    /**
     * Try to open a file from this namespace.
     * WIP: Don't use file finder ?
     *
     * @param {String} namespace
     */
    openFileFromNamespace: function (namespace) {
        var path = this.turnNamespaceIntoPath(namespace);
        atom.clipboard.write(path);
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'fuzzy-finder:toggle-file-finder');
    }
};
