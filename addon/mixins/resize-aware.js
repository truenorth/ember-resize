import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
const { floor } = Math;
// tslint:disable-next-line:variable-name
const ResizeAwareMixin = Mixin.create({
  resizeDebouncedEventsEnabled: true,
  resizeEventsEnabled: true,
  screenHeight: readOnly('resizeService.screenHeight'),
  screenWidth: readOnly('resizeService.screenWidth'),
  _oldViewHeight: null,
  _oldViewHeightDebounced: null,
  _oldViewWidth: null,
  _oldViewWidthDebounced: null,
  resizeHeightSensitive: true,
  resizeWidthSensitive: true,
  didInsertElement() {
    this._super(...arguments);
    const resizeService = this.get('resizeService');
    if (this.get('resizeEventsEnabled')) {
      resizeService.on('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      resizeService.on('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },
  willDestroyElement() {
    this._super(...arguments);
    const resizeService = this.get('resizeService');
    if (this.get('resizeEventsEnabled')) {
      resizeService.off('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      resizeService.off('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },
  // tslint:disable-next-line:no-empty
  didResize(_width, _height, _evt) {},
  // tslint:disable-next-line:no-empty
  debouncedDidResize(_width, _height, _evt) {},
  _getComponentSize() {
    return this.element.getClientRects()[0];
  },
  _handleResizeEvent(evt) {
    const w = floor(this._getComponentSize().width);
    const h = floor(this._getComponentSize().height);
    if (
      (this.get('resizeWidthSensitive') && this.get('_oldViewWidth') !== w) ||
      (this.get('resizeHeightSensitive') && this.get('_oldViewHeight') !== h)
    ) {
      this.didResize(w, h, evt);
      this.setProperties({
        _oldViewHeight: h,
        _oldViewWidth: w,
      });
    }
  },
  _handleDebouncedResizeEvent(evt) {
    const w = floor(this._getComponentSize().width);
    const h = floor(this._getComponentSize().height);
    if (
      (this.get('resizeWidthSensitive') && this.get('_oldViewWidthDebounced') !== w) ||
      (this.get('resizeHeightSensitive') && this.get('_oldViewHeightDebounced') !== h)
    ) {
      this.debouncedDidResize(w, h, evt);
      this.setProperties({
        _oldViewHeightDebounced: h,
        _oldViewWidthDebounced: w,
      });
    }
  },
});
export default ResizeAwareMixin;
