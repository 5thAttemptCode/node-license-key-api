module.exports = {
  addLicense: require("./db/addLicense"),
  deleteLicense: require("./db/deleteLicense"),
  devLog: require("./logger/devLog"),
  editLicense: require("./db/editLicense"),
  generateLicenseKey: require("./auth/generateLicenseKey"),
  hashPassword: require("./auth/hashPassword"),
  ...require("./logs/logAction"),
  sanitizeKey: require("./format/trimmedKey"),
}