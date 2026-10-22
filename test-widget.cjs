// Run: node test-widget.cjs (no dependencies).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('index.html', 'utf8');
const source = html.slice(html.indexOf('<script>\nfunction toggleSwitch') + 8, html.lastIndexOf('</script>'));
const elements = {};
const context = {window: {}, document: {
  getElementById: id => elements[id] ||= {value: id === 'position' ? 'left' : '', textContent: '', innerHTML: ''},
  addEventListener() {}
}};
vm.createContext(context);
vm.runInContext(source, context);
const text = 'The "Fit" Studio \\ नमस्ते\n</script><img src=x onerror=alert(1)>';
context.text = text;
vm.runInContext(`currentTab='hosted'; generateCode('919876543210',text,text,text,text,text,'#25d366','#075e54',true,true)`, context);
const hosted = context.window._generatedCode;
assert.equal((hosted.match(/<\/script>/g) || []).length, 2);
let options;
vm.runInNewContext(hosted.match(/<script>([\s\S]*?)<\/script>/)[1], {whatsapp_widget: o => options = o});
assert.equal(options.SiteName, text);
assert.equal(options.Message, text);
assert.equal(options.BrandingText, '');
assert.equal(options.AutoOpen, true);
vm.runInContext(`currentTab='selfhosted'; generateCode('919876543210',text,text,text,text,text,'#25d366','#075e54',true,true)`, context);
const standalone = context.window._generatedCode;
assert(!standalone.includes('<img'));
assert(standalone.includes('&lt;img'));
assert(standalone.includes('left:20px'));
assert(standalone.includes('<button type="button"'));
for (const number of ['', '+919876543210', '123', '01234567', '1234567890123456', '91 9876543210']) {
  context.number = number;
  vm.runInContext(`generateCode(number,'','','','','','#25d366','#075e54',false,false)`, context);
  assert.equal(context.window._generatedCode, '');
}
assert(!html.includes('Start 14-day free trial'));
assert(!html.includes('₹199'));
assert(html.includes('utm_content=installation_help'));
new vm.Script(fs.readFileSync('widget.js', 'utf8'));
console.log('PASS: hosted JS round-trip, script breakout, standalone HTML escaping, number validation, CTA and removed offers');
