import fs from 'fs';
import path from 'path';

// Simplified GitHub profile used for preview/e2e tests
const profile: any = {
  login: 'preview-user',
  id: 1,
  node_id: 'MDQ6VXNlcjE=',
  avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/preview-user',
  html_url: 'https://github.com/preview-user',
  followers_url: '',
  following_url: '',
  gists_url: '',
  starred_url: '',
  subscriptions_url: '',
  organizations_url: '',
  repos_url: '',
  events_url: '',
  received_events_url: '',
  type: 'User',
  site_admin: false,
  name: 'Preview User',
  company: null,
  blog: '',
  location: '',
  email: null,
  hireable: null,
  bio: '',
  public_repos: 1,
  public_gists: 0,
  followers: 0,
  following: 0,
  created_at: '1970-01-01T00:00:00Z',
  updated_at: '1970-01-01T00:00:00Z',
};

// Minimal repository list
const repositories: any[] = [
  {
    id: 1,
    node_id: 'MDEwOlJlcG9zaXRvcnkx',
    name: 'demo-repo',
    full_name: 'preview-user/demo-repo',
    private: false,
    owner: {
      login: 'preview-user',
      id: 1,
      node_id: 'MDQ6VXNlcjE=',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
      gravatar_id: '',
      url: '',
      html_url: '',
      followers_url: '',
      following_url: '',
      gists_url: '',
      starred_url: '',
      subscriptions_url: '',
      organizations_url: '',
      repos_url: '',
      events_url: '',
      received_events_url: '',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/preview-user/demo-repo',
    description: 'Example repository used for testing',
    fork: false,
    url: '',
    forks_url: '',
    keys_url: '',
    collaborators_url: '',
    teams_url: '',
    hooks_url: '',
    issue_events_url: '',
    events_url: '',
    assignees_url: '',
    branches_url: '',
    tags_url: '',
    blobs_url: '',
    git_tags_url: '',
    git_refs_url: '',
    trees_url: '',
    statuses_url: '',
    languages_url: '',
    stargazers_url: '',
    contributors_url: '',
    subscribers_url: '',
    subscription_url: '',
    commits_url: '',
    git_commits_url: '',
    comments_url: '',
    issue_comment_url: '',
    contents_url: '',
    compare_url: '',
    merges_url: '',
    archive_url: '',
    downloads_url: '',
    issues_url: '',
    pulls_url: '',
    milestones_url: '',
    notifications_url: '',
    labels_url: '',
    releases_url: '',
    deployments_url: '',
    created_at: '1970-01-01T00:00:00Z',
    updated_at: '1970-01-01T00:00:00Z',
    pushed_at: '1970-01-01T00:00:00Z',
    git_url: '',
    ssh_url: '',
    clone_url: '',
    svn_url: '',
    homepage: '',
    size: 0,
    stargazers_count: 0,
    watchers_count: 0,
    language: 'TypeScript',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 0,
    license: null,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: 'main',
  },
];

const dataDir = path.resolve(__dirname, '../../data');
const profilePath = path.join(dataDir, 'github-profile.json');
const reposPath = path.join(dataDir, 'github-repositories.json');

export async function seed(): Promise<void> {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  fs.writeFileSync(reposPath, JSON.stringify(repositories, null, 2));
}

export async function reset(): Promise<void> {
  [profilePath, reposPath].forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
}

export default { seed, reset };
