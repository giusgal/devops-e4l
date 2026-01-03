# GitLab Configuration Role

This role automates the complete GitLab setup including:

1. **Root Personal Access Token Generation** - Automatically generates a random admin token
2. **User Creation** - Creates a GitLab user from vault variables with automatic confirmation
3. **Project Creation** - Creates backend and frontend projects under the new user
4. **Repository Push** - Pushes local repositories to GitLab with CI pipeline skipped
5. **Token Management** - Generates and stores tokens for the configure-projects role

## Prerequisites

- GitLab must be installed and running
- Local repositories must exist at the paths specified in defaults/main.yml
- Vault file must be configured with required variables

## Required Vault Variables

The following variables must be defined in `group_vars/vault.yml`:

```yaml
gitlab_user_username: "e4l-admin"
gitlab_user_name: "E4L Platform Administrator"
gitlab_user_email: "admin@e4l.local"
gitlab_user_password: "ChangeMe123!"
```

## Usage

### First Time Setup

1. **Configure vault variables:**
   ```bash
   cd VM/playbook
   # Edit the vault file with your values
   nano group_vars/vault.yml
   ```

2. **Encrypt the vault file (recommended):**
   ```bash
   ansible-vault encrypt group_vars/vault.yml
   ```

3. **Run the primary playbook:**
   ```bash
   # Without encryption
   vagrant provision
   
   # With encrypted vault
   vagrant provision --provision-with=shell --args="--ask-vault-pass"
   ```

### What This Role Does

1. **Waits for GitLab** to be fully initialized
2. **Generates root token** using GitLab Rails console
3. **Creates a new user** via GitLab API with automatic confirmation
4. **Generates user token** for project management
5. **Creates two projects:**
   - Backend: lu.uni.e4l.platform.api.dev
   - Frontend: lu.uni.e4l.platform.frontend.dev
6. **Pushes repositories** to GitLab with `-o ci.skip` flag
7. **Stores generated values** for use by configure-projects role:
   - `gitlab_token`: User personal access token
   - `backend_project_id`: Backend project ID
   - `frontend_project_id`: Frontend project ID

## Integration with configure-projects Role

The configure-projects role now automatically receives:
- `gitlab_token` - from the generated user token
- `backend_project_id` - from the created backend project
- `frontend_project_id` - from the created frontend project

No manual intervention or extra variables needed!

## Repository Paths

Default paths (configurable in defaults/main.yml):
- Backend: `/vagrant/lu.uni.e4l.platform.api.dev`
- Frontend: `/vagrant/lu.uni.e4l.platform.frontend.dev`

## Security Notes

- Tokens are randomly generated (20 characters)
- Tokens expire after 365 days
- Git credentials are cleaned up after push
- Consider encrypting the vault file in production
- Debug messages show tokens - remove in production

## Troubleshooting

**GitLab not ready:**
- The role waits up to 5 minutes for GitLab to initialize
- Check: `docker ps` and `docker logs gitlab-ce`

**User already exists:**
- The API call will fail with status 400
- Remove the user in GitLab UI or via API first

**Repository push fails:**
- Ensure git is configured in the local repositories
- Check that the repositories have at least one commit
- Verify network connectivity to GitLab

**Projects already exist:**
- The API call will fail
- Delete projects in GitLab UI or use different project names

## Example Output

```
TASK [gitlab-config : Display summary]
ok: [default] => {
    "msg": [
        "GitLab configuration completed successfully!",
        "Backend project ID: 1",
        "Frontend project ID: 2",
        "User token: Ab12Cd34Ef56Gh78Ij90",
        "Repositories pushed to GitLab"
    ]
}
```
