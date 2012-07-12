/* From Backbone.js on Rails */

if (!window.Support) {
    Support = {};
}

Support.CompositeView = function (options) {
    this.children = _([]);
    this.objectEventBindings = _([]);
    Backbone.View.apply(this, [options]);
};

_.extend(Support.CompositeView.prototype, Backbone.View.prototype, {

    leave:function (leaveInDom) {
        //sometimes leave is bound to event handlers
        //we don't want event argument mistaken for leaveInDom
        if (leaveInDom != true) leaveInDom = false;
        this.unbindObjectEventBindings();
        this.unbind();
        if (leaveInDom) {
            this.$el.hide();
        } else {
            this.remove();
        }
        this.leaveChildren(leaveInDom);
        this._removeFromParent();
    },

    renderChild:function (view) {
        view.render();
        this.children.push(view);
        view.parent = this;
    },

    appendChild:function (view) {
        this.renderChild(view);
        $(this.el).append(view.el);
    },

    renderChildInto:function (view, container) {
        this.renderChild(view);
        this.$(container).empty().append(view.el);
    },

    appendChildTo:function (view, container) {
        this.renderChild(view);
        this.$(container).append(view.el);
    },

    leaveChildren:function (leaveInDom) {
        if (leaveInDom == null) leaveInDom = false;
        this.children.chain().clone().each(function (view) {
            if (view.leave)
                view.leave(leaveInDom);
        });
    },

    bindEvent:function (object, event, callback) {
        this.objectEventBindings.push([object, event, callback]);
        object.bind(event, callback, this);
    },

    unbindObjectEventBindings:function () {
        var self = this;
        this.objectEventBindings.chain().clone().each(function (binding) {
            binding[0].unbind(binding[1], binding[2], self);
        });
    },

    _removeFromParent:function () {
        if (this.parent)
            this.parent._removeChild(this);
    },

    _removeChild:function (view) {
        var index = this.children.indexOf(view);
        this.children.splice(index, 1);
    }
});

Support.CompositeView.extend = Backbone.View.extend;
