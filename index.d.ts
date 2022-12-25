declare module "gh-recent-activity" {
  type ActivityOptions = {
    includeEmoji?: boolean;
    includeCommits?: boolean;
  };

  type ActivityEventType =
    | "star"
    | "commit"
    | "pull_request"
    | "issue"
    | "create"
    | "fork";

  type Activity = {
    text: string;
    type: ActivityEventType;
    user: {
      name: string;
      link: string;
      img: string;
    };
    repo: {
      name: string;
      link: string;
    };
    created?: {
      type: string;
      branch: string;
    };
    pr?: {
      prNumber: number;
      state: string;
      title: string;
      url: string;
    };
  };

  function getUserActivity(
    username: string,
    options: ActivityOptions
  ): Promise<Activity[]>;
}
