Troubleshooting connection issues
=================================
### Local Bundled Server
comming soon...

### Local Stand-alone Server
1. Ensure the server is running.

### Remote Server
Check your JS console. If you are **not** seeing any red `WebSocket...` errors:

1. Ensure your server is running.
2. In the config file, ensure Addresses.Gateway has your server's IP embedded in it. For example, if your server ip is `123.45.6.78`, the `Gateway` value would be `/ip4/138.197.205.97/tcp/4002`.
3. In the client, ensure the port set in the server configuration UI matches the port value you set above:

![](https://github.com/OpenBazaar/openbazaar-desktop/blob/master/imgs/connectionIssues/setPortInUi.png)

---

If you are seeing the following error in your JS console:

![](https://github.com/OpenBazaar/openbazaar-desktop/blob/master/imgs/connectionIssues/sslProtocolError.png)

For your protection, the client will only connect to a remote server via SSL. The above error indicates that your server is not set-up to run SSL. To enable SSL, follow this [doc](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/ssl.md).

When you install the rootCA.crt file on your client machine, be sure to enable it as a trusted certificate. On OSX, this is done via the Always Trust button.

![](https://github.com/OpenBazaar/openbazaar-desktop/blob/master/imgs/connectionIssues/osxTrustCertificate.png)

---

If you are seeing the following error in your JS console:

![](https://github.com/OpenBazaar/openbazaar-desktop/blob/master/imgs/connectionIssues/sslBadHandshake.png)

It is likely one of two things:

1. You may have not properly specified your server ip when generating the server.csr file. When following this [doc](https://github.com/OpenBazaar/openbazaar-go/blob/master/docs/ssl.md), be sure to replace \<server-ip\> with the ip of your remote server when executing this command `openssl req -new -key server.key -out server.csr `...

2. If you're running on Linux, that error could also indicate that the certificate needs to be added to the trusted list. This can be done via ([detailed instructions](http://blog.tkassembled.com/410/adding-a-certificate-authority-to-the-trusted-list-in-ubuntu/)):
  - First, install libnss3-tools, which contains the certutil command: `sudo apt-get install libnss3-tools`
  - Then execute `certutil -d sql:$HOME/.pki/nssdb -A -t "C,," -n "My Homemade CA" -i my_ca.crt`.
