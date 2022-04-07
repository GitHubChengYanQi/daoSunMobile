import pako from 'pako';

const unzip = (base64) => {
  const strData = atob(base64);
  // Convert binary string to character-number array
  const charData = strData.split('').map(function(x) {
    return x.charCodeAt(0);
  });
  // Turn number array into byte-array
  var binData = new Uint8Array(charData);
  // // unzip
  var data = pako.inflate(binData, { to: 'string' });
  return JSON.parse(data);
};

const PakoInfate = {
  unzip,
};
export default PakoInfate;
