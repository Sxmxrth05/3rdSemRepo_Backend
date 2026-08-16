import { UserModel } from '../users/user.model.js';
import { BusinessProfileModel } from '../businessProfile/businessProfile.model.js';
import { hashPassword, comparePassword, generateRandomToken, hashToken } from '../../utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { AppError } from '../../utils/appError.js';
import { emailService } from '../../services/email.service.js';

export class AuthService {
  public static async register(data: { name: string; email: string; password: string }) {
    const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email address is already registered', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await hashPassword(data.password);
    const { rawToken, hashedToken } = generateRandomToken();

    const user = await UserModel.create({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      verificationToken: hashedToken,
    });

    // Create default Business Profile for the user
    await BusinessProfileModel.create({
      userId: user._id,
      businessName: `${data.name}'s Business`,
      email: data.email.toLowerCase(),
      invoiceNumberPrefix: 'INV-',
    });

    // Send verification email
    await emailService.sendEmail({
      to: user.email,
      subject: 'Verify your Billora Account',
      html: `<p>Welcome to Billora! Please verify your email using this token: <strong>${rawToken}</strong></p>`,
    });

    return {
      message: 'Registration successful. Please check your email to verify your account.',
      userId: user._id,
    };
  }

  public static async verifyEmail(token: string) {
    const hashed = hashToken(token);
    const user = await UserModel.findOne({ verificationToken: hashed });

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400, 'INVALID_VERIFICATION_TOKEN');
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return { message: 'Email address verified successfully' };
  }

  public static async login(data: { email: string; password: string }) {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const payload = { userId: user._id.toString(), email: user.email, plan: user.plan };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Save refresh token hash in user record
    const hashedRefresh = hashToken(refreshToken);
    user.refreshTokens.push(hashedRefresh);
    await user.save();

    return {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        plan: user.plan,
      },
    };
  }

  public static async refreshToken(token: string) {
    try {
      const decoded = verifyRefreshToken(token);
      const user = await UserModel.findById(decoded.userId);
      if (!user) {
        throw new AppError('User not found', 401, 'USER_NOT_FOUND');
      }

      const hashedRefresh = hashToken(token);
      const tokenIndex = user.refreshTokens.indexOf(hashedRefresh);

      if (tokenIndex === -1) {
        // Reuse detection: clear all refresh tokens for security
        user.refreshTokens = [];
        await user.save();
        throw new AppError('Security alert: Refresh token reuse detected. Please log in again.', 401, 'TOKEN_REUSE');
      }

      // Rotate refresh token
      user.refreshTokens.splice(tokenIndex, 1);
      const payload = { userId: user._id.toString(), email: user.email, plan: user.plan };
      const newAccessToken = signAccessToken(payload);
      const newRefreshToken = signRefreshToken(payload);

      user.refreshTokens.push(hashToken(newRefreshToken));
      await user.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }
  }

  public static async logout(userId: string, refreshToken?: string) {
    const user = await UserModel.findById(userId);
    if (user && refreshToken) {
      const hashed = hashToken(refreshToken);
      user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
      await user.save();
    }
    return { message: 'Logged out successfully' };
  }

  public static async forgotPassword(email: string) {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success to avoid email enumeration
      return { message: 'If that email exists, a password reset link has been sent.' };
    }

    const { rawToken, hashedToken } = generateRandomToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔑 [DEV ONLY] Password Reset Token for ${user.email}: ${rawToken}`);
    }

    await emailService.sendEmail({
      to: user.email,
      subject: 'Billora - Password Reset Request',
      html: `<p>You requested a password reset. Use this token: <strong>${rawToken}</strong></p>`,
    });

    return {
      message: 'If that email exists, a password reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { resetToken: rawToken }),
    };
  }

  public static async resetPassword(token: string, newPassword: string) {
    const hashed = hashToken(token);
    const user = await UserModel.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError('Invalid or expired password reset token', 400, 'INVALID_RESET_TOKEN');
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokens = []; // Revoke active sessions
    await user.save();

    return { message: 'Password updated successfully. Please log in with your new password.' };
  }
}
