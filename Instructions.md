# Instructions

Internal use only (see the main README.md for the actual instructions).

## Important
1. Add the gitlab-runner to the docker group (automated)
```bash
sudo usermod -aG docker gitlab-runner
sudo systemctl restart gitlab-runner
```

## Create docker and shell gitlab runners
1. Generate a personal access token (edit profile > ...)
2. Use the following command to create a runner configuration on gitlab (Outside the VM):
```bash
curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
  --data "runner_type=project_type" \
  --data "project_id=<project_id>" \
  --data "description=<your_runner_description>" \
  --data "tag_list=<your_comma_separated_job_tags>" \
  --header "PRIVATE-TOKEN: <project_access_token>"
```
3. Register runner on the VM using the token returned by the previous command (Inside the VM):
```bash
sudo gitlab-runner register \
  --non-interactive \
  --url "http://192.168.56.9/gitlab/" \
  --token "<runner_token>" \
  --executor "<docker|shell>" \
  --docker-image "alpine:latest" \
  --docker-privileged \
  --docker-volumes "/etc/docker/certs.d:/etc/docker/certs.d:ro"
```
4. Restart the runner
```bash
sudo gitlab-runner restart
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

## Backend variables
```bash
################# MODIFY HERE ################
# The project id of the backend can be accessed from the
#  project's main page from Gitlab
PROJECT_ID="<project_id>"
# The token that was generated previously
TOKEN="<token>"
###############################################
#  This should be it
GITLAB_URL="http://192.168.56.9/gitlab"

# Corrected API URL
URL="$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables"

add_var() {
  local KEY=$1
  local VALUE=$2
  local MASKED=$3
  
  echo -e "Adding $KEY...\n"
  curl --request POST --header "PRIVATE-TOKEN: $TOKEN" \
    "$URL" \
    --form "key=$KEY" \
    --form "value=$VALUE" \
    --form "masked=$MASKED"
}

add_var "STAGING_SPRING_DATASOURCE_URL" "jdbc:mysql://e4l-db-staging/e4lstaging?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris" "false"
add_var "STAGING_MYSQL_USERNAME" "root" "false"
add_var "STAGING_MYSQL_PASSWORD" "12345678" "true"
add_var "STAGING_RESOURCES_STATIC_URL" "http://localhost:8084/e4lapi/" "false"

add_var "PROD_SPRING_DATASOURCE_URL" "jdbc:mysql://e4l-db-prod/e4lprod?createDatabaseIfNotExist=true&serverTimezone=Europe/Paris" "false"
add_var "PROD_MYSQL_USERNAME" "root" "false"
add_var "PROD_MYSQL_PASSWORD" "12345678" "true"
add_var "PROD_RESOURCES_STATIC_URL" "http://localhost:8085/e4lapi/" "false"

add_var "JWT_SECRET" "it_s_a_secret" "true"
add_var "SIGNATURE_KEY" "placeholder" "true"
add_var "ADMIN_EMAIL" "abc@abc.com" "true"
add_var "ADMIN_PASSWORD" "12345678" "true"
```

## Frontend variables
```bash
################# MODIFY HERE ################
# The project id of the frontend can be accessed from the 
#  project's main page from Gitlab
PROJECT_ID="<project_id>"
# The token that was generated previously
TOKEN="<token>"
###############################################
#  This should be it
GITLAB_URL="http://192.168.56.9/gitlab"

# Corrected API URL
URL="$GITLAB_URL/api/v4/projects/$PROJECT_ID/variables"

add_var() {
  local KEY=$1
  local VALUE=$2
  local MASKED=$3
  
  echo -e "Adding $KEY...\n"
  curl --request POST --header "PRIVATE-TOKEN: $TOKEN" \
    "$URL" \
    --form "key=$KEY" \
    --form "value=$VALUE" \
    --form "masked=$MASKED"
}

add_var "STAGING_API_URL" "http://localhost:8084/e4lapi" "false"
add_var "PROD_API_URL" "http://localhost:8090/e4lapi" "false"
```