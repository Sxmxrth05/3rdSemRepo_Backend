import cron from 'node-cron';
import { InvoiceModel } from '../modules/invoices/invoice.model.js';

export const initCronJobs = (): void => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('⏰ Running daily trash purge cron job...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await InvoiceModel.deleteMany({
        isDeleted: true,
        deletedAt: { $lte: thirtyDaysAgo },
      });

      console.log(`🧹 Permanently purged ${result.deletedCount} trashed invoices older than 30 days.`);
    } catch (error) {
      console.error('❌ Error executing trash purge cron job:', error);
    }
  });

  console.log('✅ Background cron service initialized (Daily 30-day trash purge scheduled)');
};
