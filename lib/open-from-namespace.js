'use babel';

import { CompositeDisposable } from 'atom';
import { OpenFromNamespaceListView } from './open-from-namespace-list-view';

const grammarScopes = ['text.html.php', 'source.php'];

var openFromNamespaceListView;
var commandSubscription;

export default {
    activate(state) {
        openFromNamespaceListView = new OpenFromNamespaceListView(state.openFromNamespaceListViewState);

        commandSubscription = atom.commands.add('atom-workspace', {'open-from-namespace:list-namespace': listNamespace});
    },

    serialize() {
        return {
            openFromNamespaceListViewState: openFromNamespaceListView.serialize()
        };
    },

    deactivate() {
        commandSubscription.dispose();
        openFromNamespaceListView.detach();
    }
};

/**
 * List all namespace in the current file.
 */
function listNamespace() {
    if (!checkIsPhp()) {
        return;
    }

    // Get the code.
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();

    // Find "use" in the code.
    var linesWithNamespaces = code.match(/\n\s*use\s*[^;]*/g);
    if (!linesWithNamespaces) {
        atom.notifications.addInfo('No namespace found');
        return;
    }

    // Extract namespace from the ligne.
    var listNamespaces = [];
    for (var i = 0; i < linesWithNamespaces.length; i++) {
        listNamespaces.push(extractNamespaceInUseLine(linesWithNamespaces[i]));
    }
    // Unique namespaces.
    listNamespaces = uniqueListNamespaces(listNamespaces);

    // Set list on the view and display the panel.
    openFromNamespaceListView.setItems(listNamespaces);
    if (!openFromNamespaceListView.panelIsVisible()) {
        openFromNamespaceListView.showPanel();
    }
}

/**
 * Check if the file is a PHP source.
 *
 * @return {Boolean}
 */
function checkIsPhp() {
    var editor = atom.workspace.getActiveTextEditor();

    if (grammarScopes.indexOf(editor.getGrammar().scopeName)) {
        atom.notifications.addWarning('This plugin work only on a PHP file.');

        return false;
    }

    return true;
}

/**
 * Extract the namespace from a line.
 *
 * @param {String} line
 *
 * @return {String}
 */
function extractNamespaceInUseLine(line) {
    // Remove return to the line and useless space and remove the "use".
    return line.replace(/[\n|\s|,]+/g, ' ').replace(/^\s*use\s*/, '').split(' ');
}

/**
 * Remove duplicate namespaces and return an array with one dimension.
 *
 * @param {Array} listNamespaces
 *
 * @return {Array}
 */
function uniqueListNamespaces(listNamespaces) {
    listNamespacesUnique = [];
    for (var i = 0; i < listNamespaces.length; i++) {
        if (listNamespaces[i] instanceof Array) {
            for (var j = 0; j < listNamespaces[i].length; j++) {
                if (listNamespacesUnique.indexOf(listNamespaces[i][j]) === -1) {
                    listNamespacesUnique.push(listNamespaces[i][j]);
                }
            }
        } else {
            // Just a string ?
            if (listNamespacesUnique.indexOf(listNamespaces[i]) === -1) {
                listNamespacesUnique.push(listNamespaces[i]);
            }
        }
    }

    return listNamespacesUnique;
}