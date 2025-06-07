import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from 'handlebars';

const templatePath = join(__dirname, 'password-reset.html');
const template = readFileSync(templatePath, 'utf-8');
const compiledTemplate = compile(template);

interface PasswordResetTemplateData {
  resetLink: string;
  username: string;
}

export const generatePasswordResetEmail = (data: PasswordResetTemplateData): string => {
  return compiledTemplate(data);
}; 
