import bcrypt from 'bcryptjs';
import { UserModel } from './user.model.js';
import { InvoiceModel } from '../invoices/invoice.model.js';
import { ClientModel } from '../clients/client.model.js';
import { BusinessProfileModel } from '../businessProfile/businessProfile.model.js';
import { AppError } from '../../utils/appError.js';

export class UserService {
  public static async getProfile(userId: string) {
    const user = await UserModel.findById(userId).select('-passwordHash -refreshTokens -verificationToken -resetPasswordToken');
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  public static async updateProfile(userId: string, data: { name?: string }) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    if (data.name) user.name = data.name;
    await user.save();

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      plan: user.plan,
    };
  }

  public static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) throw new AppError('Incorrect current password', 400, 'INVALID_PASSWORD');

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    user.refreshTokens = []; // Revoke active sessions
    await user.save();

    return { message: 'Password updated successfully. Please log in again.' };
  }

  public static async deleteAccount(userId: string) {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

    // Clean up user resources
    await Promise.all([
      UserModel.findByIdAndDelete(userId),
      BusinessProfileModel.deleteMany({ userId }),
      ClientModel.deleteMany({ userId }),
      InvoiceModel.deleteMany({ userId }),
    ]);

    return { message: 'Account and associated data permanently deleted.' };
  }
}

