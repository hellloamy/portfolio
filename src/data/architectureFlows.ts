import type { FlowNode, FlowEdge } from '../components/FlowChart'

export type FlowData = {
  width: number
  height: number
  nodes: FlowNode[]
  edges: FlowEdge[]
}

/* Before/after pairs share node ids wherever a box survives the redesign, so the
   morph can interpolate those boxes from one position to the other. Ids that only
   exist on one side collapse into / grow out of their parent instead. */

// ---------------------------------------------------------------------------
// tabs under search & trending
// ---------------------------------------------------------------------------
export const searchBefore: FlowData = {
  width: 1350,
  height: 480,
  nodes: [
    { id: 'openApp', label: 'Open App', x: 20, y: 214, w: 140, variant: 'start' },
    { id: 'home', label: 'Home', x: 200, y: 214, w: 140 },
    { id: 'bottomNav', label: 'Bottom Nav Bar', x: 380, y: 214, w: 150 },
    { id: 'search', label: 'Search Button', x: 570, y: 214, w: 150 },
    { id: 'forYou', label: 'For You', x: 750, y: 72, w: 150 },
    { id: 'trending', label: 'Trending', x: 750, y: 156, w: 150 },
    { id: 'news', label: 'News', x: 750, y: 240, w: 150 },
    { id: 'sports', label: 'Sports', x: 750, y: 324, w: 150 },
    { id: 'entertainment', label: 'Entertainment', x: 750, y: 408, w: 150 },
    { id: 'todaysNews', label: "Today's News", x: 940, y: 12, w: 170 },
    { id: 'whoToFollow', label: 'Who to Follow', x: 940, y: 72, w: 170 },
    { id: 'globalTrending', label: 'Global Trending', x: 940, y: 132, w: 170 },
    { id: 'nba', label: 'NBA', x: 940, y: 324, w: 110 },
    { id: 'schedule', label: 'Schedule', x: 1140, y: 264, w: 110 },
    { id: 'standings', label: 'Standings', x: 1140, y: 324, w: 110 },
    { id: 'nbaNews', label: 'News', x: 1140, y: 384, w: 110 },
  ],
  edges: [
    { from: 'openApp', to: 'home' },
    { from: 'home', to: 'bottomNav' },
    { from: 'bottomNav', to: 'search' },
    { from: 'search', to: 'forYou' },
    { from: 'search', to: 'trending' },
    { from: 'search', to: 'news' },
    { from: 'search', to: 'sports' },
    { from: 'search', to: 'entertainment' },
    { from: 'forYou', to: 'todaysNews' },
    { from: 'forYou', to: 'whoToFollow' },
    { from: 'forYou', to: 'globalTrending' },
    { from: 'sports', to: 'nba' },
    { from: 'nba', to: 'schedule' },
    { from: 'nba', to: 'standings' },
    { from: 'nba', to: 'nbaNews' },
  ],
}

export const searchAfter: FlowData = {
  width: 1350,
  height: 480,
  nodes: [
    { id: 'openApp', label: 'Open App', x: 20, y: 214, w: 140, variant: 'start' },
    { id: 'home', label: 'Home', x: 200, y: 214, w: 140 },
    { id: 'bottomNav', label: 'Bottom Nav', x: 380, y: 214, w: 150 },
    { id: 'search', label: 'Search', x: 570, y: 214, w: 150 },
    { id: 'forYou', label: 'For You', x: 750, y: 46, w: 150 },
    { id: 'trending', label: 'Trending', x: 750, y: 206, w: 150 },
    { id: 'whoToFollow', label: 'Who to Follow', x: 940, y: 46, w: 170 },
    { id: 'globalTrending', label: 'Global Trending', x: 940, y: 136, w: 170 },
    { id: 'news', label: 'News', x: 940, y: 206, w: 170 },
    { id: 'sports', label: 'Sports', x: 940, y: 311, w: 170 },
    { id: 'nfl', label: 'NFL', x: 1140, y: 241, w: 110 },
    { id: 'nba', label: 'NBA', x: 1140, y: 311, w: 110 },
    { id: 'soccer', label: 'Soccer', x: 1140, y: 381, w: 110 },
  ],
  edges: [
    { from: 'openApp', to: 'home' },
    { from: 'home', to: 'bottomNav' },
    { from: 'bottomNav', to: 'search' },
    { from: 'search', to: 'forYou' },
    { from: 'search', to: 'trending' },
    { from: 'forYou', to: 'whoToFollow' },
    { from: 'trending', to: 'globalTrending' },
    { from: 'trending', to: 'news' },
    { from: 'trending', to: 'sports' },
    { from: 'sports', to: 'nfl' },
    { from: 'sports', to: 'nba' },
    { from: 'sports', to: 'soccer' },
  ],
}

// ---------------------------------------------------------------------------
// side navigation
// ---------------------------------------------------------------------------
export const menuBefore: FlowData = {
  width: 1030,
  height: 700,
  nodes: [
    { id: 'openApp', label: 'Open App', x: 20, y: 317, w: 140, variant: 'start' },
    { id: 'home', label: 'Home', x: 200, y: 317, w: 140 },
    { id: 'hamburger', label: 'Profile Picture', x: 380, y: 317, w: 160 },
    { id: 'addAccount', label: 'Add Account', x: 600, y: 20, w: 170 },
    { id: 'profile', label: 'Profile', x: 600, y: 74, w: 170 },
    { id: 'premium', label: 'Premium', x: 600, y: 128, w: 170 },
    { id: 'videos', label: 'Video', x: 600, y: 182, w: 170 },
    { id: 'communities', label: 'Communities', x: 600, y: 236, w: 170 },
    { id: 'bookmarks', label: 'Bookmarks', x: 600, y: 290, w: 170 },
    { id: 'lists', label: 'Lists', x: 600, y: 344, w: 170 },
    { id: 'spaces', label: 'Spaces', x: 600, y: 398, w: 170 },
    { id: 'creatorStudio', label: 'Creator Studio', x: 600, y: 452, w: 170 },
    { id: 'grok', label: 'Download Grok', x: 600, y: 506, w: 170 },
    { id: 'settings', label: 'Settings', x: 600, y: 560, w: 170 },
    { id: 'helpCenter', label: 'Help Center', x: 600, y: 614, w: 170 },
    { id: 'createNewAccount', label: 'Create New Account', x: 820, y: 20, w: 190 },
    { id: 'addExistingAccount', label: 'Add Existing Account', x: 820, y: 86, w: 190 },
    { id: 'profileScreen', label: 'Profile Screen', x: 820, y: 152, w: 190 },
    { id: 'premiumPopup', label: 'Pop Up', x: 820, y: 218, w: 190 },
    { id: 'commHome', label: 'Home', x: 820, y: 284, w: 190 },
    { id: 'commExplore', label: 'Explore', x: 820, y: 350, w: 190 },
    { id: 'programs', label: 'Programs', x: 820, y: 416, w: 190 },
    { id: 'tools', label: 'Tools', x: 820, y: 482, w: 190 },
    { id: 'support', label: 'Support', x: 820, y: 548, w: 190 },
    { id: 'helpExternal', label: 'External Site', x: 820, y: 614, w: 190 },
  ],
  edges: [
    { from: 'openApp', to: 'home' },
    { from: 'home', to: 'hamburger' },
    { from: 'hamburger', to: 'addAccount' },
    { from: 'hamburger', to: 'profile' },
    { from: 'hamburger', to: 'premium' },
    { from: 'hamburger', to: 'videos' },
    { from: 'hamburger', to: 'communities' },
    { from: 'hamburger', to: 'bookmarks' },
    { from: 'hamburger', to: 'lists' },
    { from: 'hamburger', to: 'spaces' },
    { from: 'hamburger', to: 'creatorStudio' },
    { from: 'hamburger', to: 'grok' },
    { from: 'hamburger', to: 'settings' },
    { from: 'hamburger', to: 'helpCenter' },
    { from: 'addAccount', to: 'createNewAccount' },
    { from: 'addAccount', to: 'addExistingAccount' },
    { from: 'profile', to: 'profileScreen' },
    { from: 'premium', to: 'premiumPopup' },
    { from: 'communities', to: 'commHome' },
    { from: 'communities', to: 'commExplore' },
    { from: 'creatorStudio', to: 'programs' },
    { from: 'creatorStudio', to: 'tools' },
    { from: 'creatorStudio', to: 'support' },
    { from: 'helpCenter', to: 'helpExternal' },
  ],
}

export const menuAfter: FlowData = {
  width: 1030,
  height: 700,
  nodes: [
    { id: 'openApp', label: 'Open App', x: 20, y: 317, w: 140, variant: 'start' },
    { id: 'home', label: 'Home', x: 200, y: 317, w: 140 },
    { id: 'hamburger', label: 'Hamburger', x: 380, y: 317, w: 160 },
    { id: 'bookmarks', label: 'Bookmarks', x: 600, y: 51, w: 170 },
    { id: 'communities', label: 'Communities', x: 600, y: 127, w: 170 },
    { id: 'videos', label: 'Videos', x: 600, y: 203, w: 170 },
    { id: 'trending', label: 'Trending', x: 600, y: 279, w: 170 },
    { id: 'grok', label: 'Grok', x: 600, y: 355, w: 170 },
    { id: 'settings', label: 'Settings', x: 600, y: 431, w: 170 },
    { id: 'helpCenter', label: 'Help Center', x: 600, y: 507, w: 170 },
    { id: 'premium', label: 'Premium', x: 600, y: 583, w: 170 },
    { id: 'commHome', label: 'Home', x: 820, y: 107, w: 170 },
    { id: 'commExplore', label: 'Explore', x: 820, y: 183, w: 170 },
    { id: 'helpExternal', label: 'External Site', x: 820, y: 507, w: 170 },
    { id: 'premiumPopup', label: 'Pop Up', x: 820, y: 583, w: 170 },
  ],
  edges: [
    { from: 'openApp', to: 'home' },
    { from: 'home', to: 'hamburger' },
    { from: 'hamburger', to: 'bookmarks' },
    { from: 'hamburger', to: 'communities' },
    { from: 'hamburger', to: 'videos' },
    { from: 'hamburger', to: 'trending' },
    { from: 'hamburger', to: 'grok' },
    { from: 'hamburger', to: 'settings' },
    { from: 'hamburger', to: 'helpCenter' },
    { from: 'hamburger', to: 'premium' },
    { from: 'communities', to: 'commHome' },
    { from: 'communities', to: 'commExplore' },
    { from: 'helpCenter', to: 'helpExternal' },
    { from: 'premium', to: 'premiumPopup' },
  ],
}
