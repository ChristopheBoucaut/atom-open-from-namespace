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
        console.log 'List namespace'
        @checkIsPhp()

    checkIsPhp: ->
        editor = atom.workspace.getActiveTextEditor()
        console.log editor.getGrammar().scopeName
        console.log @listScopePhp
        console.log @listScopePhp.indexOf editor.getGrammar().scopeName

        if @listScopePhp.indexOf editor.getGrammar().scopeName == -1
            # alert ('this is not a PHP file')
            console.log 'this is not a PHP file'
            return

        console.log 'this is a PHP file'