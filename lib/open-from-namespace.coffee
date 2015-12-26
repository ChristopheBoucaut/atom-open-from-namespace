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

        # Get the code.
        editor = atom.workspace.getActiveTextEditor()
        code = editor.getText()

        # Find "use" and clean namespace and turn them into paths
        linesWithNamespaces = code.match(/\n\s*use\s*[^;]*/g)
        (@findNamespaceInUseLine line for line in linesWithNamespaces)
        listNamespaces = (@findNamespaceInUseLine line for line in linesWithNamespaces)
        listNamespaces = @formatListNamespacesAndTransform(listNamespaces)

    checkIsPhp: ->
        editor = atom.workspace.getActiveTextEditor()

        if @listScopePhp.indexOf(editor.getGrammar().scopeName) is -1
            alert('This plugin work only on a PHP file.')
            return false

        return true

    findNamespaceInUseLine: (line) ->
        # Remove return to the line and useless space and remove the "use".
        return line.replace(/[\n|\s|,]+/g, ' ').replace(/^\s*use\s*/, '').split(' ')

    formatListNamespacesAndTransform: (listNamespaces) ->
        listNamespacesUnique = [];
        for key, namespaces of listNamespaces
            if namespaces instanceof Array
                for keyInNamespaces, namespace of namespaces
                    namespace = @turnNamespaceIntoPath(namespace)
                    if listNamespacesUnique.indexOf(namespace) is -1
                        listNamespacesUnique.push(namespace)
            else
                # Just a string ?
                namespace = @turnNamespaceIntoPath(namespaces)
                if listNamespacesUnique.indexOf(namespace) is -1
                    listNamespacesUnique.push(namespace)

        return listNamespacesUnique

    turnNamespaceIntoPath: (namespace) ->
        return namespace.replace(/\\/g, '/')