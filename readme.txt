================================================================================
                            DEVOPS E4L PROJECT
================================================================================

ASSUMPTIONS/PRE-REQUISITES
--------------------------
Software required:
1. Ansible (v 2.16.3 or higher)
   - Installation: https://docs.ansible.com/
   - Ensure ansible-vault is installed

2. VirtualBox (v 7.0 or higher)
   - Installation: https://www.virtualbox.org/wiki/Downloads

3. Vagrant (v 2.4.9 or higher)
   - Installation: https://www.vagrantup.com/downloads.html


ANSIBLE VAULT
-------------
The project uses Ansible Vault for secure storage of sensitive information 
(GitLab credentials, CI/CD variables, etc.).

Vault password: devops2026

View vault contents:
  ansible-vault view <git_root_folder>/VM/playbook/group_vars/vault.yml

Edit vault contents:
  ansible-vault edit <git_root_folder>/VM/playbook/group_vars/vault.yml

Note: While the vault can be edited, modifying values may break provisioning 
or the CI/CD pipeline. Keep the existing configuration unchanged for a 
successful demo.


CREATE DEVOPS ENVIRONMENT (FULLY AUTOMATED)
--------------------------------------------
The following commands create and provision the VM with a fully functional 
GitLab instance including projects, runners, and CI/CD variables.

Commands:
  cd <git_root_folder>/VM
  vagrant up --provision-with "fully_automated"
  
Password when prompted: devops2026

The automated provisioning performs:
- Docker installation
- GitLab installation
- Certificate generation for GitLab container registry
- Container registry enablement
- Certificate deployment for Docker login
- GitLab-runner installation
- GitLab user account creation
- Personal access tokens generation (root and user)
- Backend and frontend GitLab projects creation
- Local repositories push to GitLab
- CI/CD environment variables configuration
- GitLab runners creation and registration (docker and shell runners)
- Token revocation for security

Now, for simplicity, clone the repositories from GitLab to your local machine:

  cd <your_workspace>/
  git clone http://192.168.56.9/gitlab/e4lowner/lu.uni.e4l.platform.api.dev.git
  git clone http://192.168.56.9/gitlab/e4lowner/lu.uni.e4l.platform.frontend.dev.git

Then configure each repository with:

  git config --local user.name "e4lowner"
  git config --local user.email "owner@owner.com"

Warning: Using the local folders from this directory is possible but not 
suggested due to increased configuration complexity.
---
If these steps succeed, skip the "partially automated" section and proceed 
directly to scenarios.txt.


CREATE DEVOPS ENVIRONMENT (PARTIALLY AUTOMATED - OPTIONAL)
-----------------------------------------------------------
These steps are a fallback if fully automated provisioning fails.

0. Remove previously created VMs:
   cd <git_root_folder>/VM
   vagrant halt
   vagrant destroy
   rm -rf .vagrant

1. Create VM:
   vagrant up --provision-with "partially_automated"
   
   The playbooks perform:
   - Docker installation
   - GitLab installation
   - Certificate generation for GitLab container registry
   - Container registry enablement
   - Certificate deployment
   - GitLab-runner installation

2. Change root password:
   cd <git_root_folder>/VM
   vagrant ssh
   sudo gitlab-rake "gitlab:password:reset"
   username: root
   password: <your_root_password>

3. Create a GitLab user:
   Access http://192.168.56.9/gitlab in your browser.
   Create a new user with:
   - username: e4lowner
   - email: owner@owner.com
   - password: Verystrongpassword2026
   The other input fields can be freely chosen.

4. Accept new user through root:
   Login to GitLab using root credentials, accept the newly created user, 
   logout, and login with the new user credentials.

5. Create repositories on GitLab:

   Backend:
   a. Create a new empty project:
      - Click "New project" -> "Create blank project"
      - Project name: lu.uni.e4l.platform.api.dev
      - Visibility level: public
      - Do NOT initialize with README, .gitignore, or license
      
   b. Push existing backend project:
      cd <git_root_folder>/lu.uni.e4l.platform.api.dev
      rm -rf .git/
      git init
      git config --local user.name "e4lowner"
      git config --local user.email "owner@owner.com"
      git branch -M main
      git remote add origin http://192.168.56.9/gitlab/e4lowner/lu.uni.e4l.platform.api.dev.git
      git add .
      git commit -m "Initial backend commit"
      git push -u origin main -o ci.skip

   Frontend:
   a. Create a new empty project:
      - Click "New project" -> "Create blank project"
      - Project name: lu.uni.e4l.platform.frontend.dev
      - Visibility level: public
      - Do NOT initialize with README, .gitignore, or license
      
   b. Push existing frontend project:
      cd <git_root_folder>/lu.uni.e4l.platform.frontend.dev
      rm -rf .git/
      git init
      git config --local user.name "e4lowner"
      git config --local user.email "owner@owner.com"
      git branch -M main
      git remote add origin http://192.168.56.9/gitlab/e4lowner/lu.uni.e4l.platform.frontend.dev.git
      git add .
      git commit -m "Initial frontend commit"
      git push -u origin main -o ci.skip

6. Set CI/CD environment variables:
   View vault for CI/CD variables:
     ansible-vault view <git_root_folder>/VM/playbook/group_vars/vault.yml
   
   Backend:
   Go to Backend project -> Settings -> CI/CD -> Variables -> Add Variable
   Create all backend variables (backend_cicd_variables in the vault)
   Ensure variables marked as masked: true in the vault are masked in the UI
   
   Frontend:
   Go to Frontend project -> Settings -> CI/CD -> Variables -> Add Variable
   Create all frontend variables (frontend_cicd_variables in the vault)
   Ensure variables marked as masked: true in the vault are masked in the UI

7. Create docker and shell runners:

   Precondition 1: Generate a personal access token
   Follow: https://docs.gitlab.com/user/profile/personal_access_tokens/#create-a-personal-access-token
   - Select api scope only
   
   Precondition 2: Get project IDs for both repositories
   Follow: https://docs.gitlab.com/user/project/working_with_projects/#find-the-project-id
   
   Execute commands:
   cd <git_root_folder>/VM
   vagrant ssh
   
   PROJECT_ID_BACKEND=<project_id_backend>
   PROJECT_ID_FRONTEND=<project_id_frontend>
   GITLAB_TOKEN=<gitlab_token>
   
   -- BACKEND DOCKER RUNNER --
   curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
     --data "runner_type=project_type" \
     --data "project_id=$PROJECT_ID_BACKEND" \
     --data "description=[VM] docker" \
     --data "tag_list=docker-runner" \
     --header "PRIVATE-TOKEN: $GITLAB_TOKEN"
   
   sudo gitlab-runner register \
     --non-interactive \
     --url "http://192.168.56.9/gitlab/" \
     --token "<runner_token>" \
     --executor "docker" \
     --docker-image "alpine:latest" \
     --docker-privileged \
     --docker-volumes "/etc/docker/certs.d:/etc/docker/certs.d:ro"
   
   -- BACKEND SHELL RUNNER --
   curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
     --data "runner_type=project_type" \
     --data "project_id=$PROJECT_ID_BACKEND" \
     --data "description=[VM] shell" \
     --data "tag_list=shell-runner" \
     --header "PRIVATE-TOKEN: $GITLAB_TOKEN"
   
   sudo gitlab-runner register \
     --non-interactive \
     --url "http://192.168.56.9/gitlab/" \
     --token "<runner_token>" \
     --executor "shell" \
     --docker-image "alpine:latest"
   
   -- FRONTEND DOCKER RUNNER --
   curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
     --data "runner_type=project_type" \
     --data "project_id=$PROJECT_ID_FRONTEND" \
     --data "description=[VM] docker" \
     --data "tag_list=docker-runner" \
     --header "PRIVATE-TOKEN: $GITLAB_TOKEN"
   
   sudo gitlab-runner register \
     --non-interactive \
     --url "http://192.168.56.9/gitlab/" \
     --token "<runner_token>" \
     --executor "docker" \
     --docker-image "alpine:latest" \
     --docker-privileged \
     --docker-volumes "/etc/docker/certs.d:/etc/docker/certs.d:ro"
   
   -- FRONTEND SHELL RUNNER --
   curl --silent --request POST --url "http://192.168.56.9/gitlab/api/v4/user/runners" \
     --data "runner_type=project_type" \
     --data "project_id=$PROJECT_ID_FRONTEND" \
     --data "description=[VM] shell" \
     --data "tag_list=shell-runner" \
     --header "PRIVATE-TOKEN: $GITLAB_TOKEN"
   
   sudo gitlab-runner register \
     --non-interactive \
     --url "http://192.168.56.9/gitlab/" \
     --token "<runner_token>" \
     --executor "shell" \
     --docker-image "alpine:latest"
   
   sudo gitlab-runner restart


TROUBLESHOOTING
---------------
VirtualBox fails to start the VM:

If vagrant up fails with an error indicating VT-x/AMD-V is already in use, 
another hypervisor is active on the host system (e.g. KVM on Linux or 
Hyper-V/WSL2 on Windows).

This project uses VirtualBox as the Vagrant provider, which requires exclusive 
access to hardware virtualization.

Solution: Stop or disable the conflicting hypervisor.

Example (Linux hosts): Temporarily unload KVM kernel modules:
  sudo modprobe -r kvm_intel kvm_amd kvm

Note: This is a host configuration issue and not related to the project itself

================================================================================
