function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }

      if (value === undefined || value === null) continue;

      if (rules.type === 'number') {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${field} must be a number`);
        } else if (rules.min !== undefined && num < rules.min) {
          errors.push(`${field} must be at least ${rules.min}`);
        } else if (rules.max !== undefined && num > rules.max) {
          errors.push(`${field} must be at most ${rules.max}`);
        }
      }

      if (rules.type === 'string') {
        if (typeof value !== 'string') {
          errors.push(`${field} must be a string`);
        } else {
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`);
          }
        }
      }

      if (rules.oneOf && !rules.oneOf.includes(value)) {
        errors.push(`${field} must be one of: ${rules.oneOf.join(', ')}`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
  };
}

module.exports = { validate };
