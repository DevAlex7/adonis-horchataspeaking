'use strict'

class StoreHorchata {
  get rules () {
    return {
      horchataName: 'required',
      date: 'required',
      place: 'required',
    }
  }
  get messages () {
    return {
      'horchataName.required': 'No.',
      'date.email': 'No.',
      'place.unique': 'No.',
    }
  }
}

module.exports = StoreHorchata
