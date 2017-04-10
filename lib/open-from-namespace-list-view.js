'use babel';

import { SelectListView } from 'atom-space-pen-views';
import utils from './utils';

class OpenFromNamespaceListView extends SelectListView {
    construct() {
        this.panel = null;
    }

    initialize() {
        super.initialize();
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({item: this, visible: false});
        }
    }

    viewForItem(item) {
        return "<li>"+item+"</li>";
    }

    confirmed(item) {
        // Turn the namespace into a path.
        var path = utils.turnNamespaceIntoPath(item);
        // Copy the path.
        atom.clipboard.write(path);
        // Hide panel.
        this.panel.hide();
        // Open the fuzzy-finder package.
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'fuzzy-finder:toggle-file-finder');
    }

    cancelled() {
        if (this.panelIsVisible()) {
            this.panel.hide();
        }
    }

    panelIsVisible() {
        return this.panel.isVisible();
    }

    showPanel() {
        this.panel.show();
        this.focusFilterEditor();
    }
}

export default {OpenFromNamespaceListView: OpenFromNamespaceListView};
