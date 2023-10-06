function generatePassword() {
  let length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    val = "";
  for (let i = 0; i < length; i++) {
    val += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return val;
}

module.exports = {
  generatePassword,
};
