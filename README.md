# Github Recent Activity

Get recent activity of a user on Github.

## Installation

### Using CDN

```html
<script src="https://unpkg.com/gh-recent-activity@latest/index.js" />
```

### Using NPM

```bash
npm install gh-recent-activity
```

### Usage

```javascript
import { getUserActivity } from "gh-recent-activity";

const activity = await getUserActivity("akulsr0");
/*
[ 
  {
    text: 'Created main branch on akulsr0/gh-activity',
    user: {
      name: 'akulsr0',
      link: 'https://github.com/akulsr0',
      img: 'https://avatars.githubusercontent.com/u/43666833?'
    },
    repo: {
      name: 'akulsr0/gh-activity',
      link: 'https://github.com/akulsr0/gh-activity'
    },
    created: { type: 'branch', branch: 'main' },
    type: 'create'
  },
  ...
]
*/
```

#### Using Promise

```javascript
import { getUserActivity } from "gh-recent-activity";

getUserActivity("akulsr0").then((activity) => {
  // Do what you want here...
  console.log(activity);
});
```

#### Options

You can also pass an additional options param in _getUserActivity_ function.

| Option         | Default |  Type   |                      Description |
| :------------- | :-----: | :-----: | -------------------------------: |
| includeEmoji   |  false  | Boolean |  Includes emoji in activity text |
| includeCommits |  false  | Boolean | Includes user's commits activity |
