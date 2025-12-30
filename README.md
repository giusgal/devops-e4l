# devops-e4l

Final project for the DevOps course at Uni.lu.


## Diagrams

![System architecture diagram](doc/architecture.png)

*Figure: System architecture (doc/architecture.png)*

## Assumptions/Pre-requisites

### Software
1. Ansible (v 2.16.3, or higher)
- Instructions to install here: https://docs.ansible.com/
- Check installation with the command `ansible --version`
2. VirtualBox(v 7.0, or higher)
- Instructions to install here: https://www.virtualbox.org/wiki/Downloads
3. Vagrant (v 2.4.9, or higher)
- Instructions to install here: https://www.vagrantup.com/downloads.html

## Create VM
```bash
cd <git_root_folder>/VM
vagrant up
```

**Notes**
- The VM is automatically provisioned using Ansible playbooks.
- These playbooks do the following things:
    - Install Docker
    - Install Gitlab
    - Generate a certificate for the gitlab container registry
    - Enable gitlab container registry
    - Copy certificate to a specific folder enabling docker to login into the container registry
    - Install gitlab-runner

## Remaining manual steps

In order:

### 1. Change root password
```bash
cd <git_root_folder>/VM
vagrant ssh
sudo gitlab-rake "gitlab:password:reset"
# username: root
# password: <your_root_password>
```

### 2. Create a Gitlab user
Go to `http://192.168.56.9/gitlab` in your browser and follow the guided rules to create a new user.

### 3. Accept new user through root
Login to Gitlab using the root credentials, accept the newly created user, logut and login with this new user credentials.

### 4. Create a personal access token

Follow this guide here: `https://docs.gitlab.com/user/profile/personal_access_tokens/#create-a-personal-access-token`

**Notes:**
- Select all the scopes
- Keep track of this token (you can access it only once)

### 5. Create repository on Gitlab
Only backend for now.

**Notes:**
- Use the repository located at `<git_root_folder>/lu.uni.e4l.platform.api.dev`
- Stop/Cancel the pipeline after the repository is created (the runner are not yet configured so it won't work)

### 6. Set CI/CD env variables

The following script creates all the CI/CD variables needed to run the backend.

Copy it into a file on your local machine, modify the variables in the first lines, make it executable and run it.

```bash
################# MODIFY HERE ################
# The project id can be accessed from the 
#  project main page from Gitlab
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

### 7. Create docker and shell runners

Execute the following commands one after the other.
```bash
cd <git_root_folder>/VM
vagrant ssh

# <project_id> and <token> are the same that you used during the previous step
curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
  --data "runner_type=project_type" \
  --data "project_id=<project_id>" \
  --data "description=[VM] docker" \
  --data "tag_list=docker-runner" \
  --header "PRIVATE-TOKEN: <token>"

# Copy the <runner_token> token that the command returns and use it in the following command

sudo gitlab-runner register \
  --non-interactive \
  --url "http://192.168.56.9/gitlab/" \
  --token "<runner_token>" \
  --executor "docker" \
  --docker-image "alpine:latest" \
  --docker-privileged \
  --docker-volumes "/etc/docker/certs.d:/etc/docker/certs.d:ro"

# Restart the runner (IMPORTANT)
sudo gitlab-runner restart
```

```bash
# Assuming you are still connected to the VM through ssh

# <project_id> and <token> are the same that you used during the previous step
curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
  --data "runner_type=project_type" \
  --data "project_id=<project_id>" \
  --data "description=[VM] shell" \
  --data "tag_list=shell-runner" \
  --header "PRIVATE-TOKEN: <token>"

# Copy the <runner_token> token that the command returns and use it in the following command

sudo gitlab-runner register \
  --non-interactive \
  --url "http://192.168.56.9/gitlab/" \
  --token "<runner_token>" \
  --executor "shell" \
  --docker-image "alpine:latest"

# Restart the runner (IMPORTANT)
sudo gitlab-runner restart
```

### 8. Test pipeline
The commit and staging stages are fully automated while the production stage is manual.

In particular, perform the following tests:

1. Modify something in the local repository and push it to Gitlab.
2. Verify that the commit and staging stages complete without problems (assuming that no bugs were introduced in the first place)
3. Check the container registry and see if the image has been pushed
4. Access the staging backend on `http://localhost:8084/e4lapi/questionnaire` from your browser (a json page should be returned)
5. Run the manual `deploy_production` job in the `production` stage from the pipeline view on Gitlab
    - Access the blue/green production environments on `http://localhost:8085/e4lapi/questionnaire` and `http://localhost:8086/e4lapi/questionnaire` (the same json page should be returned)
7. Run the `release` job in the `production` stage
    - Access the released API on `http://localhost:8090/e4lapi/questionnaire` (the same json page should be returned)
8. Run the `rollback` job in the `production` stage
    - Access the rolled-back API on `http://localhost:8090/e4lapi/questionnaire` (the same json page should be returned)