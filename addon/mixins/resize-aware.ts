import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import ResizeService from 'dummy/services/resize';
const { floor } = Math;

// tslint:disable-next-line:variable-name
const ResizeAwareMixin = Mixin.create({
  resizeDebouncedEventsEnabled: true,
  resizeEventsEnabled: true,

  screenHeight: readOnly('resizeService.screenHeight'),
  screenWidth: readOnly('resizeService.screenWidth'),

  _oldViewHeight: null as number | null,
  _oldViewHeightDebounced: null as number | null,
  _oldViewWidth: null as number | null,
  _oldViewWidthDebounced: null as number | null,
  resizeHeightSensitive: true,
  resizeWidthSensitive: true,

  _removeResizeEvents: undefined,
  _removeResizeDebouncedEvents: undefined,

  didInsertElement() {
    this._super(...arguments);
    const resizeService: ResizeService = (this as any).get('resizeService');
    if (this.get('resizeEventsEnabled')) {
      resizeService.on('didResize', this, this._handleResizeEvent)
      this._removeResizeEvents = () => {
        resizeService.off('didResize', this, this._handleResizeEvent)
      }
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      resizeService.on('debouncedDidResize', this, this._handleDebouncedResizeEvent)
      this._removeResizeDebouncedEvents = () => {
        resizeService.off('debouncedDidResize', this, this._handleDebouncedResizeEvent)
      }
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('_removeResizeEvents')) {
      this._removeResizeEvents()
    }
    if (this.get('_removeResizeDebouncedEvents')) {
      this._removeResizeDebouncedEvents()
    }
  },

  // tslint:disable-next-line:no-empty
  didResize(_width: number, _height: number, _evt: UIEvent) {}, // Overridden in subclass
  // tslint:disable-next-line:no-empty
  debouncedDidResize(_width: number, _height: number, _evt: UIEvent) {}, // Overridden in subclass

  _getComponentSize(this: any) {
    return this.element.getClientRects()[0];
  },

  _handleResizeEvent(evt: UIEvent) {
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

  _handleDebouncedResizeEvent(evt: UIEvent) {
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
