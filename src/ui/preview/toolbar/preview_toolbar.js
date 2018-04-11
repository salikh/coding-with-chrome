/**
 * @fileoverview Editor for the Coding with Chrome editor.
 *
 * @license Copyright 2015 The Coding with Chrome Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author mbordihn@google.com (Markus Bordihn)
 */

goog.provide('cwc.ui.PreviewToolbar');

goog.require('cwc.soy.ui.PreviewToolbar');
goog.require('cwc.ui.Helper');
goog.require('cwc.utils.Helper');

goog.require('goog.dom.classlist');


/**
 * @constructor
 * @param {!cwc.utils.Helper} helper
 * @struct
 * @final
 */
cwc.ui.PreviewToolbar = function(helper) {
  /** @type {!cwc.utils.Helper} */
  this.helper = helper;

  /** @type {string} */
  this.prefix = this.helper.getPrefix('preview-toolbar');

  /** @type {Element} */
  this.node = null;

  /** @type {Element} */
  this.nodeAutoReload = null;

  /** @type {Element} */
  this.nodeExpand = null;

  /** @type {Element} */
  this.nodeExpandExit = null;

  /** @type {Element} */
  this.nodeRefresh = null;

  /** @type {Element} */
  this.nodeReload = null;

  /** @type {boolean} */
  this.autoUpdateState = false;

  /** @type {boolean} */
  this.expandState = false;
};


/**
 * @param {Element} node
 */
cwc.ui.PreviewToolbar.prototype.decorate = function(node) {
  this.node = node;

  // Render editor toolbar.
  goog.soy.renderElement(
    this.node,
    cwc.soy.ui.PreviewToolbar.template, {
      prefix: this.prefix,
    }
  );

  this.nodeAutoReload = goog.dom.getElement(this.prefix + 'auto-reload');
  this.nodeExpand = goog.dom.getElement(this.prefix + 'expand');
  this.nodeExpandExit = goog.dom.getElement(this.prefix + 'expand-exit');
  this.nodeRefresh = goog.dom.getElement(this.prefix + 'refresh');
  this.nodeReload = goog.dom.getElement(this.prefix + 'reload');
  let nodeOpenInBrowser = goog.dom.getElement(this.prefix + 'open-in-browser');

  // Default status of options
  cwc.ui.Helper.enableElement(this.nodeRefresh, false);
  cwc.ui.Helper.enableElement(this.nodeReload, false);
  goog.style.setElementShown(this.nodeExpandExit, false);
  goog.style.setElementShown(this.nodeReload, false);

  goog.events.listen(this.nodeAutoReload, goog.events.EventType.CLICK,
    this.autoUpdate.bind(this));
  goog.events.listen(this.nodeExpand, goog.events.EventType.CLICK,
    this.expand.bind(this));
  goog.events.listen(this.nodeExpandExit, goog.events.EventType.CLICK,
    this.collapse.bind(this));
  goog.events.listen(nodeOpenInBrowser, goog.events.EventType.CLICK,
    this.openInBrowser.bind(this));
  goog.events.listen(this.nodeRefresh, goog.events.EventType.CLICK,
    this.refreshPreview.bind(this));
  goog.events.listen(this.nodeReload, goog.events.EventType.CLICK,
    this.reloadPreview.bind(this));
};


/**
 * Runs preview.
 */
cwc.ui.PreviewToolbar.prototype.runPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.run();
  }
};


/**
 * @param {!boolean} enable
 */
cwc.ui.PreviewToolbar.prototype.enableSoftRefresh = function(enable) {
  console.log('Enable soft refresh:', enable);
  goog.style.setElementShown(this.nodeRefresh, enable);
  goog.style.setElementShown(this.nodeReload, !enable);
};


/**
 * Reloads the preview.
 */
cwc.ui.PreviewToolbar.prototype.refreshPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.refresh();
  }
};


/**
 * Reloads the preview.
 */
cwc.ui.PreviewToolbar.prototype.reloadPreview = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.reload();
  }
};


/**
 * Sets auto update feature.
 */
cwc.ui.PreviewToolbar.prototype.autoUpdate = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.setAutoUpdate(!this.autoUpdateState);
  }
};


/**
 * Sets auto update status.
 * @param {boolean} enable
 */
cwc.ui.PreviewToolbar.prototype.setAutoUpdate = function(enable) {
  this.autoUpdateState = enable;
  goog.dom.classlist.enable(this.nodeAutoReload, 'spin', enable);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.PreviewToolbar.prototype.toggleExpand = function() {
  this.expandState = !this.expandState;
  this.setExpand(this.expandState);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.PreviewToolbar.prototype.expand = function() {
  this.setExpand(true);
};


/**
 * Toggles the current expand state.
 */
cwc.ui.PreviewToolbar.prototype.collapse = function() {
  this.setExpand(false);
};


/**
 * Open preview in an new browser window.
 */
cwc.ui.PreviewToolbar.prototype.openInBrowser = function() {
  let previewInstance = this.helper.getInstance('preview');
  if (previewInstance) {
    previewInstance.openInBrowser();
  }
};


/**
 * Expands or collapse the current window.
 * @param {boolean} expand
 */
cwc.ui.PreviewToolbar.prototype.setExpand = function(expand) {
  this.expandState = expand;
  let layoutInstance = this.helper.getInstance('layout', true);
  if (layoutInstance) {
    layoutInstance.setFullscreenPreview(expand);
    goog.style.setElementShown(this.nodeExpand, !expand);
    goog.style.setElementShown(this.nodeExpandExit, expand);
  }
};


/**
 * Shows/Hide the expand button.
 * @param {boolean} visible
 */
cwc.ui.PreviewToolbar.prototype.showExpandButton = function(visible) {
  goog.style.setElementShown(this.nodeExpand, visible);
};
