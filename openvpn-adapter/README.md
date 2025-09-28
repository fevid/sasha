tunmerreclop/sasha
About
This project is a web-based tool designed to adapt and optimize OpenVPN configuration files (.ovpn). It processes input configurations by cleaning up unnecessary directives, prioritizing TCP/UDP remotes, and allowing users to add HTTP proxy settings or authentication credentials. The tool operates entirely in the browser, ensuring no data is sent to external servers, and provides a user-friendly interface in Russian for modifying and downloading adapted OpenVPN configs.
Features

Universal OpenVPN Support: Processes any valid OpenVPN .ovpn configuration file.
Configuration Cleanup: Removes comments, management directives, and redundant lines while preserving essential blocks like <ca>, <cert>, and <key>.
TCP/UDP Prioritization: Prioritizes TCP remotes over UDP, commenting out secondary remotes for streamlined connections.
HTTP Proxy Integration: Allows users to add HTTP proxy settings with custom headers (X-Online-Host, Host) via a modal dialog.
Authentication Support: Embeds user credentials in an <auth-user-pass> block through a modal interface.
Standardized Options: Adds reliable OpenVPN settings like client, dev tun, persist-tun, verb 4, nobind, mssfix, and others for improved compatibility.
User-Friendly Interface: Web-based UI with Russian localization, featuring buttons to adapt, copy, clear, upload, or download configs.
Client-Side Processing: All operations are performed locally in the browser for privacy and security.

Usage
Visit the website on GitHub Pages or clone the project and serve it locally by running python -m http.server 8000 in the project directory, then accessing http://localhost:8000 in your browser.

Insert OpenVPN Config:
Upload a .ovpn file using the "выгрузить файл" (Upload File) button or paste the config into the input textarea.


Configure Optional Settings:
HTTP Proxy: Click "http proxy" to open a modal and enter proxy details (IP/Host, Port, X-Online-Host, Host).
Authentication: Click "auth" to enter login and password credentials.


Adapt Configuration: Click "адаптировать" (Adapt) to process the config with added settings and cleaned-up directives.
Copy or Download:
Click "скопировать" (Copy) to copy the adapted config to the clipboard.
Click "скачать результат" (Download Result) to save the adapted config as a .ovpn file.


Clear Fields: Click "очистить" (Clear) to reset the input and output fields.

Example
Input (OpenVPN .ovpn)
# Comment
client
remote server.com 1194 udp
remote server.com 443 tcp
<ca>
CA certificate
</ca>
management 127.0.0.1 1234

Output (Adapted .ovpn)
client
dev tun
remote server.com 443 tcp
#remote server.com 1194 udp
persist-tun
verb 4
nobind
ifconfig-nowarn
mssfix
connect-retry infinite
resolv-retry infinite
remote-cert-tls server

<ca>
CA certificate
</ca>

Credits

Original project: tunmerreclop/sasha by tunmerreclop.
