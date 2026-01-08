const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '..', 'images', 'products');
const today = new Date().toISOString().split('T')[0].replace(/-/g, '');

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    // Filter images
    const images = files.filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();

    console.log(`Found ${images.length} images.`);

    images.forEach((file, index) => {
        const ext = path.extname(file);
        const id = 100 + index + 1; // Start ID at 101
        const newName = `product-${id}-${today}${ext}`;

        const oldPath = path.join(directory, file);
        const newPath = path.join(directory, newName);

        fs.rename(oldPath, newPath, (err) => {
            if (err) console.error(`Error renaming ${file} to ${newName}`, err);
            else console.log(`✓ Renamed: ${file} -> ${newName}`);
        });
    });
});
