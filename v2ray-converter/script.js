// DOM Elements Cache
const elements = {
  get inputConfig() { return document.getElementById('inputConfig'); },
  get outputResult() { return document.getElementById('outputResult'); },
  get btnConvert() { return document.getElementById('btnConvert'); },
  get btnConvertBack() { return document.getElementById('btnConvertBack'); },
  get btnTextBase64() { return document.getElementById('btnTextBase64'); },
  get btnCopy() { return document.getElementById('btnCopy'); },
  get btnDownload() { return document.getElementById('btnDownload'); },
  get btnLoadFile() { return document.getElementById('btnLoadFile'); },
  get btnClearInput() { return document.getElementById('btnClearInput'); },
  get btnClearOutput() { return document.getElementById('btnClearOutput'); },
  get fileInput() { return document.getElementById('fileInput'); },
  get hiddenDownloadLink() { return document.getElementById('hiddenDownloadLink'); },
  get ipGeoToggle() { return document.getElementById('ipGeoToggle'); },
  get geoServiceInput() { return document.getElementById('geoServiceInput'); },
  get filterInput() { return document.getElementById('filterInput'); },
  get btnFilter() { return document.getElementById('btnFilter'); },
  get btnCountry() { return document.getElementById('btnCountry'); },
  get btnPing() { return document.getElementById('btnPing'); },
  get btnSettings() { return document.getElementById('btnSettings'); },
  get countryPopup() { return document.getElementById('countryPopup'); },
  get settingsModal() { return document.getElementById('settingsModal'); },
  get replaceWsHostInput() { return document.getElementById('replaceWsHostInput'); },
  get replaceSniInput() { return document.getElementById('replaceSniInput'); },
  get replaceNameInput() { return document.getElementById('replaceNameInput'); },
  get ipWsToggle() { return document.getElementById('ipWsToggle'); },
  get btnDedup() { return document.getElementById('btnDedup'); },
  get closeSettings() { return document.getElementById('closeSettings'); },
  get closeSettingsBottom() { return document.getElementById('closeSettingsBottom'); },
  get closeCountryPopup() { return document.getElementById('closeCountryPopup'); },
  get countrySearch() { return document.getElementById('countrySearch'); },
  get countryList() { return document.getElementById('countryList'); },
  get spinner() { return document.getElementById('spinner'); },
  get processStatus() { return document.getElementById('processStatus'); }
};

// Global State
let currentLang = localStorage.getItem("lang") || "en";
let translations = {};
let selectedCountry = 'OFF';
let pinging = false;
let resultsPing = [];
let ipWsToggled = false;

// Country List
const countries = [
  { flag: '🌎', name: 'OFF' },
  { flag: '🇦🇫', name: 'Afghanistan' },
  { flag: '🇿🇦', name: 'South Africa' },
  { flag: '🇦🇽', name: 'Åland Islands' },
  { flag: '🇦🇱', name: 'Albania' },
  { flag: '🇩🇿', name: 'Algeria' },
  { flag: '🇦🇸', name: 'American Samoa' },
  { flag: '🇦🇩', name: 'Andorra' },
  { flag: '🇦🇴', name: 'Angola' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇦🇲', name: 'Armenia' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇦🇹', name: 'Austria' },
  { flag: '🇦🇿', name: 'Azerbaijan' },
  { flag: '🇧🇭', name: 'Bahrain' },
  { flag: '🇧🇩', name: 'Bangladesh' },
  { flag: '🇧🇾', name: 'Belarus' },
  { flag: '🇧🇪', name: 'Belgium' },
  { flag: '🇧🇷', name: 'Brazil' },
  { flag: '🇧🇬', name: 'Bulgaria' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇨🇳', name: 'China' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇭🇷', name: 'Croatia' },
  { flag: '🇨🇿', name: 'Czechia' },
  { flag: '🇩🇰', name: 'Denmark' },
  { flag: '🇪🇪', name: 'Estonia' },
  { flag: '🇫🇮', name: 'Finland' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇬🇷', name: 'Greece' },
  { flag: '🇭🇰', name: 'Hong Kong' },
  { flag: '🇭🇺', name: 'Hungary' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇮🇩', name: 'Indonesia' },
  { flag: '🇮🇷', name: 'Iran' },
  { flag: '🇮🇪', name: 'Ireland' },
  { flag: '🇮🇱', name: 'Israel' },
  { flag: '🇮🇹', name: 'Italy' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇰🇿', name: 'Kazakhstan' },
  { flag: '🇰🇷', name: 'South Korea' },
  { flag: '🇱🇻', name: 'Latvia' },
  { flag: '🇱🇹', name: 'Lithuania' },
  { flag: '🇱🇺', name: 'Luxembourg' },
  { flag: '🇲🇾', name: 'Malaysia' },
  { flag: '🇲🇽', name: 'Mexico' },
  { flag: '🇳🇱', name: 'Netherlands' },
  { flag: '🇳🇿', name: 'New Zealand' },
  { flag: '🇳🇴', name: 'Norway' },
  { flag: '🇵🇰', name: 'Pakistan' },
  { flag: '🇵🇱', name: 'Poland' },
  { flag: '🇵🇹', name: 'Portugal' },
  { flag: '🇷🇴', name: 'Romania' },
  { flag: '🇷🇺', name: 'Russian Federation' },
  { flag: '🇸🇦', name: 'Saudi Arabia' },
  { flag: '🇷🇸', name: 'Serbia' },
  { flag: '🇸🇬', name: 'Singapore' },
  { flag: '🇸🇰', name: 'Slovakia' },
  { flag: '🇸🇮', name: 'Slovenia' },
  { flag: '🇪🇸', name: 'Spain' },
  { flag: '🇸🇪', name: 'Sweden' },
  { flag: '🇨🇭', name: 'Switzerland' },
  { flag: '🇹🇼', name: 'Taiwan' },
  { flag: '🇹🇭', name: 'Thailand' },
  { flag: '🇹🇷', name: 'Turkey' },
  { flag: '🇺🇦', name: 'Ukraine' },
  { flag: '🇦🇪', name: 'United Arab Emirates' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇻🇳', name: 'Vietnam' }
];

// Utility Functions
function showNotification(message, type = 'success') {
  document.querySelectorAll('.notification').forEach(el => el.remove());

  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  if (currentLang === 'fa') {
    notification.classList.add('rtl-text');
  }

  notification.textContent = message;
  
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '1rem',
    color: 'white',
    fontWeight: '600',
    zIndex: '10000',
    opacity: '0',
    transform: 'translateX(100%)',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
    textAlign: currentLang === 'fa' ? 'right' : 'left'
  });

  const bg = {
    success: 'linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%)',
    error: 'linear-gradient(135deg, #ff6b6b 0%, #c46539 100%)',
    info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  notification.style.background = bg[type] || bg.success;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateX(0)';
  }, 10);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function copyToClipboard(text) {
  if (!text.trim()) return showNotification(getMessage('nothing_to_copy', 'Nothing to copy!'), 'error');
  navigator.clipboard.writeText(text)
    .then(() => showNotification(getMessage('copied', 'Copied!')))
    .catch(() => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showNotification(getMessage('copied', 'Copied!'));
    });
}

function downloadFile(content, filename = 'result.txt') {
  if (!content.trim()) return showNotification(getMessage('nothing_to_download', 'Nothing to download!'), 'error');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  elements.hiddenDownloadLink.href = url;
  elements.hiddenDownloadLink.download = filename;
  elements.hiddenDownloadLink.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showNotification(getMessage('downloaded', 'Downloaded!'));
}

function setStatus(html, spinning = false) {
  elements.processStatus.innerHTML = html;
  elements.spinner.style.display = spinning ? 'inline-block' : 'none';
}

// Core Conversion Logic
function extractAllJSON(text) {
  const res = [], stack = [], starts = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') { if (!stack.length) starts.push(i); stack.push('{'); }
    else if (text[i] === '}') {
      stack.pop();
      if (!stack.length && starts.length) {
        const start = starts.pop();
        try { res.push(JSON.parse(text.slice(start, i + 1))); } catch {}
      }
    }
  }
  return res;
}

function countryCodeToFlag(cc) {
  if (!cc || cc.length !== 2) return '🌐';
  return cc.toUpperCase().replace(/./g, c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65));
}

function buildGeoUrl(host) {
  const tpl = elements.geoServiceInput.value.trim().replace(/\/+$/, '');
  if (tpl.includes('{ip}')) return tpl.replace(/{ip}/g, host);
  if (tpl.includes('?')) return `${tpl}&ip=${host}`;
  return `${tpl}/${host}`;
}

// Wireguard conversion functions
function parseWireguardToIni(line) {
  try {
    const u = new URL(line);
    const p = u.searchParams;
    const priv = decodeURIComponent(u.username);
    const [host, port] = u.host.split(':');
    const address = p.get('address') || '';
    const psk = p.get('presharedkey') || '';
    const pub = p.get('publickey') || '';
    const mtu = p.get('mtu') || '1420';

    return [
      '[Interface]',
      `PrivateKey = ${priv}`,
      `Address = ${address}`,
      `MTU = ${mtu}`,
      '',
      '[Peer]',
      `PublicKey = ${pub}`,
      `PresharedKey = ${psk}`,
      `Endpoint = ${host}:${port}`,
      `PersistentKeepalive = 25`
    ].join('\n');
  } catch {
    return '';
  }
}

function parseIniToWireguard(block) {
  try {
    const lines = block.split(/\r?\n/);
    const map = {};
    lines.forEach(l => {
      const [k, v] = l.split('=').map(s => s.trim());
      if (k && v !== undefined) map[k] = v;
    });
    const url = new URL(`wireguard://${encodeURIComponent(map['PrivateKey'])}@${map['Endpoint']}`);
    url.searchParams.set('address', map['Address'] || '');
    url.searchParams.set('presharedkey', map['PresharedKey'] || '');
    url.searchParams.set('publickey', map['PublicKey'] || '');
    url.searchParams.set('mtu', map['MTU'] || '1420');
    url.searchParams.set('reserved', '0,0,0');
    return url.toString();
  } catch {
    return '';
  }
}

function parseWireguardURL(l) {
  const u = new URL(l);
  const secretKeyRaw = decodeURIComponent(u.username);
  const endpoint = u.host;
  const params = u.searchParams;
  const address = params.get('address') || '';
  const presharedKey = params.get('presharedkey') || '';
  const publicKey = params.get('publickey') || '';
  const mtu = parseInt(params.get('mtu'), 10) || 1420;

  return {
    protocol: 'wireguard',
    tag: u.hash ? decodeURIComponent(u.hash.slice(1)) : 'wireguard',
    settings: {
      address: [decodeURIComponent(address)],
      mtu,
      secretKey: secretKeyRaw,
      peers: [{
        endpoint,
        keepAlive: 25,
        preSharedKey: presharedKey,
        publicKey
      }]
    }
  };
}

// Helper function for nested object access
function getNested(obj, path) {
  return path.reduce((acc, key) =>
    (acc != null ? acc[key] : undefined)
  , obj);
}

// Extract parameters from V2Ray config
function extractParams(baseObj, params) {
  const mapping = {
    encryption: ['settings', 'vnext', 0, 'users', 0, 'encryption'],
    flow: ['settings', 'vnext', 0, 'users', 0, 'flow'],
    security: ['streamSettings', 'security'],
    allowInsecure: ['streamSettings', 'tlsSettings', 'allowInsecure'],
    alpn: ['streamSettings', 'tlsSettings', 'alpn'],
    fp: ['streamSettings', 'tlsSettings', 'fingerprint'],
    pbk: ['streamSettings', 'realitySettings', 'publicKey'],
    sid: ['streamSettings', 'realitySettings', 'shortId'],
    seed: ['streamSettings', 'kcpSettings', 'seed'],
    type: ['streamSettings', 'network'],
    host: ['streamSettings', 'wsSettings', 'headers', 'Host'],
    path: ['streamSettings', 'wsSettings', 'path'],
    serviceName: ['streamSettings', 'grpcSettings', 'serviceName'],
    ota: ['settings', 'servers', 0, 'ota']
  };

  for (const [key, path] of Object.entries(mapping)) {
    let v = getNested(baseObj, path);
    if (v != null && v !== '') {
      if (Array.isArray(v)) v = v.join(',');
      if (typeof v === 'boolean') v = v ? '1' : '0';
      params.set(key, v);
    }
  }

  const tlsSni = getNested(baseObj, ['streamSettings', 'tlsSettings', 'serverName']);
  const relSni = getNested(baseObj, ['streamSettings', 'realitySettings', 'serverName']);
  if (tlsSni) params.set('sni', tlsSni);
  else if (relSni) params.set('sni', relSni);
}

// Build URL from V2Ray outbound configuration
function buildURLFromOutbound(o, remarks, urls) {
  const proto = o.protocol;
  const tag = encodeURIComponent(remarks || o.tag || proto);
  const p = new URLSearchParams();
  let base = '';

  if (proto === 'shadowsocks') {
    (o.settings.servers || []).forEach(s => {
      const a = btoa(`${s.method}:${s.password}`).replace(/=+$/, '');
      urls.push(`ss://${a}@${s.address}:${s.port}#${tag}`);
    });
    return;
  }

  if (proto === 'vmess' || proto === 'vless') {
    const v = o.settings.vnext?.[0];
    const u = v?.users?.[0];
    if (v && u) {
      base = `${proto}://${u.id}@${v.address}:${v.port}`;
      p.set('encryption', u.encryption || u.security || (proto === 'vmess' ? 'auto' : 'none'));
      if (u.flow) p.set('flow', u.flow);
    }
  }

  if (proto === 'trojan') {
    const s = o.settings.servers?.[0];
    if (s) {
      base = `trojan://${encodeURIComponent(s.password)}@${s.address}:${s.port}`;
    }
  }

  if (proto === 'wireguard') {
    const s = o.settings;
    const peer = s.peers?.[0];
    if (s && peer) {
      const url = new URL(`wireguard://${peer.endpoint}`);
      url.username = s.secretKey;
      url.searchParams.set('address', s.address?.[0] || '');
      url.searchParams.set('presharedkey', peer.preSharedKey);
      url.searchParams.set('publickey', peer.publicKey);
      url.searchParams.set('mtu', s.mtu || 1420);
      url.searchParams.set('reserved', '0,0,0');
      urls.push(url.toString());
    }
    return;
  }

  if (proto === 'hysteria2') {
    const srv = o.settings.servers?.[0];
    const hy = o.streamSettings.hy2Settings;
    if (srv && hy) {
      base = `hysteria2://${encodeURIComponent(hy.password)}@${srv.address}:${srv.port}`;
      if (hy.use_udp_extension) p.set('insecure', '1');
      if (o.streamSettings.tlsSettings.allowInsecure) p.set('insecure', '1');
      if (o.streamSettings.tlsSettings.serverName) p.set('sni', o.streamSettings.tlsSettings.serverName);
    }
  }

  if (!base) return;

  const st = o.streamSettings || {};
  const tls = st.tlsSettings || {};
  const rel = st.realitySettings || {};

  if (st.security) p.set('security', st.security);
  if (tls.allowInsecure) p.set('allowInsecure', '1');
  if (Array.isArray(tls.alpn)) p.set('alpn', tls.alpn.join(','));
  if (tls.serverName) p.set('sni', tls.serverName);
  else if (rel.serverName) p.set('sni', rel.serverName);
  if (tls.fingerprint) p.set('fp', tls.fingerprint);
  if (rel.publicKey) p.set('pbk', rel.publicKey);
  if (rel.shortId) p.set('sid', rel.shortId);
  if (st.grpcSettings?.serviceName) p.set('serviceName', st.grpcSettings.serviceName);
  if (st.kcpSettings?.seed) p.set('seed', st.kcpSettings.seed);

  let net = st.network || '';
  if (!net) {
    if (st.wsSettings) net = 'ws';
    else if (st.httpupgradeSettings) net = 'httpupgrade';
    else if (st.splithttpSettings) net = 'splithttp';
    else if (st.httpSettings) net = 'http';
    else net = 'tcp';
  }
  if (net === 'splithttp') net = 'xhttp';
  p.set('type', net);

  let host = '';
  let path = '';
  if (net === 'ws' && st.wsSettings) {
    host = st.wsSettings.headers?.Host || '';
    path = st.wsSettings.path || '';
  } else if (net === 'xhttp' && st.xhttpSettings) {
    host = Array.isArray(st.xhttpSettings.host)
           ? st.xhttpSettings.host[0]
           : st.xhttpSettings.host || '';
    path = st.xhttpSettings.path || '';
  } else if (net === 'xhttp' && st.splithttpSettings) {
    host = st.splithttpSettings.host || '';
    path = st.splithttpSettings.path || '';
  } else if (net === 'httpupgrade' && st.httpupgradeSettings) {
    host = Array.isArray(st.httpupgradeSettings.host)
           ? st.httpupgradeSettings.host[0]
           : st.httpupgradeSettings.host || '';
    path = st.httpupgradeSettings.path || '';
  } else if (net === 'http' && st.httpSettings) {
    host = Array.isArray(st.httpSettings.host)
           ? st.httpSettings.host[0]
           : st.httpSettings.host || '';
    path = st.httpSettings.path || '';
  } else if (net === 'tcp' && st.tcpSettings?.header?.type === 'http') {
    const rq = st.tcpSettings.header.request;
    host = (rq.headers?.Host || [''])[0] || '';
    path = (rq.path || [''])[0] || '';
    p.set('headerType', 'http');
  }

  if (host) p.set('host', host);
  if (path) p.set('path', path);

  urls.push(`${base}?${p.toString()}#${tag}`);
}

// Decode base64 vmess configuration
function decodeVmessBase64(line) {
  try {
    const b64 = line.replace(/^vmess:\/\//, '').trim();
    const raw = atob(b64);
    let str;
    try {
      str = decodeURIComponent(escape(raw));
    } catch (e) {
      str = raw;
    }
    const json = JSON.parse(str);
    const ps = json.ps || '';
    const add = json.add;
    const port = json.port;
    const id = json.id;
    const params = new URLSearchParams();
    if (json.security) params.set('security', json.security);
    if (json.encryption) params.set('encryption', json.encryption);
    if (json.net) params.set('type', json.net);
    if (json.type) params.set('headerType', json.type);
    if (json.host) params.set('host', json.host);
    if (json.path) params.set('path', json.path);
    if (json.sni) params.set('sni', json.sni);
    if (json.fingerprint) params.set('fp', json.fingerprint);
    if (json.alpn) params.set('alpn', Array.isArray(json.alpn) ? json.alpn.join(',') : json.alpn);
    if (json.flow) params.set('flow', json.flow);
    if (json.pbk) params.set('pbk', json.pbk);
    if (json.sid) params.set('sid', json.sid);
    if (json.seed) params.set('seed', json.seed);
    if (json.serviceName) params.set('serviceName', json.serviceName);
    if (json.allowInsecure) params.set('allowInsecure', json.allowInsecure ? '1' : '0');
    return (`vmess://${id}@${add}:${port}${params.toString() ? '?' + params.toString() : ''}#${ps}`)
           .replace(/%2F/g, '/')
           .replace(/%2B/g, '+');
  } catch (e) {
    return line;
  }
}

// Handle various config formats
function handleSpecialJunkConfig(obj, urls) {
  if (!obj.config || typeof obj.config !== 'string') return false;
  try {
    const cfg = JSON.parse(obj.config), rootAddress = obj.address || '', rootId = obj.server_id || '';
    if (Array.isArray(cfg.outbounds)) {
      cfg.outbounds.forEach(o => {
        if (o.settings?.vnext?.[0] && !o.settings.vnext[0].address && rootAddress) o.settings.vnext[0].address = rootAddress;
        if (o.settings?.vnext?.[0]?.users?.[0] && !o.settings.vnext[0].users[0].id && rootId) o.settings.vnext[0].users[0].id = rootId;
        if (o.streamSettings?.realitySettings && cfg.outbounds[0].streamSettings?.realitySettings?.spiderX) o.streamSettings.realitySettings.spiderX = cfg.outbounds[0].streamSettings.realitySettings.spiderX;
        buildURLFromOutbound(o, obj.remarks, urls);
      });
      return true;
    }
  } catch {}
  return false;
}

// Ping functionality
const tcpBaseline = 99;
const httpBaseline = 999;
const httpFactor = tcpBaseline / httpBaseline;

async function pingHost(host) {
  const timeoutMs = 5000;
  const start = performance.now();
  const proto = location.protocol === 'https:' ? 'https:' : 'http:';
  try {
    await Promise.race([
      fetch(`${proto}//${host}`, { mode: 'no-cors' }),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs))
    ]);
    const duration = Math.round(performance.now() - start);
    const adjusted = Math.round(duration * httpFactor);
    return { host, time: adjusted, status: `📘 ${adjusted}ms` };
  } catch {
    return { host, time: Infinity, status: '❌ timeout' };
  }
}

async function pingAll() {
  pinging = true;
  resultsPing = [];
  const lines = elements.inputConfig.value.split(/\r?\n/).filter(Boolean);
  const total = lines.length;
  
  for (let i = 0; i < total; i++) {
    if (!pinging) break;
    let host;
    try {
      host = new URL(lines[i]).hostname;
    } catch {
      const m = lines[i].match(/\/\/([^\/:]+)/);
      host = m ? m[1] : lines[i];
    }
    
    const res = await pingHost(host);
    resultsPing.push({ ...res, original: lines[i] });
    setStatus(`Pinging... ${Math.round(resultsPing.length / total * 100)}%`, true);
    
    const sorted = resultsPing.slice().sort((a, b) => a.time - b.time);
    elements.outputResult.value = sorted.map(r => `${r.original} ${r.status}`).join('\n');
  }
  
  setStatus('Done!', false);
  pinging = false;
}

// Main conversion functions
function handleConvert() {
  let raw = elements.inputConfig.value;
  const f = raw.indexOf('{'), l = raw.lastIndexOf('}');
  if (f !== -1 && l > f) raw = raw.slice(f, l + 1);
  if (!raw.trim()) {
    elements.outputResult.value = 'No JSON found';
    showNotification(getMessage('enter_input', 'Enter input!'), 'error');
    return;
  }

  const objs = extractAllJSON(raw), urls = [];
  
      objs.forEach(obj => {
    if (handleSpecialJunkConfig(obj, urls)) return;
    
    // Handle various config types
    if (obj.configType === 'SHADOWSOCKS' && obj.method && obj.password && obj.server && obj.serverPort) {
      const a = btoa(`${obj.method}:${obj.password}`).replace(/=+$/, '');
      const tag = encodeURIComponent(obj.remarks || '');
      urls.push(`ss://${a}@${obj.server}:${obj.serverPort}#${tag}`);
      return;
    }
    
    if (obj.configType === 'VLESS' && obj.password && obj.server && obj.serverPort) {
      const params = new URLSearchParams();
      params.set('encryption', obj.method || 'none');
      params.set('security', obj.security || '');
      if (obj.flow) params.set('flow', obj.flow);
      if (obj.network) params.set('type', obj.network);
      if (obj.headerType) params.set('headerType', obj.headerType);
      if (obj.host) params.set('host', obj.host);
      if (obj.path) params.set('path', obj.path);
      if (obj.sni) params.set('sni', obj.sni);
      if (obj.fingerPrint) params.set('fp', obj.fingerPrint);
      if (obj.alpn) params.set('alpn', Array.isArray(obj.alpn) ? obj.alpn.join(',') : obj.alpn);
      if (obj.publicKey) params.set('pbk', obj.publicKey);
      if (obj.shortId) params.set('sid', obj.shortId);
      if (obj.allowInsecure !== undefined) params.set('allowInsecure', obj.allowInsecure ? '1' : '0');
      const tag = encodeURIComponent(obj.remarks || '');
      urls.push(`vless://${obj.password}@${obj.server}:${obj.serverPort}?${params.toString()}#${tag}`);
      return;
    }
    
    // Handle outbounds array
    (obj.outbounds || obj.fullConfig?.outbounds || []).forEach(o =>
      buildURLFromOutbound(o, obj.remarks, urls)
    );
  });

  // Handle Wireguard INI format
  const iniText = elements.inputConfig.value.trim();
  if (iniText.startsWith('[Interface]')) {
    const url = parseIniToWireguard(iniText);
    if (url) urls.push(url);
  }

  elements.outputResult.value = urls.join('\n');
  if (urls.length > 0) {
    showNotification(getMessage('converted', 'Converted!'));
  } else {
    showNotification(getMessage('no_config_found', 'No valid configuration found'), 'error');
  }
}

function handleConvertBack() {
  const raw = elements.inputConfig.value.trim();
  if (!raw) {
    elements.outputResult.value = 'No URL found';
    showNotification(getMessage('enter_input', 'Enter input!'), 'error');
    return;
  }
  
  const lines = raw.split(/\r?\n/).filter(Boolean);
  const unified = [];
  
  lines.forEach(line => {
    if (line.startsWith('ss://')) {
      const [main, hash] = line.slice(5).split('#');
      const tag = hash ? decodeURIComponent(hash) : '';
      const [auth, hp] = main.split('@');
      const [method, password] = atob(auth).split(':');
      const hostport = hp.split('?')[0];
      const [address, portStr] = hostport.split(':');
      const port = +portStr;
      unified.push({
        protocol: 'shadowsocks',
        tag,
        settings: { servers: [{ address, port, method, password }] },
        streamSettings: { network: 'tcp', security: 'none', tcpSettings: {} }
      });
      return;
    }

    if (line.startsWith('wireguard://')) {
      const obj = parseWireguardURL(line);
      if (obj) unified.push(obj);
      return;
    }

    if (line.startsWith('hysteria2://')) {
      try {
        const u = new URL(line);
        const password = decodeURIComponent(u.username);
        const [host, port] = u.host.split(':');
        const p = u.searchParams;
        const insecure = p.get('insecure') === '1';
        const sni = p.get('sni') || '';
        unified.push({
          protocol: 'hysteria2',
          tag: u.hash ? decodeURIComponent(u.hash.slice(1)) : 'hysteria2',
          settings: { servers: [{ address: host, port: parseInt(port, 10) }] },
          streamSettings: {
            network: 'hysteria2',
            security: 'tls',
            hy2Settings: { password, use_udp_extension: insecure, congestion: { down_mbps: 0, up_mbps: 0 } },
            tlsSettings: { allowInsecure: insecure, serverName: sni }
          },
          domainStrategy: 'AsIs'
        });
      } catch {}
      return;
    }

    try {
      const u = new URL(line);
      const p = u.searchParams;
      const proto = u.protocol.slice(0, -1);
      const tag = decodeURIComponent(u.hash.slice(1)) || proto;
      const typeParam = p.get('type') || 'tcp';
      const headerType = p.get('headerType') || '';
      const h = p.get('host') || '';
      const path = p.get('path') || '';
      const flow = p.get('flow') || '';
      const seed = p.get('seed') || '';
      const serviceName = p.get('serviceName') || '';
      
      const ssConf = {
        network: typeParam === 'xhttp' ? 'splithttp' : typeParam,
        security: p.get('security') || '',
        packetEncoding: p.get('packetEncoding') || '',
        tlsSettings: {
          serverName: p.get('sni') || '',
          allowInsecure: p.get('allowInsecure') === '1',
          fingerprint: p.get('fp') || '',
          alpn: p.get('alpn') ? p.get('alpn').split(',') : []
        },
        realitySettings: { 
          publicKey: p.get('pbk') || '', 
          shortId: p.get('sid') || '', 
          serverName: p.get('sni') || '' 
        },
        kcpSettings: { seed: seed },
        grpcSettings: { serviceName: serviceName },
        tcpSettings: headerType === 'http' ? { 
          header: { 
            type: 'http', 
            request: { 
              headers: { Host: [h] }, 
              path: [path] 
            } 
          } 
        } : undefined,
        httpSettings: typeParam === 'http' ? { host: [h], path } : undefined,
        splithttpSettings: typeParam === 'xhttp' ? { host: h, path } : undefined,
        httpupgradeSettings: typeParam === 'httpupgrade' ? { host: h, path } : undefined,
        wsSettings: typeParam === 'ws' && h ? { headers: { Host: h }, path } : undefined
      };

      if (proto === 'trojan') {
        ssConf.security = p.get('security') || 'tls';
        ssConf.tlsSettings = ssConf.tlsSettings || {};
        if (p.get('allowInsecure') === '1') ssConf.tlsSettings.allowInsecure = true;
        const sni = p.get('sni');
        if (sni) ssConf.tlsSettings.serverName = sni;
      }

      if (proto === 'vless') {
        unified.push({ 
          protocol: 'vless', 
          tag, 
          settings: { 
            vnext: [{ 
              address: u.hostname, 
              port: +u.port, 
              users: [{ 
                id: u.username, 
                encryption: p.get('encryption') || 'none', 
                flow, 
                serviceName 
              }] 
            }] 
          }, 
          streamSettings: ssConf 
        });
      }
      
      if (proto === 'vmess') {
        unified.push({ 
          protocol: 'vmess', 
          tag, 
          settings: { 
            vnext: [{ 
              address: u.hostname, 
              port: +u.port, 
              users: [{ 
                id: u.username, 
                security: p.get('encryption') || 'auto' 
              }] 
            }] 
          }, 
          streamSettings: ssConf 
        });
      }
      
      if (proto === 'trojan') {
        const pwd = decodeURIComponent(u.username);
        const host2 = u.hostname;
        const port2 = +u.port;
        unified.push({ 
          protocol: 'trojan', 
          tag, 
          settings: { 
            servers: [{ 
              address: host2, 
              port: port2, 
              password: pwd 
            }] 
          }, 
          streamSettings: ssConf 
        });
      }
    } catch {}
  });

  const config = {
    dns: { 
      fallbackStrategy: 'disabledIfAnyMatch', 
      servers: [{ address: '8.8.8.8', queryStrategy: 'UseIP' }] 
    },
    inbounds: [
      { listen: '0.0.0.0', port: 10805, protocol: 'socks', settings: { auth: 'noauth', udp: true }, tag: 'socks' },
      { listen: '0.0.0.0', port: 1080, protocol: 'http', settings: { allowTransparent: true }, tag: 'http' },
      { listen: '0.0.0.0', port: 10804, protocol: 'dokodemo-door', settings: { address: '0.0.0.0', network: 'tcp,udp', port: 10804 }, tag: 'dns-in' }
    ],
    log: { loglevel: 'warning' },
    outbounds: unified,
    policy: { levels: { '1': { connIdle: 30 } }, system: { statsOutboundDownlink: true, statsOutboundUplink: true } },
    routing: { domainStrategy: 'AsIs', rules: [{ inboundTag: ['dns-in'], outboundTag: 'dns-out', type: 'field' }] },
    stats: {}
  };

  elements.outputResult.value = JSON.stringify(config, null, 2);
  showNotification(getMessage('converted', 'Converted!'));
}

function handleTextBase64() {
  const text = elements.inputConfig.value.trim();
  if (!text) {
    showNotification(getMessage('enter_input', 'Enter input!'), 'error');
    return;
  }
  
  try {
    // Try to decode base64
    elements.outputResult.value = decodeURIComponent(escape(atob(text)));
    showNotification(getMessage('decoded', 'Decoded!'));
  } catch {
    // If decode fails, encode to base64
    elements.outputResult.value = btoa(unescape(encodeURIComponent(text)));
    showNotification(getMessage('encoded', 'Encoded!'));
  }
}

async function handleFilter() {
  const raw = elements.inputConfig.value.trim();
  const filterVal = elements.filterInput.value.trim();

  // Handle URL subscription downloads
  if (filterVal.match(/^https?:\/\//)) {
    const urls = filterVal.split(/\s+/);
    const downloaded = [];
    setStatus('Downloading...<br>0%', true);
    
    for (let i = 0; i < urls.length; i++) {
      let txt = '';
      try {
        const resp = await fetch(urls[i]);
        txt = resp.ok ? await resp.text() : '';
      } catch {
        try {
          const proxy = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(urls[i]);
          const resp2 = await fetch(proxy);
          txt = resp2.ok ? await resp2.text() : '';
        } catch {}
      }
      
      // Try to decode base64 if it looks like base64
      const b64 = txt.trim().replace(/\s+/g, '');
      if (/^[A-Za-z0-9+/=]+$/.test(b64) && b64.length % 4 === 0) {
        try { txt = atob(b64); } catch {}
      }
      
      downloaded.push(txt);
      setStatus(`Downloading...<br>${Math.round((i + 1) / urls.length * 100)}%`, true);
    }
    
    elements.inputConfig.value = downloaded.join('\n');
    setStatus('Done!', false);
    return;
  }

  elements.btnFilter.disabled = true;
  setStatus('Processing...<br>0%', true);
  const rawLines = elements.inputConfig.value.split(/\r?\n/).filter(Boolean);
  const results = [];

  if (elements.ipGeoToggle.checked) {
    const seen = {};
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();
      let host;
      try {
        host = new URL(line).hostname;
      } catch {
        host = (line.match(/\/\/([^\/:]+)/) || [])[1] || line;
      }
      
      if (!seen[host]) {
        try {
          const res = await fetch(buildGeoUrl(host));
          const d = await res.json();
          const code = (d.country_code || d.countryCode || d.code || d.geoplugin_countryCode || d.country || '').toUpperCase();
          let name = d.country_name || d.countryName || d.geoplugin_countryName || d.country || host;
          
          if (code) {
            const isShort = name.length <= 3 || name.toUpperCase() === code;
            if (isShort) {
              const flag = countryCodeToFlag(code);
              const entry = countries.find(c => c.flag === flag);
              if (entry) name = entry.name;
            }
            seen[host] = `${countryCodeToFlag(code)} ${name}`;
          } else {
            seen[host] = host;
          }
        } catch {
          seen[host] = host;
        }
      }
      
      results.push(`${line.split('#')[0]}#${seen[host]}`);
      setStatus(`Processing...<br>${Math.round((i + 1) / rawLines.length * 100)}%`, true);
    }
  } else {
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i].trim();
      let decoded;

      if (line.startsWith('vmess://')) {
        decoded = decodeVmessBase64(line);
      } else {
        try {
          decoded = decodeURIComponent(line);
        } catch {
          decoded = line;
        }
      }

      const term = filterVal.toLowerCase();
      const okText = !term || decoded.toLowerCase().includes(term) || rawLines[i].toLowerCase().includes(term);
      const okCountry = selectedCountry === 'OFF' || decoded.includes(selectedCountry) || rawLines[i].includes(selectedCountry);
      
      if (okText && okCountry) {
        results.push(decoded);
      }
      
      setStatus(`Processing...<br>${Math.round((i + 1) / rawLines.length * 100)}%`, true);
    }
  }

  elements.outputResult.value = results.join('\n');
  setStatus('Done!', false);
  elements.btnFilter.disabled = false;
  showNotification(getMessage('filtered', 'Filtered!'));
}

function handleFileLoad(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    elements.inputConfig.value = reader.result;
    showNotification(getMessage('file_loaded', 'File loaded!'));
  };
  reader.readAsText(file);
}

function openModal(modal) {
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function toggleCountryPopup(e) {
  e.stopPropagation();
  elements.countryPopup.classList.toggle('active');
  if (elements.countryPopup.classList.contains('active')) {
    renderCountryList('');
    setTimeout(() => elements.countrySearch?.focus(), 100);
  }
}

function renderCountryList(term) {
  const lower = term.toLowerCase();
  elements.countryList.innerHTML = '';
  countries.forEach(c => {
    const match = !term || c.name.toLowerCase().includes(lower) || c.flag === term;
    if (match) {
      const div = document.createElement('div');
      div.className = 'country-item';
      div.innerHTML = `<span>${c.flag}</span><span>${c.name}</span>`;
      div.onclick = () => {
        selectedCountry = c.flag;
        elements.btnCountry.textContent = c.flag;
        elements.countryPopup.classList.remove('active');
      };
      elements.countryList.appendChild(div);
    }
  });
}

function replaceParam(param, value) {
  if (!value) {
    showNotification(getMessage('enter_value', 'Enter value!'), 'error');
    return;
  }
  
  const lines = elements.inputConfig.value.trim().split(/\r?\n/);
  const updated = lines.map(l => {
    try {
      const u = new URL(l);
      u.searchParams.set(param, value);
      return u.toString();
    } catch {
      return l;
    }
  });
  
  elements.inputConfig.value = updated.join('\n');
  closeModal(elements.settingsModal);
  showNotification(getMessage('applied', 'Applied!'));
}

function replaceName(value) {
  if (!value) {
    showNotification(getMessage('enter_value', 'Enter value!'), 'error');
    return;
  }
  
  const newName = encodeURIComponent(value);
  const lines = elements.inputConfig.value.trim().split(/\r?\n/);
  const updated = lines.map(l => {
    try {
      const u = new URL(l);
      u.hash = `#${newName}`;
      return u.toString();
    } catch {
      return l;
    }
  });
  
  elements.inputConfig.value = updated.join('\n');
  closeModal(elements.settingsModal);
  showNotification(getMessage('applied', 'Applied!'));
}

function ipToWsHost() {
  const orig = elements.inputConfig.value.trim();
  let output = '';
  
  try {
    const parsed = JSON.parse(orig);
    parsed.outbounds?.forEach(o => {
      const ws = o.streamSettings?.wsSettings?.headers?.Host ||
                 o.streamSettings?.httpSettings?.host?.[0] ||
                 o.streamSettings?.splithttpSettings?.host || '';
      if (ws) {
        if (o.settings?.vnext?.[0]) {
          o._orig = o.settings.vnext[0].address;
          o.settings.vnext[0].address = ws;
        } else if (o.settings?.servers?.[0]) {
          o._orig = o.settings.servers[0].address;
          o.settings.servers[0].address = ws;
        }
      }
    });
    output = JSON.stringify(parsed, null, 2);
  } catch {
    const updated = orig.split('\n').map(l => {
      try {
        const u = new URL(l);
        const ws = u.searchParams.get('host');
        if (ws) {
          u.hostname = decodeURIComponent(ws);
          return u.toString();
        }
        return l;
      } catch {
        return l;
      }
    });
    output = updated.join('\n');
  }
  
  elements.outputResult.value = ipWsToggled ? orig : output;
  ipWsToggled = !ipWsToggled;
  closeModal(elements.settingsModal);
  showNotification(getMessage('applied', 'Applied!'));
}

function deduplicate() {
  const raw = elements.inputConfig.value.trim();
  let output = '';
  
  try {
    const cfg = JSON.parse(raw);
    if (Array.isArray(cfg.outbounds)) {
      const seen = new Set();
      const deduped = cfg.outbounds.filter(o => {
        const copy = { ...o };
        delete copy.tag;
        delete copy.remarks;
        const key = JSON.stringify(copy);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
      cfg.outbounds = deduped;
      output = JSON.stringify(cfg, null, 2);
    } else {
      throw '';
    }
  } catch {
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const seen = new Set();
    const deduped = [];
    for (let line of lines) {
      const core = line.split('#')[0];
      if (!seen.has(core)) {
        seen.add(core);
        deduped.push(line);
      }
    }
    output = deduped.join('\n');
  }
  
  elements.outputResult.value = output;
  closeModal(elements.settingsModal);
  showNotification(getMessage('dedup_done', 'Deduplication done!'));
}

// Event Handlers Setup
function setupEventListeners() {
  // Basic buttons
  elements.btnConvert?.addEventListener('click', handleConvert);
  elements.btnConvertBack?.addEventListener('click', handleConvertBack);
  elements.btnTextBase64?.addEventListener('click', handleTextBase64);
  elements.btnCopy?.addEventListener('click', () => copyToClipboard(elements.outputResult.value));
  elements.btnDownload?.addEventListener('click', () => downloadFile(elements.outputResult.value));
  elements.btnLoadFile?.addEventListener('click', () => elements.fileInput.click());
  elements.fileInput?.addEventListener('change', handleFileLoad);
  elements.btnClearInput?.addEventListener('click', () => {
    elements.inputConfig.value = '';
    showNotification(getMessage('cleared', 'Cleared!'));
  });
  elements.btnClearOutput?.addEventListener('click', () => {
    elements.outputResult.value = '';
    showNotification(getMessage('cleared', 'Cleared!'));
  });

  // Filter & GeoIP
  elements.btnFilter?.addEventListener('click', handleFilter);
  elements.btnPing?.addEventListener('click', () => {
    if (pinging) {
      pinging = false;
      setStatus('', false);
    } else {
      pingAll();
    }
  });

  // Modals
  elements.btnSettings?.addEventListener('click', () => openModal(elements.settingsModal));
  elements.closeSettings?.addEventListener('click', () => closeModal(elements.settingsModal));
  elements.closeSettingsBottom?.addEventListener('click', () => closeModal(elements.settingsModal));

  elements.btnCountry?.addEventListener('click', toggleCountryPopup);
  elements.closeCountryPopup?.addEventListener('click', () => elements.countryPopup.classList.remove('active'));

  // Settings actions
  document.getElementById('btnReplaceWsHost')?.addEventListener('click', () => 
    replaceParam('host', elements.replaceWsHostInput.value.trim()));
  document.getElementById('btnReplaceSni')?.addEventListener('click', () => 
    replaceParam('sni', elements.replaceSniInput.value.trim()));
  document.getElementById('btnReplaceName')?.addEventListener('click', () => 
    replaceName(elements.replaceNameInput.value.trim()));
  elements.ipWsToggle?.addEventListener('click', ipToWsHost);
  elements.btnDedup?.addEventListener('click', deduplicate);

  // Country search
  elements.countrySearch?.addEventListener('input', e => renderCountryList(e.target.value));

  // Close modals on outside click
  elements.settingsModal?.addEventListener('click', e => {
    if (e.target === elements.settingsModal) closeModal(elements.settingsModal);
  });
  elements.countryPopup?.addEventListener('click', e => {
    if (e.target === elements.countryPopup) elements.countryPopup.classList.remove('active');
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(elements.settingsModal);
      elements.countryPopup.classList.remove('active');
    }
  });

  // Close country popup on document click
  document.addEventListener('click', () => {
    elements.countryPopup.classList.remove('active');
  });
}

// Language System (keeping your working translation logic)
const SUPPORTED_LANGS = ["ru", "en", "tr", "fa", "zh"];

function setupLanguageDropdown() {
  const dropdown = document.getElementById('languageSwitcher');
  if (!dropdown) return;
  
  const selected = dropdown.querySelector('.dropdown-selected');
  const options = dropdown.querySelectorAll('.dropdown-option');

  selected?.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.value;
      if (lang !== currentLang) loadLanguage(lang);
      dropdown.classList.remove('open');
    });
  });

  document.addEventListener('click', () => dropdown.classList.remove('open'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') dropdown.classList.remove('open');
  });
}

function updateDropdownSelection(lang) {
  const dropdown = document.getElementById('languageSwitcher');
  if (!dropdown) return;
  
  const selectedText = dropdown.querySelector('.selected-text');
  dropdown.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('active'));
  const active = dropdown.querySelector(`[data-value="${lang}"]`);
  if (active) {
    active.classList.add('active');
    selectedText.textContent = active.textContent;
  }
}

async function loadLanguage(lang) {
  try {
    const res = await fetch(`./lang/${lang}.json`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    translatePage(data);
    document.body.classList.toggle('fa-lang', lang === 'fa');
    document.querySelectorAll('.rtl-target').forEach(el => {
      el.classList.toggle('rtl-text', lang === 'fa');
    });
    localStorage.setItem("lang", lang);
    document.body.className = document.body.className.replace(/lang-\w+/g, '') + ` lang-${lang}`;
    currentLang = lang;
    updateDropdownSelection(lang);
    showNotification(data.language_changed || `Language changed to ${getLanguageName(lang)}`, 'info');
  } catch {
    showNotification('Failed to load language', 'error');
  }
}

function translatePage(data) {
  translations = data;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (data[key]) el.textContent = data[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (data[key]) el.placeholder = data[key];
  });
}

function getLanguageName(lang) {
  const names = { 
    ru: 'Русский', 
    en: 'English', 
    tr: 'Türkçe', 
    fa: 'فارسی', 
    zh: '中文' 
  };
  return names[lang] || lang;
}

function getMessage(key, fallback) {
  return translations[key] || fallback;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  setupLanguageDropdown();
  
  // Initialize GeoIP service input
  if (elements.geoServiceInput) {
    elements.geoServiceInput.value = 'https://ipwhois.app/json/{ip}';
  }
  
  if (currentLang !== 'en') {
    loadLanguage(currentLang);
  } else {
    updateDropdownSelection(currentLang);
  }
});