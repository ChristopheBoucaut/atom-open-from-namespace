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
        // Hide panel.
        this.panel.hide();
        utils.openFileFromNamespace(item);
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
