function phoneValidator(val) {
  const phoneNumber = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (val && !val.match(phoneNumber)) {
    throw new Error('Phone number is invalid.');
  }
}

function roleValidator(val) {
  const roles = ['patient', 'doctor', 'lab-worker', 'administrator'];
  if (val && !roles.includes(val)) {
    throw new Error('Role is invalid. Valid values ​​are ', roles.split(', '));
  }
}


module.exports = { phoneValidator, roleValidator };
