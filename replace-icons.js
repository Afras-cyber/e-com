const fs = require('fs');
const path = require('path');

const mapping = {
  'AlertCircle': 'DangerCircleLinear',
  'AlertTriangle': 'DangerTriangleLinear',
  'ArrowLeft': 'ArrowLeftLinear',
  'ArrowRight': 'ArrowRightLinear',
  'Briefcase': 'CaseLinear',
  'Check': 'CheckReadLinear',
  'CheckCircle': 'CheckCircleLinear',
  'CheckCircle2': 'CheckCircleLinear',
  'CheckSquare': 'CheckSquareLinear',
  'ChevronLeft': 'AltArrowLeftLinear',
  'ChevronRight': 'AltArrowRightLinear',
  'Clock': 'ClockCircleLinear',
  'Download': 'DownloadLinear',
  'Edit': 'PenLinear',
  'ExternalLink': 'LinkLinear',
  'Eye': 'EyeLinear',
  'Footprints': 'MapPointLinear',
  'Heart': 'HeartLinear',
  'HeartOff': 'HeartBrokenLinear',
  'Home': 'HomeAngleLinear',
  'Image': 'GalleryLinear',
  'Info': 'InfoCircleLinear',
  'LayoutDashboard': 'WidgetLinear',
  'Loader2': 'RefreshLinear',
  'LogOut': 'LogoutLinear',
  'Mail': 'LetterLinear',
  'MapPin': 'MapPointLinear',
  'Menu': 'HamburgerMenuLinear',
  'MessageCircle': 'ChatLineLinear',
  'MessageSquare': 'ChatSquareLinear',
  'MessageSquareQuote': 'ChatSquareLinear',
  'Minus': 'MinusCircleLinear',
  'MoreHorizontal': 'MenuDotsLinear',
  'MoveDown': 'ArrowDownLinear',
  'MoveUp': 'ArrowUpLinear',
  'Package': 'BoxLinear',
  'PackageX': 'BoxLinear',
  'Percent': 'SaleLinear',
  'Phone': 'PhoneLinear',
  'Plus': 'AddCircleLinear',
  'Quote': 'DialogLinear',
  'RefreshCcw': 'RefreshCircleLinear',
  'RotateCcw': 'HistoryLinear',
  'Save': 'DisketteLinear',
  'Search': 'MagniferLinear',
  'Send': 'SendSquareLinear',
  'Shield': 'ShieldLinear',
  'ShieldCheck': 'ShieldCheckLinear',
  'ShoppingBag': 'BagLinear',
  'ShoppingCart': 'CartLargeLinear',
  'SlidersHorizontal': 'TuningLinear',
  'Sparkles': 'StarsLinear',
  'Square': 'StopLinear',
  'Star': 'StarLinear',
  'Tag': 'TagLinear',
  'ToggleLeft': 'RefreshLinear', // fallback
  'ToggleRight': 'RefreshLinear', // fallback
  'Trash2': 'TrashBinTrashLinear',
  'Truck': 'BusLinear', // fallback for delivery
  'Upload': 'UploadLinear',
  'User': 'UserLinear',
  'UserPlus': 'UserPlusLinear',
  'Users': 'UsersGroupTwoRoundedLinear',
  'X': 'CloseCircleLinear',
  'XCircle': 'CloseCircleLinear',
  'Zap': 'BoltLinear'
};

const solarIcons = require('solar-icon-set');
const validSolarIcons = new Set(Object.keys(solarIcons));

// Verify mapping
for (const [lucide, solar] of Object.entries(mapping)) {
  if (!validSolarIcons.has(solar)) {
    console.log(`Warning: ${solar} (mapped from ${lucide}) does not exist in solar-icon-set.`);
    // Fallback to something that exists
    mapping[lucide] = 'InfoCircleLinear';
  }
}

const files = [];

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'dist') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
}

scanDir(path.join(process.cwd(), 'src'));

let changedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Find the lucide-react import
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['\"]lucide-react['\"]/g;
  let match;
  let fileChanged = false;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importBlock = match[0];
    const iconsListStr = match[1];
    const icons = iconsListStr.split(',').map(i => i.trim()).filter(i => i);
    
    let solarImports = new Set();
    let localMapping = {}; // lucideName -> solarName
    
    for (const iconItem of icons) {
      let originalName = iconItem;
      let alias = null;
      if (iconItem.includes(' as ')) {
        const parts = iconItem.split(' as ').map(s => s.trim());
        originalName = parts[0];
        alias = parts[1];
      }
      
      const mapped = mapping[originalName] || 'InfoCircleLinear';
      
      if (alias) {
        // e.g. CheckCircle as CheckCircleIcon -> CheckCircleLinear as CheckCircleIcon
        solarImports.add(`${mapped} as ${alias}`);
        localMapping[alias] = alias; // We don't need to replace in JSX, it uses the alias
      } else {
        solarImports.add(mapped);
        localMapping[originalName] = mapped;
      }
    }
    
    // Replace the import
    const newImport = `import { ${Array.from(solarImports).join(', ')} } from "solar-icon-set";`;
    content = content.replace(importBlock, newImport);
    
    // Replace JSX usages
    for (const [lucide, solar] of Object.entries(localMapping)) {
      if (lucide !== solar) {
        // <IconName
        const jsxRegex1 = new RegExp(`<${lucide}\\b`, 'g');
        content = content.replace(jsxRegex1, `<${solar}`);
        // </IconName>
        const jsxRegex2 = new RegExp(`<\/${lucide}>`, 'g');
        content = content.replace(jsxRegex2, `</${solar}>`);
        
        // Also might be used as a component reference e.g. icon: IconName
        // We use a broader regex to replace whole word occurrences, but be careful not to replace it inside strings
        // Actually, replacing word boundary is usually safe in these TS files for icon references
        const wordRegex = new RegExp(`\\b${lucide}\\b`, 'g');
        content = content.replace(wordRegex, solar);
      }
    }
    
    fileChanged = true;
  }
  
  if (fileChanged) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Updated ${changedFiles} files.`);
