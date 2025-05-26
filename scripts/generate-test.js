#!/usr/bin/env node

/**
 * Test file generator script
 * 
 * Usage: 
 *   node scripts/generate-test.js path/to/component.tsx
 * 
 * This script will generate a test file for the specified component.
 */

const fs = require('fs');
const path = require('path');

// Get the file path from the command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path.');
  process.exit(1);
}

// Check if the file exists
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

// Extract the component name from the file path
const fileName = path.basename(filePath);
const componentName = fileName.split('.')[0];
const dirPath = path.dirname(filePath);
const fileExtension = path.extname(filePath);
const testFilePath = path.join(dirPath, `${componentName}.test${fileExtension}`);

// Check if the test file already exists
if (fs.existsSync(testFilePath)) {
  console.error(`Test file already exists: ${testFilePath}`);
  process.exit(1);
}

// Read the component file to determine if it's a React component
const fileContent = fs.readFileSync(filePath, 'utf8');
const isReactComponent = fileContent.includes('React') || fileContent.includes('react');
const isTypeScript = fileExtension === '.tsx' || fileExtension === '.ts';
const isUI = fileContent.includes('className') || fileContent.includes('style');

// Generate the test file content
let testContent = '';

if (isReactComponent) {
  if (isTypeScript) {
    testContent = `import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('should render correctly', () => {
    render(<${componentName} />);
    
    // Add your assertions here
    // Example: expect(screen.getByText('Hello')).toBeInTheDocument();
  });
  
  ${isUI ? `it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    
    render(<${componentName} onClick={mockFn} />);
    
    // Add your interaction tests here
    // Example: await user.click(screen.getByRole('button'));
    // Example: expect(mockFn).toHaveBeenCalled();
  });` : ''}
});
`;
  } else {
    // JavaScript React component
    testContent = `import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('should render correctly', () => {
    render(<${componentName} />);
    
    // Add your assertions here
  });
  
  ${isUI ? `it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const mockFn = vi.fn();
    
    render(<${componentName} onClick={mockFn} />);
    
    // Add your interaction tests here
  });` : ''}
});
`;
  }
} else {
  // Utility function or hook
  if (isTypeScript) {
    testContent = `import { describe, it, expect, vi } from 'vitest';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('should work correctly', () => {
    // Add your test cases here
    // Example: expect(${componentName}()).toBe(expectedResult);
  });
});
`;
  } else {
    // JavaScript utility
    testContent = `import { describe, it, expect, vi } from 'vitest';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('should work correctly', () => {
    // Add your test cases here
  });
});
`;
  }
}

// Write the test file
fs.writeFileSync(testFilePath, testContent);

console.log(`Test file generated: ${testFilePath}`); 