import { ClientModel } from './client.model.js';
import { InvoiceModel } from '../invoices/invoice.model.js';
import { assertOwnership } from '../../utils/ownershipCheck.js';
import { AppError } from '../../utils/appError.js';

export class ClientService {
  public static async listClients(userId: string, includeArchived = false) {
    const query: Record<string, unknown> = { userId };
    if (!includeArchived) query.isArchived = false;

    return ClientModel.find(query).sort({ createdAt: -1 });
  }

  public static async getClientById(userId: string, clientId: string) {
    const client = await ClientModel.findById(clientId);
    if (!client) throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');

    assertOwnership(client.userId, userId);
    return client;
  }

  public static async getClientInvoices(userId: string, clientId: string) {
    await this.getClientById(userId, clientId);
    return InvoiceModel.find({ userId, clientId, isDeleted: false }).sort({ createdAt: -1 });
  }

  public static async createClient(userId: string, data: { name: string; email: string; address?: string }) {
    return ClientModel.create({
      userId,
      name: data.name,
      email: data.email,
      address: data.address || '',
    });
  }

  public static async updateClient(userId: string, clientId: string, data: Record<string, unknown>) {
    const client = await ClientModel.findById(clientId);
    if (!client) throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');

    assertOwnership(client.userId, userId);

    Object.assign(client, data);
    await client.save();
    return client;
  }

  public static async archiveClient(userId: string, clientId: string) {
    const client = await ClientModel.findById(clientId);
    if (!client) throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');

    assertOwnership(client.userId, userId);

    client.isArchived = true;
    await client.save();
    return { message: 'Client archived successfully' };
  }

  public static async unarchiveClient(userId: string, clientId: string) {
    const client = await ClientModel.findById(clientId);
    if (!client) throw new AppError('Client not found', 404, 'CLIENT_NOT_FOUND');

    assertOwnership(client.userId, userId);

    client.isArchived = false;
    await client.save();
    return { message: 'Client unarchived successfully', client };
  }
}

