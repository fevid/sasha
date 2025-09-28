// DOM Elements Cache
const elements = {
    get inputConfig() { return document.getElementById('inputConfig'); },
    get outputConfig() { return document.getElementById('outputConfig'); },
    get btnAdapt() { return document.getElementById('btnAdapt'); },
    get btnCopy() { return document.getElementById('btnCopy'); },
    get btnClear() { return document.getElementById('btnClear'); },
    get btnDownload() { return document.getElementById('btnDownload'); },
    get fileInput() { return document.getElementById('fileInput'); },
    get btnProxyToggle() { return document.getElementById('btnProxyToggle'); },
    get btnAuthToggle() { return document.getElementById('btnAuthToggle'); },
    get modalProxy() { return document.getElementById('modalProxy'); },
    get modalAuth() { return document.getElementById('modalAuth'); },
    get proxyHost() { return document.getElementById('proxyHost'); },
    get proxyPort() { return document.getElementById('proxyPort'); },
    get proxyXonline() { return document.getElementById('proxyXonline'); },
    get proxyHostHeader() { return document.getElementById('proxyHostHeader'); },
    get authUser() { return document.getElementById('authUser'); },
    get authPass() { return document.getElementById('authPass'); },
    get proxyOk() { return document.getElementById('proxyOk'); },
    get proxyClose() { return document.getElementById('proxyClose'); },
    get proxyCancel() { return document.getElementById('proxyCancel'); },
    get authOk() { return document.getElementById('authOk'); },
    get authClose() { return document.getElementById('authClose'); },
    get authCancel() { return document.getElementById('authCancel'); }
};

// Global State
let proxyValues = null;
let authValues = null;

// Utility Functions
function showNotification(message, type = 'success') {
    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    if (currentLang === 'fa') {
        notification.classList.add('rtl-text');
    }

    notification.textContent = message;
    
    // Add styles
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
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)'
    });
    
    // Set background based on type
    const backgrounds = {
        success: 'linear-gradient(135deg, #00d4aa 0%, #00b4d8 100%)',
        error: 'linear-gradient(135deg, #ff6b6b 0%, #c46539 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    notification.style.background = backgrounds[type] || backgrounds.success;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
}

function copyToClipboard(text) {
    if (!text.trim()) {
        showNotification(getMessage('nothing_to_copy', 'Nothing to copy!'), 'error');
        return;
    }
    
    navigator.clipboard.writeText(text)
        .then(() => showNotification(getMessage('config_copied', 'Configuration copied!')))
        .catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showNotification(getMessage('config_copied', 'Configuration copied!'));
            } catch (err) {
                showNotification(getMessage('copy_failed', 'Failed to copy'), 'error');
            }
            document.body.removeChild(textArea);
        });
}

function downloadFile(content, filename = 'config.ovpn') {
    if (!content.trim()) {
        showNotification(getMessage('nothing_to_download', 'Nothing to download!'), 'error');
        return;
    }
    
    const blob = new Blob([content], { type: 'application/octet-stream' });
    
    // For IE/Edge
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
        showNotification(getMessage('file_downloaded', 'File downloaded!'));
        return;
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showNotification(getMessage('file_downloaded', 'File downloaded!'));
}

// Modal Functions
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Config Adaptation Logic
function adaptConfig() {
    const inputText = elements.inputConfig.value.trim();
    if (!inputText) {
        showNotification(getMessage('enter_config', 'Enter source configuration!'), 'error');
        return;
    }

    try {
        const original = inputText.split(/\r?\n/).map(line => line.trim());
        const adapted = processOpenVPNConfig(original);
        elements.outputConfig.value = adapted.join('\n');
        showNotification(getMessage('config_adapted', 'Configuration successfully adapted!'));
        
        // Scroll to output
        elements.outputConfig.scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
        });
    } catch (error) {
        console.error('Adaptation error:', error);
        showNotification(getMessage('adaptation_error', 'Error adapting configuration'), 'error');
    }
}

function processOpenVPNConfig(original) {
    // Block tags that should be preserved entirely
    const isBlockTag = tag => [
        '<ca>', '</ca>', 
        '<cert>', '</cert>', 
        '<key>', '</key>', 
        '<auth-user-pass>', '</auth-user-pass>'
    ].includes(tag);
    
    // Lines to remove (comments, management, setenv, etc.)
    const isTrash = line =>
        /^(\s*#|\s*;)/.test(line) ||
        /^management\b/.test(line) ||
        /^setenv\b/.test(line) ||
        /^machine-readable-output\b/.test(line);
    
    // Keep important lines and blocks
    const kept = [];
    let inBlock = false;
    
    for (let line of original) {
        if (isBlockTag(line)) {
            inBlock = !inBlock;
            kept.push(line);
        } else if (inBlock || (!isTrash(line) && line !== '')) {
            kept.push(line);
        }
    }
    
    // Helper functions
    const get = regex => kept.filter(line => regex.test(line));
    const find = regex => kept.find(line => regex.test(line));
    const has = value => kept.includes(value);
    const block = tag => {
        const start = kept.indexOf('<' + tag + '>');
        const end = kept.indexOf('</' + tag + '>');
        return start !== -1 && end !== -1 ? kept.slice(start, end + 1) : [];
    };
    
    // Process remotes
    const remotes = get(/^remote\s+/);
    const tcp = remotes.find(r => /\btcp/.test(r));
    const udp = remotes.find(r => /\budp/.test(r));
    const primaryRemote = tcp || udp || remotes[0] || '';
    const otherRemotes = remotes.filter(r => r !== primaryRemote);
    
    // Build output configuration
    const output = [];
    
    // Basic client configuration
    output.push('client');
    output.push('dev tun');
    
    // Add primary remote
    if (primaryRemote) output.push(primaryRemote);
    
    // Add other remotes as comments
    otherRemotes.forEach(remote => output.push('#' + remote));
    
    // Add proxy configuration if set
    if (proxyValues && proxyValues.host && proxyValues.port) {
        output.push(`http-proxy ${proxyValues.host} ${proxyValues.port}`);
        if (proxyValues.xonline) {
            output.push(`http-proxy-option CUSTOM-HEADER "X-Online-Host: ${proxyValues.xonline}"`);
        }
        if (proxyValues.hosthdr) {
            output.push(`http-proxy-option CUSTOM-HEADER "Host: ${proxyValues.hosthdr}"`);
        }
    }
    
    // Add authentication if set
    if (authValues && authValues.user && authValues.pass) {
        output.push('<auth-user-pass>');
        output.push(authValues.user);
        output.push(authValues.pass);
        output.push('</auth-user-pass>');
    }
    
    // Add routing and connection settings
    output.push('allow-recursive-routing');
    output.push(...get(/^route\s+/));
    output.push(find(/^remote-cert-tls/) || 'remote-cert-tls server');
    
    // Optional route settings
    const routeMethod = find(/^route-method/);
    if (routeMethod) output.push(routeMethod);
    
    const routeDelay = find(/^route-delay/);
    if (routeDelay) output.push(routeDelay);
    
    const persistRemoteIP = find(/^persist-remote-ip/);
    if (persistRemoteIP) output.push(persistRemoteIP);
    
    // Persistence settings
    output.push('persist-tun');
    const persistKey = find(/^persist-key/);
    if (persistKey) output.push(persistKey);
    
    // Key direction
    const keyDirection = find(/^key-direction/);
    if (keyDirection) output.push(keyDirection);
    
    // Logging and connection settings
    output.push('verb 4');
    output.push('nobind');
    output.push('ifconfig-nowarn');
    
    if (has('float')) output.push('float');
    
    // Compression and encryption
    const compLzo = find(/^comp-lzo/);
    if (compLzo) output.push(compLzo);
    
    const auth = find(/^auth\s+/);
    if (auth) output.push(auth);
    
    const dataCiphers = find(/^data-ciphers/);
    if (dataCiphers) output.push(dataCiphers);
    
    const cipher = find(/^cipher/);
    if (cipher) output.push(cipher);
    
    // Authentication settings
    const authRetry = find(/^auth-retry/);
    if (authRetry) output.push(authRetry);
    
    const authNocache = find(/^auth-nocache/);
    if (authNocache) output.push(authNocache);
    
    // Connection retry settings
    output.push(find(/^connect-retry/) || 'connect-retry infinite');
    output.push(find(/^resolv-retry/) || 'resolv-retry infinite');
    
    // MTU settings
    output.push('mssfix');
    const tunMtuExtra = find(/^tun-mtu-extra/);
    if (tunMtuExtra) output.push(tunMtuExtra);
    
    // Keepalive
    const keepalive = find(/^keepalive/);
    if (keepalive) output.push(keepalive);
    
    // DNS settings
    output.push(...get(/^dhcp-option\s+DNS/));
    const domain = find(/^dhcp-option DOMAIN/);
    if (domain) output.push(domain);
    
    // Add empty line before certificates
    output.push('');
    
    // Add certificate blocks
    output.push(...block('ca'));
    output.push(...block('key'));
    output.push(...block('cert'));
    
    return output;
}

// Event Handlers
function setupEventListeners() {
    // File input handler
    elements.fileInput.addEventListener('change', handleFileUpload);
    
    // Button handlers
    elements.btnAdapt.addEventListener('click', adaptConfig);
    elements.btnClear.addEventListener('click', handleClear);
    elements.btnCopy.addEventListener('click', () => copyToClipboard(elements.outputConfig.value));
    elements.btnDownload.addEventListener('click', () => downloadFile(elements.outputConfig.value));
    
    // Modal toggle handlers
    elements.btnProxyToggle.addEventListener('click', () => openModal(elements.modalProxy));
    elements.btnAuthToggle.addEventListener('click', () => openModal(elements.modalAuth));
    
    // Proxy modal handlers
    elements.proxyClose.addEventListener('click', () => closeModal(elements.modalProxy));
    elements.proxyCancel.addEventListener('click', () => closeModal(elements.modalProxy));
    elements.proxyOk.addEventListener('click', handleProxyOk);
    
    // Auth modal handlers
    elements.authClose.addEventListener('click', () => closeModal(elements.modalAuth));
    elements.authCancel.addEventListener('click', () => closeModal(elements.modalAuth));
    elements.authOk.addEventListener('click', handleAuthOk);
    
    // Close modals on backdrop click
    elements.modalProxy.addEventListener('click', (e) => {
        if (e.target === elements.modalProxy) {
            closeModal(elements.modalProxy);
        }
    });
    
    elements.modalAuth.addEventListener('click', (e) => {
        if (e.target === elements.modalAuth) {
            closeModal(elements.modalAuth);
        }
    });
    
    // Close modals on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(elements.modalProxy);
            closeModal(elements.modalAuth);
        }
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith('.ovpn') && !file.name.toLowerCase().endsWith('.conf')) {
        showNotification(getMessage('select_ovpn_file', 'Please select a .ovpn or .conf file'), 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function() {
        elements.inputConfig.value = reader.result;
        authValues = null;
        event.target.value = '';
        showNotification(getMessage('file_loaded', 'File successfully loaded!'));
    };
    reader.onerror = function() {
        showNotification(getMessage('file_read_error', 'Error reading file'), 'error');
    };
    reader.readAsText(file);
}

function handleClear() {
    elements.inputConfig.value = '';
    elements.outputConfig.value = '';
    authValues = null;
    proxyValues = null;
    
    // Reset modal inputs
    elements.authUser.value = '';
    elements.authPass.value = '';
    elements.proxyHost.value = '';
    elements.proxyPort.value = '';
    elements.proxyXonline.value = '';
    elements.proxyHostHeader.value = '';
    
    showNotification(getMessage('fields_cleared', 'Fields cleared!'), 'info');
}

function handleProxyOk() {
    const host = elements.proxyHost.value.trim();
    const port = elements.proxyPort.value.trim();
    
    if (!host || !port) {
        showNotification(getMessage('fill_proxy_fields', 'Fill Host and Port for proxy!'), 'error');
        return;
    }
    
    proxyValues = {
        host: host,
        port: port,
        xonline: elements.proxyXonline.value.trim(),
        hosthdr: elements.proxyHostHeader.value.trim()
    };
    
    closeModal(elements.modalProxy);
    showNotification(getMessage('proxy_settings_saved', 'Proxy settings saved!'));
}

function handleAuthOk() {
    const user = elements.authUser.value.trim();
    const pass = elements.authPass.value.trim();
    
    if (!user || !pass) {
        showNotification(getMessage('fill_auth_fields', 'Fill login and password!'), 'error');
        return;
    }
    
    authValues = {
        user: user,
        pass: pass
    };
    
    closeModal(elements.modalAuth);
    showNotification(getMessage('auth_data_saved', 'Authorization data saved!'));
    
    // Auto-adapt if input is available
    if (elements.inputConfig.value.trim()) {
        setTimeout(adaptConfig, 500);
    }
}

// File upload label update
function updateFileUploadLabel() {
    const fileInput = elements.fileInput;
    const uploadText = document.querySelector('#fileUploadLabel .upload-text');
    
    if (!uploadText || !fileInput) return;
    
    const hasFiles = fileInput.files && fileInput.files.length > 0;
    uploadText.textContent = hasFiles ? 
        getMessage('file_selected', 'File selected') : 
        getMessage('select_file', 'Select file');
}

// Add visual feedback for drag and drop
function setupDragAndDrop() {
    const inputArea = elements.inputConfig;
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        inputArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        inputArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        inputArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        inputArea.style.borderColor = 'var(--primary)';
        inputArea.style.backgroundColor = 'rgba(0, 255, 136, 0.1)';
    }
    
    function unhighlight() {
        inputArea.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        inputArea.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }
    
    inputArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.name.toLowerCase().endsWith('.ovpn') || file.name.toLowerCase().endsWith('.conf')) {
                const reader = new FileReader();
                reader.onload = function() {
                    elements.inputConfig.value = reader.result;
                    showNotification(getMessage('file_loaded', 'File successfully loaded!'));
                };
                reader.readAsText(file);
            } else {
                showNotification(getMessage('drag_ovpn_file', 'Please drag a .ovpn or .conf file'), 'error');
            }
        }
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    setupDragAndDrop();
    updateFileUploadLabel();
    
    setupLanguageDropdown();
    if (currentLang && currentLang !== 'en') {
        loadLanguage(currentLang);
    } else {
        updateDropdownSelection(currentLang);
        if (currentLang === 'fa') {
            document.body.classList.add('fa-lang');
            document.querySelectorAll('.rtl-target').forEach(el => {
                el.classList.add('rtl-text');
            });
        }
    }
    
    // Add smooth transitions to textareas
    elements.inputConfig.addEventListener('input', function() {
        this.style.borderColor = this.value.trim() ? 'rgba(0, 255, 136, 0.3)' : 'rgba(255, 255, 255, 0.1)';
    });
    
    // Add file input change listener for label update
    elements.fileInput.addEventListener('change', updateFileUploadLabel);
    
    // Initialize with empty state
    console.log('OpenVPN Config Adapter initialized');
});

// Language Management
const SUPPORTED_LANGS = ["ru", "en", "tr", "fa", "zh"];
let currentLang = localStorage.getItem("lang") || "en";
let translations = {};

// Setup Language Dropdown
function setupLanguageDropdown() {
    const dropdown = document.getElementById('languageSwitcher');
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelectorAll('.dropdown-option');
    
    // Toggle dropdown
    selected.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdown.classList.toggle('open');
    });
    
    // Handle option selection
    options.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.dataset.value;
            
            loadLanguage(selectedLang);
            
            dropdown.classList.remove('open');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });
    
    // Close dropdown on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            dropdown.classList.remove('open');
        }
    });
}

function updateDropdownSelection(lang) {
    const dropdown = document.getElementById('languageSwitcher');
    const selectedText = dropdown.querySelector('.selected-text');
    const options = dropdown.querySelectorAll('.dropdown-option');
    
    // Remove active class from all options
    options.forEach(option => option.classList.remove('active'));
    
    // Find and activate the current language option
    const activeOption = dropdown.querySelector(`[data-value="${lang}"]`);
    if (activeOption) {
        activeOption.classList.add('active');
        selectedText.textContent = activeOption.textContent;
    }
}


async function loadLanguage(lang) {
    try {
        const response = await fetch(`./lang/${lang}.json`);
        if (!response.ok) throw new Error(`Language file not found: ${lang}`);
        
        const languageData = await response.json();
        translatePage(languageData);
        
        // Remove previous language classes
        document.body.classList.remove('fa-lang');
        
        // Add RTL class to specific elements for Farsi
        const rtlTargets = document.querySelectorAll('.rtl-target');
        if (lang === 'fa') {
            document.body.classList.add('fa-lang');
            rtlTargets.forEach(el => el.classList.add('rtl-text'));
        } else {
            rtlTargets.forEach(el => el.classList.remove('rtl-text'));
        }
        
        localStorage.setItem("lang", lang);
        document.body.className = document.body.className.replace(/lang-\w+/g, '') + ` lang-${lang}`;
        currentLang = lang;
        updateDropdownSelection(lang);
        
        const message = languageData.language_changed || `Language changed to ${getLanguageName(lang)}`;
        showNotification(message, 'info');
    } catch (error) {
        console.error('Failed to load language:', error);
        const errorMessage = translations.language_error || 'Failed to load language';
        showNotification(errorMessage, 'error');
    }
}

function translatePage(languageData) {
    translations = languageData;
    
    // Translate elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.getAttribute("data-i18n");
        if (languageData[key]) {
            element.textContent = languageData[key];
        }
    });

    // Translate placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const key = element.getAttribute("data-i18n-placeholder");
        if (languageData[key]) {
            element.placeholder = languageData[key];
        }
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