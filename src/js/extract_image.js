const fs = require('fs');

// Đọc file JSON
const jsonData = fs.readFileSync('/Users/super/Downloads/long bao.inkme', 'utf8');
const data = JSON.parse(jsonData);

// Lặp qua tất cả các ảnh trong savedImages
for (const [key, value] of Object.entries(data.savedImages)) {
    // Nhận diện định dạng ảnh
    const match = value.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) {
        console.warn(`Không nhận diện được định dạng ảnh cho key: ${key}`);
        continue;
    }
    const ext = match[1]; // jpg, png, ...
    const base64Image = match[2];
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const filename = `${key}.${ext}`;
    fs.writeFileSync(filename, imageBuffer);
    console.log(`Đã lưu ảnh: ${filename}`);
} 