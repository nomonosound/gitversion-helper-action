import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";

const getPRnumber = async () => {
  if (context?.issue?.number) {
    return context.issue.number;
  }
  const githubToken = core.getInput("githubToken");
  const octokit = getOctokit(githubToken);

  const branchName = context.ref;
  console.log(`branchName: ${branchName}`);
  return (
    await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      // https://octokit.github.io/rest.js/v22/#repos-list-pull-requests-associated-with-commit
      // To list the open or merged pull requests associated with a branch, you can set the commit_sha parameter to the branch name.
      commit_sha: branchName,
      owner: context.repo.owner,
      repo: context.repo.repo,
    })
  ).data[0].number;
};

try {
  const semVer = core.getInput("SemVer");
  const ShortSha = core.getInput("ShortSha");
  const useTagIfExists = core.getBooleanInput("useTagIfExists");
  const preReleaseNumber = core.getInput("preReleaseNumber");
  const simplePRversion = core.getInput("simplePRversion");

  let pythonCompatibleVersion = semVer;
  let calculatedSemVer = semVer;
  let tagValue = null;
  const isRelease = !calculatedSemVer.includes("-");

  console.log(`context.ref: ${context.ref}`);
  if (context.ref.startsWith("refs/tags")) {
    tagValue = context.ref.replace("refs/tags/", "");
  }

  if (isRelease) {
    console.log("Running in Release mode");
    calculatedSemVer = semVer.concat(".", ShortSha.toLowerCase());
    // ugly code for calculating a somewhat pep440-compatible string
    const versionParts = calculatedSemVer.split("-");
    pythonCompatibleVersion = `${versionParts[0]}.dev${preReleaseNumber}${Math.floor(Math.random() * 10).toString()}`;
  } else if (useTagIfExists === "true" && tagValue != null) {
    console.log(`Using semver from tag: ${tagValue}`);
    calculatedSemVer = tagValue;
    pythonCompatibleVersion = tagValue;
  } else if (simplePRversion === "true") {
    console.log("Running in simple PR mode");
    const prNumber = await getPRnumber();
    calculatedSemVer = `9999.${prNumber}.0-${ShortSha}`;
  }

  console.log(`Calculated version to be: ${calculatedSemVer}`);
  core.setOutput("semver", calculatedSemVer);
  console.log(`pythoncompatibleversion: ${pythonCompatibleVersion}`);
  core.setOutput("pythoncompatibleversion", pythonCompatibleVersion);
  console.log(`isrelease: ${isRelease}`);
  core.setOutput("isrelease", isRelease);
} catch (error) {
  core.setFailed(error.message);
}
