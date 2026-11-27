import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { buildDossier } from '../vendor/makefun-frontend.ts';

let passed = 0;
const check = (label, fn) => { fn(); passed++; console.log(`PASS ${label}`); };
const sandbox = { window: {}, location: { hash: '#/' }, URLSearchParams, Intl };
sandbox.window = sandbox;
vm.createContext(sandbox);
for (const file of ['deals', 'format', 'filters']) vm.runInContext(readFileSync(`app/${file}.js`, 'utf8'), sandbox);
const D = sandbox.DC;
check('20 complete unique deal records', () => {
  assert.equal(D.deals.length, 20);
  assert.equal(new Set(D.deals.map(d => d.id)).size, 20);
  for (const d of D.deals) {
    assert.deepEqual(Object.keys(d).sort(), ['id','product','store','url','sale','usual','category','verdict','evidence','condition','source','checkedAt'].sort());
    for (const v of Object.values(d)) assert.ok(v !== '' && v !== null);
    assert.equal(d.checkedAt, '2026-11-27T07:30:00Z');
    assert.ok(d.sale > 0 && d.sale < d.usual);
    assert.ok(d.url.startsWith('https://'));
  }
});
check('5 stores, 8 categories, 6 true lows', () => {
  assert.equal(new Set(D.deals.map(d => d.store)).size, 5);
  assert.equal(new Set(D.deals.map(d => d.category)).size, 8);
  assert.equal(D.deals.filter(d => d.verdict === 'True low').length, 6);
});
check('money and savings use exact cents', () => {
  const beats = D.deals.find(d => d.id === 'beats-studio-pro');
  assert.equal(D.money(beats.sale), '$99.00');
  assert.equal(D.saving(beats), 200);
  assert.equal(D.percent(beats), 67);
  for (const d of D.deals) assert.equal(D.saving(d), Math.round((d.usual-d.sale)*100)/100);
});
check('best-first ranking', () => {
  const all=D.filterDeals(D.defaults());
  assert.equal(all.length,20);
  assert.equal(all[0].id,'beats-studio-pro');
  assert.equal(all[1].id,'sony-xm5');
  assert.equal(all[2].id,'tcl-65-s4cf');
  assert.ok(all.slice(0,6).every(d=>d.verdict==='True low'));
  assert.ok(all.slice(-2).every(d=>d.verdict==='Routine'));
});
check('Audio + 50% preset contains four matches',()=>{
  sandbox.location.hash='#/audio50';
  const state=D.readState();
  assert.equal(state.category,'Audio');assert.equal(state.discount,'50%+');
  assert.equal(D.filterDeals(state).length,4);assert.equal(D.stateHash(state),'#/audio50');
});
for(const [key,values] of Object.entries({category:D.categories,store:D.stores,discount:D.discounts,verdict:D.verdicts})){
 check(`${key} filters partition the full dataset`,()=>{
   const groups=values.slice(1).map(value=>D.filterDeals({...D.defaults(),[key]:value}));
   assert.equal(groups.flat().length,20);
   assert.equal(new Set(groups.flat().map(d=>d.id)).size,20);
 });
}
check('case-insensitive product, store and category search',()=>{
 assert.equal(D.filterDeals({...D.defaults(),q:'AIRPODS'}).length,2);
 assert.equal(D.filterDeals({...D.defaults(),q:'dell'}).length,1);
 assert.equal(D.filterDeals({...D.defaults(),q:'reading'}).length,1);
 assert.equal(D.filterDeals({...D.defaults(),q:'not-a-real-deal'}).length,0);
});
for(const sort of ['percent','saving','price']){
 check(`${sort} sort is monotonic`,()=>{
  const values=D.filterDeals({...D.defaults(),sort}).map(d=>sort==='price'?d.sale:sort==='percent'?D.discount(d):D.saving(d));
  for(let i=1;i<values.length;i++) assert.ok(sort==='price'?values[i]>=values[i-1]:values[i]<=values[i-1]);
 });
}
check('combined filter hash roundtrip',()=>{
 const state={...D.defaults(),q:'Sony & audio',category:'Audio',store:'Best Buy',discount:'20-29%',verdict:'True low',sort:'price'};
 sandbox.location.hash=D.stateHash(state);
 assert.equal(JSON.stringify(D.readState()),JSON.stringify(state));
});
check('seven local source files under 70 KB',()=>{
 const files=readdirSync('app');assert.equal(files.length,7);
 const bytes=files.reduce((sum,f)=>sum+statSync('app/'+f).size,0);
 assert.ok(bytes<70000);console.log('APP_BYTES',bytes);
 for(const f of files){const text=readFileSync('app/'+f,'utf8');assert.ok(!/fetch\s*\(|XMLHttpRequest|https?:\/\//.test(f==='deals.js'?text.replace(/"url": "[^"]+"/g,''):text));}
});
check('vendor fingerprint matches kit',()=>{
 const sha=createHash('sha256').update(readFileSync('vendor/makefun-frontend.ts')).digest('hex');
 assert.equal(sha,'4c8da1c8e76490b3a847670f49137d3ec23953e3c988fe6a6cb320fce5739240');
});
check('four JPEGs meet size and viewport requirements',()=>{
 const shots=JSON.parse(readFileSync('shots.json','utf8'));
 assert.equal(shots.length,4);assert.equal(readdirSync('screenshots').length,4);
 for(const shot of shots){const bytes=readFileSync('screenshots/'+shot.file);assert.ok(bytes.length<=262144);assert.equal(bytes.readUInt16BE(0),0xffd8);
  let offset=2, size;
  while(offset<bytes.length){assert.equal(bytes[offset],255); const marker=bytes[offset+1]; const length=bytes.readUInt16BE(offset+2); if([0xc0,0xc1,0xc2].includes(marker)){size={width:bytes.readUInt16BE(offset+7),height:bytes.readUInt16BE(offset+5)};break;} offset+=2+length;}
  assert.deepEqual(size,shot.viewport);assert.ok(Math.max(size.width,size.height)<=1280 && Math.min(size.width,size.height)>=360);}
});
check('dossier is canonical and below 1.5 MiB',()=>{
 const generated=buildDossier('/tmp/dealcheck-out',{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},app_max_files:993,app_max_bytes:16777216});
 assert.ok(Buffer.byteLength(generated)<=1572864);
 assert.ok(Buffer.from(generated).equals(readFileSync('/tmp/dealcheck-out/dossier.json')), 'dossier bytes differ');
 console.log('DOSSIER_BYTES',Buffer.byteLength(generated));
});
console.log(`Local verification: ${passed} PASS, 0 FAIL. This is not a competition score.`);
