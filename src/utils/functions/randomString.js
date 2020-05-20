const randomLetter = (type) => {
  let firstAscii, lastAscii;
  if (type == "uppercase") {
    firstAscii = 65;
    lastAscii = 90;
  } else {
    firstAscii = 97;
    lastAscii = 122;
  }
  return String.fromCharCode(
    Math.floor(Math.random() * (lastAscii - firstAscii + 1)) + firstAscii
  );
};

const randomString = (size, type) => {
  let string = "";
  for (let i = 0; i < size; i++) {
    const randomType = Math.random();
    if (type === "number" || randomType > 0.66) {
      string += Math.floor(Math.random() * 10);
    } else if (randomType > 0.33) {
      string += randomLetter("uppercase");
    } else {
      string += randomLetter("downcase");
    }
  }
  return string;
};

module.exports = randomString;
