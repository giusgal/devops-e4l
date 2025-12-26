# Instructions

## Important
1. Add the gitlab-runner to the docker group
```bash
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

## Set tls for docker registry on gitlab (automated)
1. Go inside the integration server VM
1. Create a file `san.cnf` and paste the following content
```bash
[ req ]
default_bits       = 4096
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = req_ext

[ dn ]
CN = 192.168.56.9

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
IP.1 = 192.168.56.9
```
1. Generate certificate
```bash
openssl req -x509 -nodes -newkey rsa:4096 \
  -keyout 192.168.56.9.key \
  -out 192.168.56.9.crt \
  -days 365 \
  -config san.cnf \
  -extensions req_ext
```
1. Install certificate for gitlab with the following commands
```bash
sudo mkdir -p /etc/gitlab/ssl
sudo cp 192.168.56.9.crt /etc/gitlab/ssl/
sudo cp 192.168.56.9.key /etc/gitlab/ssl/
sudo chmod 600 /etc/gitlab/ssl/192.168.56.9.key
```
1. Modify `/etc/gitlab/gitlab.rb` with the following lines
```bash
registry_external_url "https://192.168.56.9:5050"

registry_nginx['enable'] = true # IMPORTANT!!!
registry_nginx['ssl_certificate']     = "/etc/gitlab/ssl/192.168.56.9.crt"
registry_nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/192.168.56.9.key"
```
1. Reload gitlab
```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
```
1. Install certificate for Docker (IMPORTANT!!!)
```bash
sudo mkdir -p /etc/docker/certs.d/192.168.56.9:5050
sudo cp /etc/gitlab/ssl/192.168.56.9.crt /etc/docker/certs.d/192.168.56.9:5050/ca.crt
sudo systemctl restart docker
```
1. Test docker
username and password are those of your gitlab user
```bash
docker login 192.168.56.9:5050
```
