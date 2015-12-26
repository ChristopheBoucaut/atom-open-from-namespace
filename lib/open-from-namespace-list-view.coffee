{SelectListView} = require 'atom-space-pen-views'

module.exports =
class OpenFromNamespaceListView extends SelectListView
    initialize: ->
        super
        @panel ?= atom.workspace.addModalPanel(item: this, visible: false)

    viewForItem: (item) ->
        "<li>#{item}</li>"

    confirmed: (item) ->
        # Copy the path
        atom.clipboard.write(item)
        # Hide panel
        @panel.hide()
        # Open the fuzzy-finder package
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'fuzzy-finder:toggle-file-finder')
        # @TODO : Find a way to "copy" the path in the fuzzy-finder modal.

    cancelled: ->
        if @panel.isVisible()
            @panel.hide()

    panelIsVisible: ->
        return @panel.isVisible()

    showPanel: ->
        @panel.show()
        @focusFilterEditor()
