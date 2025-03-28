module.exports = (req, res, next) => {
    if (req.session && req.session.admin) {
      return next();
    }
    return res.status(401).json({ error: 'גישה נדחתה. יש להתחבר כמנהל.' });
  };
  