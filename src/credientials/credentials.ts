import { Octokit } from "@octokit/rest";
export const owner = process.env.REPO_OWNER;
export const repo = process.env.REPO_NAME;
export const octokit: any = new Octokit({
  auth:"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"
  //  process.env.PERSONAL_ACCESS_TOKEN,
});
