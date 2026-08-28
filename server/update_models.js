import fs from 'fs';
import path from 'path';

const modelNames = [
  'User', 'StudentProfile', 'Company', 'Job', 'Application',
  'PlacementDrive', 'AptitudeQuestion', 'TestResult', 'CodingQuestion',
  'CodingSubmission', 'TechnicalQuestion', 'HRQuestion', 'InterviewPractice',
  'Notification', 'Announcement'
];

for (const name of modelNames) {
  const filePath = path.join('models', name + '.js');
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('getModel')) {
    content = "import { getModel } from '../config/memoryStore.js';\n" + content;
    const targetExport = `export default mongoose.model('${name}', ${name}Schema);`;
    const replacement = `const rawModel = mongoose.models['${name}'] || mongoose.model('${name}', ${name}Schema);\nexport default getModel('${name}', rawModel);`;
    content = content.replace(targetExport, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated model:', name);
  }
}