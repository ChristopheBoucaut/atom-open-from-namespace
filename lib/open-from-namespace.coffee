OpenFromNamespaceView = require './open-from-namespace-view'
{CompositeDisposable} = require 'atom'

module.exports = OpenFromNamespace =
  openFromNamespaceView: null

  activate: (state) ->
    @openFromNamespaceView = new OpenFromNamespaceView(state.openFromNamespaceViewState)

  deactivate: ->
    @openFromNamespaceView.destroy()

  serialize: ->
    openFromNamespaceViewState: @openFromNamespaceView.serialize()
