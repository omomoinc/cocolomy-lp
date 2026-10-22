// --dump-dom の出力から WebP を取り出して保存する
const fs = require('fs'), path = require('path');
const [dom, outDir] = process.argv.slice(2);
const html = fs.readFileSync(dom, 'utf8');
const json = html.match(/<pre id="o">([\s\S]*?)<\/pre>/)[1].replace(/&quot;/g,'"').replace(/&amp;/g,'&');
const res = JSON.parse(json);
for (const [name, url] of Object.entries(res)) {
  const buf = Buffer.from(url.split(',')[1], 'base64');
  fs.writeFileSync(path.join(outDir, name), buf);
  console.log(name, url.slice(0, 15), Math.round(buf.length/1024) + 'KB');
}
