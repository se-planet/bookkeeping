function errorHandler(err, req, res, _next) {
  console.error(err.stack);

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
