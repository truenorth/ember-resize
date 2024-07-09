// eslint-disable-next-line no-unused-vars
import Application from '@ember/application';
import { get } from '@ember/object';
import ResizeService from 'ember-resize/services/resize';
import config from '../config/environment';

export function initialize(application: Pick<Application, 'register'|'inject'|'unregister'|'resolveRegistration'>) {
  const resizeServiceDefaults = (get(config, 'resizeServiceDefaults') === undefined ? {
    debounceTimeout: 200,
    heightSensitive: true,
    widthSensitive: true,
  } : get(config, 'resizeServiceDefaults'));
  const injectionFactories = (get(resizeServiceDefaults, 'injectionFactories') === undefined ? ['view', 'component'] : get(resizeServiceDefaults, 'injectionFactories')) || [];

  application.unregister('config:resize-service');

  application.register('config:resize-service', resizeServiceDefaults as any, { instantiate: false });
  application.register('service:resize', ResizeService);
  const resizeService = application.resolveRegistration('service:resize');
  resizeService.prototype.resizeServiceDefaults = resizeServiceDefaults;

  injectionFactories.forEach((factory) => {
    application.inject(factory, 'resizeService', 'service:resize');
  });
}

export default {
  initialize,
  name: 'resize',
};
