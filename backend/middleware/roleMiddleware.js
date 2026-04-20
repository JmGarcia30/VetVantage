// Blocks pet owners from vet-only routes
// The 'export const' part is crucial here!
export const staffOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next(); // User is staff, let them through
  } else {
    res.status(403).json({ message: 'Access denied. Clinic staff only.' });
  }
};