const fs = require('fs');
const cheerio = require('cheerio');
const moment = require('moment');
const path = require('path');

// Constants
const OUTPUT_DIR = 'output';

// Find the first HTML file in current directory
const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'));

if (htmlFiles.length === 0) {
    console.error('No HTML files found in current directory');
    process.exit(1);
}

const INPUT_FILE = htmlFiles[0];
const INPUT_DIR = path.dirname(path.resolve(INPUT_FILE));
console.log(`Using ${INPUT_FILE} as input`);

// Read and parse HTML file
const html = fs.readFileSync(INPUT_FILE, 'utf8');
const $ = cheerio.load(html);

// Create output directory if not exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

// First pass: Count memos per date and collect them
const memoStats = new Map(); // Map<date, { count: number, memos: Array<{ element, index }> }>

$('.memo').each((_, element) => {
    const $memo = $(element);
    const timeText = $memo.find('.time').text().trim();
    if (!timeText) return;

    const memoDate = moment(timeText, 'YYYY-MM-DD HH:mm:ss');
    if (!memoDate.isValid()) return;

    const dateKey = memoDate.format('YYYY-MM-DD');
    const dateStats = memoStats.get(dateKey) || { count: 0, memos: [] };
    
    dateStats.count++;
    dateStats.memos.push({
        element: $memo,
        index: dateStats.count
    });
    
    memoStats.set(dateKey, dateStats);
});

// Process each memo and generate markdown files
memoStats.forEach(({ count: totalCount, memos }, date) => {
    memos.forEach(({ element: $memo, index }) => {
        const timestamp = $memo.find('.time').text().trim();
        const $content = $memo.find('.content');
        const $files = $memo.find('.files');
        
        // Generate markdown content
        const markdownParts = [];
        
        // Add title
        const baseTitle = `memo-${date}`;
        markdownParts.push(`# ${baseTitle}\n`);
        
        // Process main content if exists
        if ($content.length) {
            // Handle paragraphs (skip empty ones)
            $content.find('p').each((_, p) => {
                const text = $(p).text().trim();
                text && markdownParts.push(`${text}\n`);
            });

            // Handle unordered lists
            $content.find('ul').each((_, ul) => {
                $(ul).find('li').each((_, li) => {
                    markdownParts.push(`• ${$(li).text().trim()}`);
                });
                markdownParts.push('');
            });

            // Handle ordered lists
            $content.find('ol').each((_, ol) => {
                let itemNum = 1;
                $(ol).find('li').each((_, li) => {
                    markdownParts.push(`${itemNum}. ${$(li).text().trim()}`);
                    itemNum++;
                });
                markdownParts.push('');
            });
        }

        // Add creation timestamp
        markdownParts.push(`Created: ${timestamp}\n`);

        // Process images if any
        if ($files.length) {
            const $images = $files.find('img');
            $images.each((_, img) => {
                const imgSrc = $(img).attr('src');
                if (!imgSrc) return;

                const imageName = path.basename(imgSrc);
                const imageDir = path.dirname(imgSrc);
                const outputImageDir = path.join(OUTPUT_DIR, imageDir);

                // Ensure image directory exists
                fs.mkdirSync(outputImageDir, { recursive: true });

                // Add image reference to markdown
                markdownParts.push(`![${imageName}](${imgSrc})`);

                // Copy image file
                const sourceImagePath = path.join(INPUT_DIR, imgSrc);
                const targetImagePath = path.join(OUTPUT_DIR, imgSrc);
                
                if (fs.existsSync(sourceImagePath)) {
                    fs.copyFileSync(sourceImagePath, targetImagePath);
                }
            });
        }

        // Save markdown file
        const fileName = totalCount > 1 
            ? `${baseTitle}-${index}.md`
            : `${baseTitle}.md`;
            
        fs.writeFileSync(
            path.join(OUTPUT_DIR, fileName),
            markdownParts.join('\n')
        );
    });
});

console.log('Conversion completed! Check the output directory for the converted files.');
