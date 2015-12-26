{SelectListView} = require 'atom-space-pen-views'
utils = require './utils'

module.exports =
class OpenFromNamespaceListView extends SelectListView
    initialize: ->
        super
        @panel ?= atom.workspace.addModalPanel(item: this, visible: false)

    viewForItem: (item) ->
        "<li>#{item}</li>"

    confirmed: (item) ->
        # Turn the namespace into a path
        path = utils.turnNamespaceIntoPath(item)
        # Copy the path
        atom.clipboard.write(path)
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
