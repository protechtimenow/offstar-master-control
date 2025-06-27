#!/usr/bin/env node

/**
 * OFFSTAR Repository Organization Script
 * Kits out GitHub with enterprise organization
 */

const { Octokit } = require('@octokit/rest');
const chalk = require('chalk');

const WALLET_ADDRESS = '0x21cC30462B8392Aa250453704019800092a16165';
const GITHUB_USERNAME = 'protechtimenow';

// Repository Categories for Enterprise Organization
const REPO_CATEGORIES = {
  'CORE_INFRASTRUCTURE': {
    repos: ['offstar-master-control', 'ob1-control-plane', 'offstar-enterprise-ai-platform'],
    topics: ['core', 'infrastructure', 'enterprise'],
    description: '🎯 Core OFFSTAR Infrastructure'
  },
  'AI_AGENTS': {
    repos: ['offstar-autonomous-agent', 'ob1-enhanced-capabilities', 'ob1-simple-ai', 'ob1-agent-hub'],
    topics: ['ai', 'agents', 'automation', 'ml'],
    description: '🤖 AI Agent Frameworks'
  },
  'BRIDGES_CONNECTORS': {
    repos: ['offstar-multi-bridge', 'blockchain-ai-infrastructure'],
    topics: ['bridge', 'connector', 'api', 'integration'],
    description: '🌉 Bridge & Connector Systems'
  },
  'DEVELOPMENT_TOOLS': {
    repos: ['offstar-cloud-ide', 'offstar-ai-dev-platform'],
    topics: ['devtools', 'ide', 'development', 'platform'],
    description: '🛠️ Development Platforms'
  },
  'EXPERIMENTAL': {
    repos: ['MIRACATECH', 'ProTechTimeNow', 'ARTISDO-ISM-Engine'],
    topics: ['experimental', 'research', 'quantum', 'consciousness'],
    description: '🔬 Experimental & Research'
  },
  'WORKSPACES': {
    repos: ['ob1-files-workspace', 'ob1-file-drop'],
    topics: ['workspace', 'files', 'analysis'],
    description: '📁 File & Data Workspaces'
  }
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function organizeRepositories() {
  console.log(chalk.cyan('🎯 Starting OFFSTAR Repository Organization...'));
  console.log(chalk.yellow(`💰 Wallet: ${WALLET_ADDRESS}`));
  
  try {
    // Get all user repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: GITHUB_USERNAME,
      per_page: 100
    });

    console.log(chalk.green(`📊 Found ${repos.length} repositories`));

    // Organize by categories
    for (const [category, config] of Object.entries(REPO_CATEGORIES)) {
      console.log(chalk.blue(`\n🏢 Processing category: ${category}`));
      
      for (const repoName of config.repos) {
        const repo = repos.find(r => r.name === repoName);
        if (!repo) {
          console.log(chalk.red(`❌ Repository ${repoName} not found`));
          continue;
        }

        console.log(chalk.yellow(`🔧 Organizing: ${repoName}`));

        try {
          // Update repository topics
          await octokit.rest.repos.replaceAllTopics({
            owner: GITHUB_USERNAME,
            repo: repoName,
            names: [...config.topics, 'offstar', 'enterprise']
          });

          // Update repository description if needed
          if (!repo.description || !repo.description.includes('OFFSTAR')) {
            await octokit.rest.repos.update({
              owner: GITHUB_USERNAME,
              repo: repoName,
              description: `${config.description} - ${repo.description || 'OFFSTAR Enterprise Component'}`
            });
          }

          console.log(chalk.green(`✅ Organized: ${repoName}`));
        } catch (error) {
          console.log(chalk.red(`❌ Error organizing ${repoName}: ${error.message}`));
        }
      }
    }

    // Create enterprise README for each category
    await createCategoryReadmes();
    
    console.log(chalk.green('\n🎉 Repository organization complete!'));
    console.log(chalk.cyan(`🔗 View at: https://github.com/${GITHUB_USERNAME}`));

  } catch (error) {
    console.error(chalk.red('❌ Error:', error.message));
    process.exit(1);
  }
}

async function createCategoryReadmes() {
  console.log(chalk.blue('\n📝 Creating category documentation...'));

  const masterReadme = `# 🎯 OFFSTAR Enterprise Ecosystem

## 💰 Wallet Integration
**Connected:** \`${WALLET_ADDRESS}\`

## 🏢 Repository Categories

${Object.entries(REPO_CATEGORIES).map(([category, config]) => 
  `### ${config.description}\n${config.repos.map(repo => `- [${repo}](https://github.com/${GITHUB_USERNAME}/${repo})`).join('\n')}\n`
).join('\n')}

## 🚀 Quick Start
1. Deploy OFFSTAR Master Control: \`https://github.com/${GITHUB_USERNAME}/offstar-master-control\`
2. Configure wallet integration: \`${WALLET_ADDRESS}\`
3. Launch enterprise dashboard via Vercel

## 📊 System Status
- **Total Repositories:** ${Object.values(REPO_CATEGORIES).reduce((acc, cat) => acc + cat.repos.length, 0)}
- **Active Categories:** ${Object.keys(REPO_CATEGORIES).length}
- **Deployment Platforms:** Vercel, GitHub Pages, Io.net, Replit

---
*Managed by OFFSTAR Master Control Hub*
`;

  try {
    // Create/update main profile README
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_USERNAME,
      repo: GITHUB_USERNAME,
      path: 'README.md',
      message: '🎯 UPDATE: OFFSTAR Enterprise organization structure',
      content: Buffer.from(masterReadme).toString('base64')
    });

    console.log(chalk.green('✅ Created enterprise documentation'));
  } catch (error) {
    console.log(chalk.yellow(`⚠️ Could not update profile README: ${error.message}`));
  }
}

// Run if called directly
if (require.main === module) {
  organizeRepositories();
}

module.exports = { organizeRepositories, REPO_CATEGORIES };