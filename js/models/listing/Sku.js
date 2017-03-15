import is from 'is_js';
import BaseModel from '../BaseModel';

export default class extends BaseModel {
  defaults() {
    return {
      productID: '',
      infiniteInventory: false,
    };
  }

  get max() {
    return {
      productIdLength: 40,
    };
  }

  validate(attrs) {
    const errObj = {};

    const addError = (fieldName, error) => {
      errObj[fieldName] = errObj[fieldName] || [];
      errObj[fieldName].push(error);
    };

    if (attrs.productID.length > this.max.productIdLength) {
      // TRANSLATE!
      addError('productID', `The productID cannot exceed ${this.max.productIdLength} characters.`);
    }

    if (attrs.quantity === '' && !attrs.infiniteInventory) {
      // TRANSLATE!
      addError('quantity', 'Please provide a quantity.');
    }

    if (typeof attrs.infiniteInventory !== 'undefined' &&
      typeof attrs.infiniteInventory !== 'boolean') {
      addError('infiniteInventory', 'If provided, infiniteInventory should be a boolean.');
    }

    if (attrs.quantity !== '') {
      if (typeof attrs.quantity !== 'number') {
        // TRANSLATE!
        addError('quantity', 'Please provide the quantity as a number.');
      } else if (!attrs.infiniteInventory && attrs.quantity < 0) {
        // The listing API allows the quantity to be set to < 0, which indicates an unlimited
        // supply. This model does not allow that, but does have an infiniteInventory flag.
        // The expectation is that sync / parse of the listing model will send the quantity
        // over as -1 if the infiniteInventory flag is set to true. Also the infiniteInventory
        // flag should not be sent to the server.

        // TRANSLATE!
        addError('quantity', 'The quantity cannot be less than 0.');
      }
    }

    if (attrs.surcharge === '') {
      // TRANSLATE!
      addError('surcharge', 'Please provide a surcharge.');
    } else if (typeof attrs.surcharge !== 'number') {
      // TRANSLATE!
      addError('surcharge', 'Please provide the surcharge as a number.');
    }

    // The listing API does not require a variantCombo field, since if you have no options and
    // want to assign a quantity and / or productId to an Item you would create a "dummy" Sku object
    // and set the values there. That seems like a bit of a klunky way to do it, so the client will
    // not allow such a dummy SKU. Instead, the Item model will allow quantity and productId fields
    // and convert them to / from a dummy SKU in sync / parse.
    if (!is.array(attrs.variantCombo)) {
      addError('variantCombo', 'A variantCombo field must be provided and must be an array.');
    }

    if (Object.keys(errObj).length) return errObj;

    return undefined;
  }
}
