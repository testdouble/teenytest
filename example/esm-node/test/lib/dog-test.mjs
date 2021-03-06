import assert from 'core-assert'
import Dog from '../../lib/dog.js'

export function beforeEach () {
  this.subject = new Dog('Sam')
};

export const bark = {
  once: function () {
    assert.deepEqual(this.subject.bark(1), ['Woof #0'])
  },
  twice: function () {
    assert.deepEqual(this.subject.bark(2), ['Woof #0', 'Woof #1'])
  }
}

export const tag = {
  frontSaysName: function () {
    assert.equal(this.subject.tag('front'), 'Hi, I am Sam')
  },
  backSaysAddress: function () {
    assert.equal(this.subject.tag('back'), 'And here is my address')
  }
}
