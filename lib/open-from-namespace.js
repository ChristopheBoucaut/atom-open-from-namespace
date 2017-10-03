'use babel';

import { CompositeDisposable } from 'atom';
import { OpenFromNamespaceListView } from './open-from-namespace-list-view';
import {$} from 'atom-space-pen-views';
import utils from './utils';

const grammarScopes = ['text.html.php', 'source.php'];

var openFromNamespaceListView;
var commandSubscription;

export default {
    activate(state) {
        openFromNamespaceListView = new OpenFromNamespaceListView(state.openFromNamespaceListViewState);

        commandSubscription = atom.commands.add('atom-workspace', {'open-from-namespace:list-namespace': listNamespace});

        // Add event on ctrl+click on namespace.
        atom.workspace.observeTextEditors(function (editor) {
            if (!checkIsPhp(editor)) {
                return;
            }
            var editorView = atom.views.getView(editor);
            $(editorView).on('click', '.syntax--use', function (e) {
                if (e.altKey) {
                    var namespace = buildNamespaceFromTokenizedLine(editor.tokenizedBuffer.tokenizedLines[$(this).parents('.line').data('screen-row')]);
                    if (namespace) {
                        utils.openFileFromNamespace(namespace);
                    }
                }
            });
        });
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
        atom.notifications.addWarning('This plugin work only on a PHP file.');

        return;
    }

    // Get the code.
    var editor = atom.workspace.getActiveTextEditor();
    var code = editor.getText();

    var listNamespaces = [];
    for (var p = 0; p < editor.tokenizedBuffer.tokenizedLines.length; p++) {
        var namespace = buildNamespaceFromTokenizedLine(editor.tokenizedBuffer.tokenizedLines[p]);

        // This line has a namespace.
        if (namespace) {
            listNamespaces.push(namespace);
        }
    }

    if (!listNamespaces.length) {
        atom.notifications.addInfo('No namespace found');
        return;
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
 * @param {TextEditor} editor [Optional] TextEditor object to test every editor and not just the focus panel.
 *
 * @return {Boolean}
 */
function checkIsPhp(editor) {
    editor = editor ? editor : atom.workspace.getActiveTextEditor();

    return grammarScopes.indexOf(editor.getGrammar().scopeName) !== -1;
}

/**
 * Build a namespace from tokens on a line.
 *
 * @param {TokenizedLine} tokenizedLine
 *
 * @return {String}
 */
function buildNamespaceFromTokenizedLine(tokenizedLine) {
    var namespace = '';
    // For all lines, we search namespace used in their tokens.
    for (var it = 0; it < tokenizedLine.tokens.length; it++) {
        if (tokenizedLine.tokens[it].scopes.indexOf('meta.use.php') !== -1 &&
            (
                tokenizedLine.tokens[it].scopes.indexOf('support.other.namespace.php') !== -1 ||
                tokenizedLine.tokens[it].scopes.indexOf('support.class.php') !== -1
            )
        ) {
            namespace += tokenizedLine.tokens[it].value;
        }
    }

    // The full namespace.
    return namespace;
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
