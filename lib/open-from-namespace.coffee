OpenFromNamespaceListView = require './open-from-namespace-list-view'
{CompositeDisposable} = require 'atom'

module.exports = OpenFromNamespace =
    openFromNamespaceView: null
    commandSubscription: null
    listScopePhp: ['text.html.php', 'source.php']

    activate: (state) ->
        @openFromNamespaceListView = new OpenFromNamespaceListView(state.openFromNamespaceListViewState)

        @commandSubscription = atom.commands.add 'atom-workspace',
            'open-from-namespace:list-namespace': => @listNamespace()

    deactivate: ->
        @commandSubscription.dispose()
        @openFromNamespaceListView.destroy()

    serialize: ->
        openFromNamespaceListViewState: @openFromNamespaceListView.serialize()

    listNamespace: ->
        unless @checkIsPhp()
            return

        # Get the code.
        editor = atom.workspace.getActiveTextEditor()
        code = editor.getText()

        # Find "use" and clean namespace and turn them into paths
        linesWithNamespaces = code.match(/\n\s*use\s*[^;]*/g)
        (@findNamespaceInUseLine line for line in linesWithNamespaces)
        listNamespaces = (@findNamespaceInUseLine line for line in linesWithNamespaces)
        listNamespaces = @normalizeListNamespaces(listNamespaces)

        @openFromNamespaceListView.setItems(listNamespaces)
        unless @openFromNamespaceListView.panelIsVisible()
            @openFromNamespaceListView.showPanel()

    checkIsPhp: ->
        editor = atom.workspace.getActiveTextEditor()

        if @listScopePhp.indexOf(editor.getGrammar().scopeName) is -1
            alert('This plugin work only on a PHP file.')
            return false

        return true

    findNamespaceInUseLine: (line) ->
        # Remove return to the line and useless space and remove the "use".
        return line.replace(/[\n|\s|,]+/g, ' ').replace(/^\s*use\s*/, '').split(' ')

    normalizeListNamespaces: (listNamespaces) ->
        listNamespacesUnique = [];
        for key, namespaces of listNamespaces
            if namespaces instanceof Array
                for keyInNamespaces, namespace of namespaces
                    if listNamespacesUnique.indexOf(namespace) is -1
                        listNamespacesUnique.push(namespace)
            else
                # Just a string ?
                if listNamespacesUnique.indexOf(namespaces) is -1
                    listNamespacesUnique.push(namespaces)

        return listNamespacesUnique