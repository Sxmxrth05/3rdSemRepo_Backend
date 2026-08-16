import { TemplateModel } from './template.model.js';
import { AppError } from '../../utils/appError.js';


export class TemplateService {
  public static async listTemplates() {
    let templates = await TemplateModel.find();
    if (templates.length === 0) {
      // Seed default templates if database is empty
      templates = await TemplateModel.insertMany([
        {
          name: 'Modern Clean',
          slug: 'modern',
          description: 'Clean geometric layout with bold brand headers',
          previewImageUrl: '/templates/modern.png',
        },
        {
          name: 'Classic Corporate',
          slug: 'classic',
          description: 'Traditional corporate layout ideal for business services',
          previewImageUrl: '/templates/classic.png',
        },
        {
          name: 'Minimalist Studio',
          slug: 'minimalist',
          description: 'Sleek monochrome design tailored for freelancers & creatives',
          previewImageUrl: '/templates/minimalist.png',
        },
      ]);
    }
    return templates;
  }

  public static async getTemplateBySlug(slug: string) {
    await this.listTemplates(); // Ensure seeding if needed
    const template = await TemplateModel.findOne({ slug });
    if (!template) {
      throw new AppError('Template not found', 404, 'TEMPLATE_NOT_FOUND');
    }
    return template;
  }
}

