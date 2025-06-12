import bcrypt from 'bcrypt';
import { User } from './models';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId?: string;
  departmentId?: string;
  permissions: any;
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await User.findOne({ email }).populate('companyId departmentId');
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId?.toString(),
      departmentId: user.departmentId?.toString(),
      permissions: user.permissions
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await User.findById(id).populate('companyId departmentId');
    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId?.toString(),
      departmentId: user.departmentId?.toString(),
      permissions: user.permissions
    };
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}