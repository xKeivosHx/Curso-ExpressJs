function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidName(name) {
  return typeof name === "string" && name.length >= 3;
}

function isValidId(id, users) {
  const isNumeric = !isNaN(id);
  const isUnique = !users.some((user) => user.id === id);
  return isNumeric && isUnique;
}

function validateUser(user, users) {
  const errors = [];

  if (!isValidName(user.name)) {
    errors.push("The name must be at least three characters long");
  }

  if (!isValidEmail(user.email)) {
    errors.push("The email address is not valid");
  }

  if (!isValidId(user.id, users)) {
    errors.push("The ID must be numeric and unique");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

function validateUserUpdate(user, users) {
  const errors = [];

  if (isValidId(user.id, users)) {
    errors.push("The ID must be numeric and exist");
  }

  if (!isValidName(user.name)) {
    errors.push("The name must be at least three characters long");
  }

  if (!isValidEmail(user.email)) {
    errors.push("The email address is not valid");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

module.exports = { validateUser, validateUserUpdate };
