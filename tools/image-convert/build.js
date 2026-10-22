// 画像を data URI で埋め込んだ変換用HTMLを作る
const fs = require('fs');
const [photo, circles, out] = process.argv.slice(2);
const d = (p, t) => `data:${t};base64,` + fs.readFileSync(p).toString('base64');
fs.writeFileSync(out, `<!doctype html><body><pre id="o"></pre><script>
function load(src){return new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.src=src;});}
function enc(draw,w,h,q){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);return c.toDataURL('image/webp',q);}
(async()=>{
  const p=await load(${JSON.stringify(d(photo,'image/png'))});
  const c=await load(${JSON.stringify(d(circles,'image/png'))});
  const res={};
  // ヒーロー写真（PC用・スマホ用）
  res['hero-cafeteria.webp']=enc((x,w,h)=>x.drawImage(p,0,0,w,h),1536,1024,0.8);
  res['hero-cafeteria-sp.webp']=enc((x,w,h)=>x.drawImage(p,0,0,w,h),768,512,0.8);
  // 背景の円：ベース色で塗ってからぼかして描く（端が透けないよう少し大きめに描画）
  res['hero-bg-blur.webp']=enc((x,w,h)=>{x.fillStyle='#FCF6E5';x.fillRect(0,0,w,h);x.filter='blur(36px)';x.drawImage(c,-60,-34,w+120,h+68);},1280,720,0.8);
  document.getElementById('o').textContent=JSON.stringify(res);
})();
</script></body>`);
