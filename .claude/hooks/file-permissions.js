#!/usr/bin/env node

const sensitivePatterns = [
  '.env',
  '.git/',
];

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => input += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data?.tool_input?.file_path || '';
    
    const isSensitive = sensitivePatterns.some(pattern => 
      filePath.includes(pattern)
    );
    
    process.exit(isSensitive ? 2 : 0);
  } catch (error) {
    console.error('Error processing input:', error.message);
    process.exit(1);
  }
});
