# Instructions

## Create gitlab server container
```bash
sudo docker compose up -d
# See logs with
sudo docker compose logs --follow gitlab
```

## Certificate for container registry
1. Log in to the container:
```bash
sudo docker exec -it gitlab bash
```

2. Create the SSL directory:
```bash
mkdir -p /etc/gitlab/ssl
cd /etc/gitlab/ssl
```

3. Create the san.cnf file. Copy and paste this block into the terminal:
```bash
cat > san.cnf <<EOF
[ req ]
default_bits       = 4096
prompt             = no
default_md         = sha256
distinguished_name = dn
req_extensions     = req_ext

[ dn ]
CN = localhost

[ req_ext ]
subjectAltName = @alt_names

[ alt_names ]
DNS.1 = localhost
IP.1  = 127.0.0.1
EOF
```

4. Generate the Certificate:
```bash
openssl req -x509 -nodes -newkey rsa:4096 \
  -keyout localhost.key \
  -out localhost.crt \
  -days 365 \
  -config san.cnf \
  -extensions req_ext
```

5. Fix Permissions:
```bash
chmod 600 localhost.key
chmod 644 localhost.crt
```

6. Exit the container:
```bash
exit
```

7. Trust the Certificate on the Host:
```bash
# 1. Create the trust directory
sudo mkdir -p /etc/docker/certs.d/localhost:5050

# 2. Copy the cert
sudo cp config/ssl/localhost.crt /etc/docker/certs.d/localhost:5050/ca.crt

# 3. Restart Docker
sudo systemctl restart docker
```

## Create repositories on gitlab
This `should` be simple

## Create runners
1. Create runner running with docker
```bash
sudo docker run -d --name gitlab-runner --restart always \
  --network host \
  -v ./gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:alpine
```
2. Create runner on gitlab (Settings->CI/CD->Runners)
3. Go inside the container and register the runner
```bash
sudo docker exec -it gitlab-runner bash
# Insert all the info from gitlab here
gitlab-runner register
```
4. Modify executor config
```bash
vi /etc/gitlab-runner/config.toml
```
Find the section `[runners.docker]` and insert the following line at the end:
```txt
network_mode = "host"
```
5. Exit and reload
```bash
exit
sudo docker restart gitlab-runner
```
