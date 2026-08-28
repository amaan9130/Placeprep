export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.error('API Error:', err);

  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: `Resource not found with id ${err.value}` });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(400).json({ success: false, message: `Duplicate entry: '${field}' already exists.` });
  }
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server encountered an unexpected error.'
  });
};