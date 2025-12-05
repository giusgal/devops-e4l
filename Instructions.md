# Instructions

## Set tls for docker registry on gitlab (to automate)
Follow tutorial on gitlab site: `https://docs.gitlab.com/administration/packages/container_registry/?tab=Linux+package+%28Omnibus%29#configure-container-registry-under-an-existing-gitlab-domain`
To create an ssl certificate do this:
```bash
sudo mkdir -p /etc/gitlab/ssl
sudo openssl req -new -x509 -days 365 -nodes \
  -out /etc/gitlab/ssl/192.168.56.9.crt \
  -keyout /etc/gitlab/ssl/192.168.56.9.key
```
Then reconfigure gitlab.
