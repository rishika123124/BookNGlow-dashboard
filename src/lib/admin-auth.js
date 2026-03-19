import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-booknglow-admin-2024';

export function authenticateAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No authorization token provided', status: 401 };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return { error: 'Access denied. Admin role required.', status: 403 };
    }
    
    return { admin: decoded };
    
  } catch (error) {
    console.error('Admin authentication error:', error);
    return { error: 'Invalid or expired token', status: 401 };
  }
}
