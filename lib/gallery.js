
var Gallery = (function() {
	'use strict';

	/**
	 * Utils
	 */

	function toEl(html) {
		var el = document.createElement('div');
		el.innerHTML = html;
		return el.firstElementChild;
	}

	function paneHTML(index) {
		return '<div class="gallery-pane" data-index="' + index + '"></div>';
	}

	/**
	 * Pane
	 */

	var Pane = function(options) {
		this.gallery = options.gallery;
		this.index = options.index;
		this.el = toEl(paneHTML(this.index));

	};

	Pane.prototype.id = function(id) {
		if (!id) return this.id;

		delete this.gallery.ids[this.id];
		this.gallery.ids[id] = this;
		this.id = id;

		return this;
	};

	Pane.prototype.content = function(content) {
		if ('string' === typeof content) {
			this.el.innerHTML = content;
		} else {
			this.el.innerHTML = '';
			this.el.appendChild(content);
		}
	};

	Pane.prototype.setTransform = function() {
		var offset = this.index - this.gallery.center;
		var x = (offset * 100) + '%';

		if (this.transition) this.el.style.WebkitTransition = 'all 1000ms';
		else this.el.style.WebkitTransition = '';

		this.el.style.WebkitTransform = 'translateX(' + x + ')';

		return this;
	};

	Pane.prototype.show = function(options) {
		this.gallery.show(this.index, options);
	};

	/**
	 * Gallery
	 */

	var Gallery = function(options) {
		var container = options && options.container || document.body;
		var pane;

		this.length = options && options.panes || 3;
		this.panes = [];
		this.ids = {};
		this.center = Math.ceil(this.length / 2) - 1;

		for (var i = 0; i < this.length; i++) {
			pane = new Pane({ gallery: this, index: i });
			container.appendChild(pane.el);
			this.panes.push(pane);
		}

		this.adjust(0, { instant: true });
	};

	Gallery.prototype.id = function(id) {
		return this.ids[id];
	};

	Gallery.prototype.show = function(index, options) {
		var pane = this.panes[index];
		var offset = 0 - (pane.index - this.center);
		if (!offset) return;

		this.adjust(offset, options);
		return this;
	};

	Gallery.prototype.pane = Gallery.prototype.index = function(index) {
		return this.panes[index];
	};

	Gallery.prototype.next = function() {
		return this.panes[this.center + 1];
	};

	Gallery.prototype.prev = function() {
		return this.panes[this.center - 1];
	};

	Gallery.prototype.adjust = function(offset, options) {
		var instant = options && options.instant;
		var panes = this.panes;
		var newIndex;
		var start = [];
		var mid = [];
		var end = [];

		for (var i = 0; i < this.length; i++) {
			newIndex = i + offset;
			if (newIndex < 0) {
				end.push(panes[i]);
				panes[i].transition = false;
			} else if (newIndex > this.length-1) {
				start.push(panes[i]);
				panes[i].transition = false;
			} else {
				mid.push(panes[i]);
				if (!instant) panes[i].transition = true;
			}
		}

		this.panes = start.concat(mid, end);
		this.updateIndexes();
		this.transform();

		return this;
	};

	Gallery.prototype.transform = function() {
		for (var i = 0, l = this.length; i < l; i++) {
			this.panes[i].setTransform();
		}

		return this;
	};

	Gallery.prototype.updateIndexes = function() {
		for (var i = 0, l = this.length; i < l; i++) {
			this.panes[i].index = i;
		}

		return this;
	};

	return Gallery;
})();