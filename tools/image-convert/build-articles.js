// 記事サムネイル用: 画像を data URI で埋め込んだ変換用HTMLを作る
// 引数: <出力HTML> <元画像=出力名.webp> ...（800×450 に中央で切り抜いて WebP 化）
const fs = require('fs'), path = require('path');
const [out, ...pairs] = process.argv.slice(2);
const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const items = pairs.map(s => { const i = s.lastIndexOf('='); const src = s.slice(0, i);
  return { name: s.slice(i + 1), url: `data:${mime[path.extname(src).toLowerCase()]};base64,` + fs.readFileSync(src).toString('base64') }; });
fs.writeFileSync(out, `<!doctype html><body><pre id="o"></pre><script>
function load(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=src;});}
(async()=>{
  const res={}, W=800, H=450;
  for (const it of ${JSON.stringify(items)}) {
    const img=await load(it.url), c=document.createElement('canvas'); c.width=W; c.height=H;
    const s=Math.max(W/img.width,H/img.height), w=img.width*s, h=img.height*s;
    c.getContext('2d').drawImage(img,(W-w)/2,(H-h)/2,w,h);
    res[it.name]=c.toDataURL('image/webp',0.8);
  }
  document.getElementById('o').textContent=JSON.stringify(res);
})();
</script></body>`);
