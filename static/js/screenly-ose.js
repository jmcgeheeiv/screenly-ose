// Generated by CoffeeScript 1.4.0

/* screenly-ose ui
*/


(function() {
  var API, App, Asset, AssetModalView, AssetRowView, Assets, AssetsView, D, d2iso, d2s, d2time, d2ts, now, year2ts, years_from_now, _pd, _tpl,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice;

  API = (window.Screenly || (window.Screenly = {}));

  D = function(d) {
    return new Date(d);
  };

  now = function() {
    return new Date();
  };

  API.d2iso = d2iso = function(d) {
    return (D(d)).toISOString();
  };

  API.d2s = d2s = function(d) {
    return (D(d)).toLocaleString();
  };

  API.d2time = d2time = function(d) {
    return (D(d)).toLocaleTimeString();
  };

  API.d2ts = d2ts = function(d) {
    return (D(d)).getTime();
  };

  year2ts = function(years) {
    return years * 365 * 24 * 60 * 60000;
  };

  years_from_now = function(years) {
    return D((year2ts(years)) + d2ts(now()));
  };

  _tpl = function(name) {
    return _.template(($("#" + name + "-template")).html());
  };

  _pd = function(e) {
    e.preventDefault();
    return false;
  };

  Backbone.emulateJSON = true;

  Asset = (function(_super) {

    __extends(Asset, _super);

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.idAttribute = "asset_id";

    return Asset;

  })(Backbone.Model);

  Assets = (function(_super) {

    __extends(Assets, _super);

    function Assets() {
      return Assets.__super__.constructor.apply(this, arguments);
    }

    Assets.prototype.url = "/api/assets";

    Assets.prototype.model = Asset;

    return Assets;

  })(Backbone.Collection);

  AssetModalView = (function(_super) {

    __extends(AssetModalView, _super);

    function AssetModalView() {
      this.submit = __bind(this.submit, this);

      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);

      this.$fv = __bind(this.$fv, this);

      this.$f = __bind(this.$f, this);
      return AssetModalView.__super__.constructor.apply(this, arguments);
    }

    AssetModalView.prototype.$f = function(field) {
      return this.$("[name='" + field + "']");
    };

    AssetModalView.prototype.$fv = function() {
      var field, val, _ref;
      field = arguments[0], val = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return (_ref = this.$f(field)).val.apply(_ref, val);
    };

    AssetModalView.prototype.initialize = function(options) {
      this.tpl = _tpl('asset-modal');
      ($('body')).append(this.render().el);
      return (this.$el.children(":first")).modal();
    };

    AssetModalView.prototype.render = function() {
      var field, which, _i, _j, _len, _len1, _ref, _ref1;
      this.$el.html(this.tpl());
      (this.$("input.date")).datepicker({
        autoclose: true
      });
      (this.$('input.time')).timepicker({
        minuteStep: 5,
        defaultTime: 'current',
        showInputs: true,
        disableFocus: true,
        showMeridian: true
      });
      (this.$('#modalLabel')).text((this.model ? "Edit Asset" : "Add Asset"));
      if (this.model) {
        (this.$("form")).attr("action", this.model.url());
        _ref = 'name uri duration mimetype'.split(' ');
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          field = _ref[_i];
          this.$fv(field, this.model.get(field));
        }
        _ref1 = ['start', 'end'];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          which = _ref1[_j];
          (this.$f("" + which + "_date_date")).datepicker('update', this.model.get("" + which + "_date"));
          this.$fv("" + which + "_date_time", d2time(this.model.get("" + which + "_date")));
        }
      } else {
        (this.$("input.date")).datepicker('update', new Date());
      }
      return this;
    };

    AssetModalView.prototype.events = {
      'click #submit-button': 'submit'
    };

    AssetModalView.prototype.submit = function(e) {
      var which, _i, _len, _ref;
      _ref = ['start', 'end'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        which = _ref[_i];
        this.$fv("" + which + "_date", d2iso((this.$fv("" + which + "_date_date")) + " " + (this.$fv("" + which + "_date_time"))));
      }
      return (this.$("form")).submit();
    };

    return AssetModalView;

  })(Backbone.View);

  AssetRowView = (function(_super) {

    __extends(AssetRowView, _super);

    function AssetRowView() {
      this["delete"] = __bind(this["delete"], this);

      this.edit = __bind(this.edit, this);

      this.toggleActive = __bind(this.toggleActive, this);

      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);
      return AssetRowView.__super__.constructor.apply(this, arguments);
    }

    AssetRowView.prototype.tagName = "tr";

    AssetRowView.prototype.initialize = function(options) {
      return this.tpl = _tpl('asset-row');
    };

    AssetRowView.prototype.render = function() {
      this.$el.html(this.tpl(this.model.toJSON()));
      (this.$(".toggle input")).prop("checked", this.model.get('is_active'));
      (this.$("#delete-asset-button")).popover({
        html: true,
        placement: 'left',
        title: "Are you sure?",
        content: _tpl('confirm-delete')
      });
      return this;
    };

    AssetRowView.prototype.events = {
      'click #activation-toggle': 'toggleActive',
      'click #edit-asset-button': 'edit',
      'click #confirm-delete': 'delete'
    };

    AssetRowView.prototype.toggleActive = function(e) {
      var _this = this;
      console.log('toggleactive', e);
      if (this.model.get('is_active')) {
        this.model.set({
          is_active: false,
          end_date: d2iso(now())
        });
      } else {
        this.model.set({
          is_active: true,
          start_date: d2iso(now()),
          end_date: d2iso(years_from_now(10))
        });
      }
      this.model.save();
      (this.$(".toggle input")).prop("checked", this.model.get('is_active'));
      setTimeout((function() {
        return _this.remove();
      }), 300);
      return _pd(e);
    };

    AssetRowView.prototype.edit = function(e) {
      new AssetModalView({
        model: this.model
      });
      return _pd(e);
    };

    AssetRowView.prototype["delete"] = function(e) {
      var _this = this;
      (this.$("#delete-asset-button")).popover('hide');
      this.model.destroy().done(function() {
        return _this.remove();
      });
      return _pd(e);
    };

    return AssetRowView;

  })(Backbone.View);

  AssetsView = (function(_super) {

    __extends(AssetsView, _super);

    function AssetsView() {
      this.render = __bind(this.render, this);

      this.initialize = __bind(this.initialize, this);
      return AssetsView.__super__.constructor.apply(this, arguments);
    }

    AssetsView.prototype.initialize = function(options) {
      var event, _i, _len, _ref,
        _this = this;
      _ref = ['reset', 'add'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        event = _ref[_i];
        this.collection.bind(event, this.render);
      }
      return this.collection.bind('change', function(model) {
        return setTimeout((function() {
          return _this.render(_([model]));
        }), 300);
      });
    };

    AssetsView.prototype.render = function(models) {
      var _this = this;
      if (models == null) {
        models = this.collection;
      }
      console.log(models);
      models.each(function(model) {
        var which;
        which = model.get('is_active') ? 'active' : 'inactive';
        return (_this.$("#" + which + "-assets")).append((new AssetRowView({
          model: model
        })).render().el);
      });
      return this;
    };

    return AssetsView;

  })(Backbone.View);

  API.app = App = (function(_super) {

    __extends(App, _super);

    function App() {
      this.add = __bind(this.add, this);

      this.initialize = __bind(this.initialize, this);
      return App.__super__.constructor.apply(this, arguments);
    }

    App.prototype.initialize = function() {
      (API.assets = new Assets()).fetch();
      API.assetsView = new AssetsView({
        collection: API.assets,
        el: this.$('#assets')
      });
      return this;
    };

    App.prototype.events = {
      'click #add-asset-button': 'add'
    };

    App.prototype.add = function(e) {
      new AssetModalView();
      return _pd(e);
    };

    return App;

  })(Backbone.View);

  jQuery(function() {
    return new App({
      el: $('body')
    });
  });

}).call(this);
