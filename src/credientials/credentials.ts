import { Octokit } from "@octokit/rest";
export const owner = process.env.REPO_OWNER;
export const repo = process.env.REPO_NAME;
export const octokit: any = new Octokit({
  auth: process.env.PERSONAL_ACCESS_TOKEN,
});
