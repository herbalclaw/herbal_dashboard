// GitHub API configuration
const GITHUB_USER = 'herbalclaw'
const DATA_REPO = 'polymarket-data-collector'
const TRADING_REPO = 'polymarket-strategy-tester'

// Fetch latest commit info
export async function fetchRepoStatus(repo: string) {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/commits?per_page=1`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      next: { revalidate: 30 } // Revalidate every 30 seconds
    })
    
    if (!response.ok) throw new Error('Failed to fetch')
    
    const commits = await response.json()
    return {
      lastCommit: commits[0]?.commit?.message || 'No commits',
      lastUpdate: commits[0]?.commit?.committer?.date || null,
      sha: commits[0]?.sha?.substring(0, 7) || 'unknown'
    }
  } catch (error) {
    return {
      lastCommit: 'Error fetching data',
      lastUpdate: null,
      sha: 'error'
    }
  }
}

// Fetch data collector stats
export async function fetchDataCollectorStats() {
  try {
    // Fetch the raw data file from GitHub
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${DATA_REPO}/master/data/raw/btc_hf_latest.json`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) return null
    
    return await response.json()
  } catch (error) {
    return null
  }
}

// Fetch trading stats
export async function fetchTradingStats() {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USER}/${TRADING_REPO}/master/trading_stats.json`, {
      next: { revalidate: 60 }
    })
    
    if (!response.ok) return null
    
    return await response.json()
  } catch (error) {
    return null
  }
}

// Calculate time ago
export function timeAgo(dateString: string | null): string {
  if (!dateString) return 'Unknown'
  
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
