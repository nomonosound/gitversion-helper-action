const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const semVer = core.getInput('SemVer');
    const ShortSha = core.getInput('ShortSha');

    calculatedSemVer = semVer;
    if (semVer.includes('-')) {
        calculatedSemVer = semVer.concat(ShortSha);s
    }

    core.setOutput("semver", calculatedSemVer);
} catch (error) {
    core.setFailed(error.message);
}