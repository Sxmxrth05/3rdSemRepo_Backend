import { BusinessProfileModel } from './businessProfile.model.js';
import { AppError } from '../../utils/appError.js';

export class BusinessProfileService {
  public static async getProfile(userId: string) {
    let profile = await BusinessProfileModel.findOne({ userId });
    if (!profile) {
      profile = await BusinessProfileModel.create({
        userId,
        businessName: 'My Business',
        email: 'billing@example.com',
        invoiceNumberPrefix: 'INV-',
      });
    }
    return profile;
  }

  public static async updateProfile(userId: string, data: Record<string, unknown>) {
    const profile = await BusinessProfileModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true, upsert: true }
    );
    if (!profile) {
      throw new AppError('Failed to update business profile', 500);
    }
    return profile;
  }

  public static async updateSignature(userId: string, signature: { type: 'font' | 'drawn'; value: string }) {
    const profile = await BusinessProfileModel.findOneAndUpdate(
      { userId },
      { $set: { defaultSignature: signature } },
      { new: true, upsert: true }
    );
    return profile;
  }
}


