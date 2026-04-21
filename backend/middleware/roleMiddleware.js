// Blocks pet owners from vet-only routes
// The 'export const' part is crucial here!
export const staffOnly = (req, res, next) => {
  // Intercept and print the user object to the terminal
  console.log("DEBUG - User hitting staffOnly middleware:", req.user); 

  if (req.user && (req.user.role === 'staff' || req.user.role === 'admin')) {
    next(); 
  } else {
    res.status(403).json({ message: 'Access denied. Clinic staff only.' });
  }
};