import $ from 'jquery';
import app from '../../../app';
import '../../../lib/select2';
import loadTemplate from '../../../utils/loadTemplate';
import baseView from '../../baseVw';
import Listing from '../../../models/listing/Listing';

export default class extends baseView {
  constructor(options = {}) {
    super(options);
    this.options = options;

    this._countryCode = options.countryCode || '';

    if (!this.model || !(this.model instanceof Listing)) {
      throw new Error('Please provide a listing model');
    }
  }

  className() {
    return 'shippingOptions';
  }

  events() {
    return {
      'click .js-shippingOption': 'changeShippingOption',
    };
  }

  changeShippingOption(e) {
    const option = $(e.target);
    const name = option.attr('data-name');
    const service = option.attr('data-service');
    this.trigger('selected', { name, service });
  }

  get countryCode() {
    return this._countryCode;
  }

  set countryCode(code) {
    this._countryCode = code;
  }

  render() {
    const filteredShipping = this.model.get('shippingOptions').toJSON().filter((option) =>
      option.regions.indexOf(this.countryCode) !== -1);

    if (filteredShipping.length) {
      const name = filteredShipping[0].name;
      const service = filteredShipping[0].services[0].name;
      this.trigger('selected', { name, service });
    } else {
      // if no valid option is available, set it to blank
      this.trigger('selected', { name: '', service: '' });
    }

    loadTemplate('modals/purchase/shippingOptions.html', t => {
      this.$el.html(t({
        filteredShipping,
        displayCurrency: app.settings.get('localCurrency'),
        ...this.model.toJSON(),
      }));
    });

    return this;
  }
}
