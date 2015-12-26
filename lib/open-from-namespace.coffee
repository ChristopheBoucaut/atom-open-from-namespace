OpenFromNamespaceView = require './open-from-namespace-view'
{CompositeDisposable} = require 'atom'

module.exports = OpenFromNamespace =
    openFromNamespaceView: null
    commandSubscription: null
    listScopePhp: ['text.html.php', 'source.php']

    activate: (state) ->
        @openFromNamespaceView = new OpenFromNamespaceView(state.openFromNamespaceViewState)

        @commandSubscription = atom.commands.add 'atom-workspace',
            'open-from-namespace:list-namespace': => @listNamespace()

    deactivate: ->
        @commandSubscription.dispose()
        @openFromNamespaceView.destroy()

    serialize: ->
        openFromNamespaceViewState: @openFromNamespaceView.serialize()

    listNamespace: ->
        unless @checkIsPhp()
            return

    checkIsPhp: ->
        editor = atom.workspace.getActiveTextEditor()

        if @listScopePhp.indexOf(editor.getGrammar().scopeName) is -1
            alert('This plugin work only on a PHP file.')
            return false

        return true