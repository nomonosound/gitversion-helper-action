const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const semVer = core.getInput('SemVer');
    const ShortSha = core.getInput('ShortSha');
    const useTagIfExists = core.getBooleanInput('useTagIfExists');
    const githubRef = core.getInput('githubRef')
    const tagValue = null;

    if (githubRef.startsWith("refs/tags")) {
        tagValue = a.replace("refs/tags/", "")
      }

    calculatedSemVer = semVer;
    if (semVer.includes('-')) {
        calculatedSemVer = semVer.concat('.', ShortSha);
    }
    console.log(`Calculated version to be ${calculatedSemVer}`);
    if (useTagIfExists === true && tagValue != null) {
        core.setOutput("semver", tagValue);
    }
    else {
        core.setOutput("semver", calculatedSemVer);
    }
} catch (error) {
    core.setFailed(error.message);
}