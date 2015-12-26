module.exports =
    turnNamespaceIntoPath: (namespace) ->
        return namespace.replace(/\\/g, '/')