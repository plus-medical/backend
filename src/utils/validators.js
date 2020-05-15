function PhoneValidator(val) {
  const phoneNumber = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (val && !val.match(phoneNumber)) {
    throw new Error('Phone number is invalid.');
  }
}

module.exports = { PhoneValidator };
