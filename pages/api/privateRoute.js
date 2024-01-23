import requireAuth from '../../middleware/requireAuth';

const handler = (req, res) => {
  res.status(200).json({ message: 'Authenticated Route', user: req.user });
};

export default requireAuth(handler);