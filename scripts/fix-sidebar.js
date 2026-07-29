const fs = require('fs');
const p = 'c:/Users/Admin/CarePath/CarePath/carepath-ui/src/components/layout/Sidebar.tsx';
let c = fs.readFileSync(p, 'utf8');

const lines = c.split('\n');

// Find the exact lines to fix by scanning
let result = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  result.push(line);
  
  // Fix 1: After the inner </div> (closing the <div> for text), 
  // we need to add a </div> to close the outer flex container <div>
  // The structure should be: <div flex> ... <div>text</div> </Link>
  // Currently it's:          <div flex> ... <div>text</div> </Link>
  if (line.includes('{role ? roleLabels[role] : "Guest"}')) {
    // Next line should be: </div> (closing the inner <div>)
    // After that we need: </div> (closing the outer <div>)
    // Let's check what the next line looks like
    if (i + 1 < lines.length && (lines[i+1].includes('</Link>') || lines[i+1].trim() === '</div>')) {
      // If next line is already </div>, we need to add another </div> before it
      if (lines[i+1].trim() === '</div>') {
        // There's already an inner </div>, but missing the outer </div>
        result.push(lines[i+1]); // inner </div>
        result.push('        </div>'); // outer </div> to close the flex container
        i++;
      } else {
        // Next line is </Link> - we're missing both </div>s
        continue; // will be handled below
      }
    }
  }
  
  // Check for missing outer </div> in logo section
  // Looking for: </div>\n      </Link>
  if (line.trim() === '</div>' && i + 1 < lines.length) {
    const nextLine = lines[i+1];
    if (nextLine.trim().startsWith('</Link>')) {
      // We need to insert a </div> before </Link> if not already there from above
      // But only if we haven't already inserted it
      const prevLine = lines[i-1] || '';
      if (!prevLine.includes('role ? roleLabels[role]')) {
        // This is NOT the inner div close, so don't add extra
      }
    }
  }
  
  i++;
}

// Simpler approach: just check the current content
console.log('Lines with <div>:');
lines.forEach((l, idx) => {
  if (l.includes('<div') || l.includes('</div>')) {
    console.log(`${idx}: ${l}`);
  }
});
