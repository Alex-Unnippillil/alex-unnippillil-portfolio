import fs from 'fs';
import path from 'path';

export default class DemoDataGenerator {
  private dataDir: string;

  constructor(dataDir: string = path.resolve(__dirname, '../../data')) {
    this.dataDir = dataDir;
  }

  public seed(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    const profilePath = path.join(this.dataDir, 'github-profile.json');
    if (!fs.existsSync(profilePath)) {
      const profile = {
        login: 'demo',
        name: 'Demo User',
        avatar_url: 'https://avatars.githubusercontent.com/u/0?v=4',
        bio: 'This is a demo profile',
        html_url: 'https://github.com/demo',
      };
      fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
    }

    const repositoriesPath = path.join(this.dataDir, 'github-repositories.json');
    if (!fs.existsSync(repositoriesPath)) {
      const repositories = [
        {
          id: 0,
          name: 'demo-repo',
          full_name: 'demo/demo-repo',
          html_url: 'https://github.com/demo/demo-repo',
          description: 'Example repository for demo mode',
          fork: false,
          stargazers_count: 0,
          watchers_count: 0,
          language: 'TypeScript',
          forks_count: 0,
          open_issues_count: 0,
          default_branch: 'main',
          created_at: '2021-01-01T00:00:00Z',
          updated_at: '2021-01-01T00:00:00Z',
          pushed_at: '2021-01-01T00:00:00Z',
          owner: {
            login: 'demo',
          },
        },
      ];
      fs.writeFileSync(repositoriesPath, JSON.stringify(repositories, null, 2));
    }
  }

  public wipe(): void {
    ['github-profile.json', 'github-repositories.json'].forEach((file) => {
      const filePath = path.join(this.dataDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }
}
