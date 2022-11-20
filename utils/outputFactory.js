function generateOutput(code, message, data) {
  return {
    statusCode: code,
    message: message,
    data: data,
  };
}

module.exports = generateOutput;
