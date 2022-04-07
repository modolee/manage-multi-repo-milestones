# Manage Multi Repo Milestones

# Preconfiguration

## Create new Github personal access Token (GPA_TOKEN)

- [Github new token](https://github.com/settings/tokens/new)
- scope: repo(all)

## Fork this repo to your (organization) github

- Moved to forked repo

## Create new secrets

- Settings > Security > Secrets > Actions > New repository secret
- Name: GPA_TOKEN
- Value: Created token that above

# How to use

## Just modify and push

- modify `src/milestone.json`

```json
{
  "owner": "modolee", # Your github (orgnization) name
  "open": { # Create new milestones
    "title": "Sprint2", # Milestone name
    "description": "This is 2nd Sprint", # Milestone description
    "dueOn": "2022-04-08T09:00:00+09:00", # Due date
    "repos": ["repo-a-name", "repo-b-name"]  # Array of repo names
  },
  "close": { # Close existed milestones
    "title": "Sprint1", # Milestone name
    "repos": ["repo-a-name", "repo-b-name"] # Array of repo names
  }
}
```

- Commit and push to remote main branch
- Then will automatically run Github action
