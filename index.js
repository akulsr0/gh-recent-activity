import Axios from "axios";

const getGithubLink = (slug) => `https://github.com/${slug}`;
const toTitle = (str) => str.slice(0, 1).toUpperCase() + str.slice(1);

const getUserObj = (event) => {
  return {
    name: event.actor.login,
    link: getGithubLink(event.actor.login),
    img: event.actor.avatar_url,
  };
};

const getRepoObj = (event) => {
  return {
    name: event.repo.name,
    link: getGithubLink(event.repo.name),
  };
};

const eventSerializer = {
  WatchEvent: (event, options) => {
    const _text = `Starred ${event.repo.name}`;
    const text = options.includeEmoji ? `⭐ ${_text}` : _text;
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    return { text, user, repo, type: "star" };
  },
  PushEvent: (event, options) => {
    if (!options.includeCommits) return null;
    const _commitText = event.payload.size > 1 ? "commits" : "commit";
    const _text = `Pushed ${event.payload.size} ${_commitText} to ${event.repo.name}`;
    const text = options.includeEmoji ? `✍️ ${_text}` : _text;
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    return { text, user, repo, type: "commit" };
  },
  PullRequestEvent: (event, options) => {
    const prState = event.payload.pull_request.state;
    const isPRMerged = event.payload.pull_request.merged;
    const _actionText = (() => {
      if (prState === "open") return "Opened";
      if (prState === "closed") {
        if (isPRMerged) return "Merged";
        return "Closed";
      }
      return toTitle(prState);
    })();
    const _actionEmoji = (() => {
      if (prState === "open") return "💪";
      if (prState === "closed") {
        if (isPRMerged) return "🎉";
        return "❌";
      }
      return toTitle("❌");
    })();
    const action = options.includeEmoji
      ? `${_actionEmoji} ${_actionText}`
      : _actionText;
    const text = `${action} PR at ${event.repo.name}`;
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    const pr = {
      prNumber: event.payload.pull_request.number,
      state: event.payload.pull_request.state,
      title: event.payload.pull_request.title,
      url: event.payload.pull_request.html_url,
    };
    return { text, user, repo, pr, type: "pull_request" };
  },
  IssuesEvent: (event, options) => {
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    const _actionText = toTitle(event.payload.action);
    const _actionEmoji = event.payload.action === "opened" ? "💪" : "❌";
    const action = options.includeEmoji
      ? `${_actionEmoji} ${_actionText}`
      : _actionText;
    const text = `${action} issue at ${event.repo.name}`;
    const issue = {
      issueNumber: event.payload.issue.number,
      url: event.payload.issue.html_url,
      title: event.payload.issue.title,
    };
    return { user, repo, text, issue, type: "issue" };
  },
  CreateEvent: (event, options) => {
    const isBranch = event.payload.ref_type === "branch";
    const isRepo = event.payload.ref_type === "repository";
    const emoji = "⚙️";
    const _text = (() => {
      if (isBranch)
        return `Created ${event.payload.ref} branch on ${event.repo.name}`;
      if (isRepo) return `Created ${event.repo.name} repository`;
    })();
    const text = options.includeEmoji ? `${emoji} ${_text}` : _text;
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    const created = {
      type: event.payload.ref_type,
      branch: event.payload.ref,
    };
    return { text, user, repo, created, type: "create" };
  },
  ForkEvent: (event, options) => {
    const user = getUserObj(event);
    const repo = getRepoObj(event);
    const _text = `Forked ${event.payload.forkee.full_name} from ${event.repo.name}`;
    const text = options.includeEmoji ? `📌 ${_text}` : _text;
    const fork = {
      name: event.payload.forkee.full_name,
      url: getGithubLink(event.payload.forkee.full_name),
      baseName: event.repo.name,
      baseUrl: getGithubLink(event.repo.name),
    };
    return { user, repo, fork, text, type: "fork" };
  },
};

const defaultOptions = {
  includeEmoji: false,
  includeCommits: false,
};
const getUserActivity = async (username, _options = defaultOptions) => {
  const options = { ...defaultOptions, ..._options };
  const url = `https://api.github.com/users/${username}/events/public`;
  const { data } = await Axios.get(url);
  if (data) {
    const events = data.filter((e) => eventSerializer.hasOwnProperty(e.type));
    const activity = events
      .map((e) => eventSerializer[e.type](e, options))
      .filter((act) => act !== null);
    console.log(activity);
  }
};

export { getUserActivity };
