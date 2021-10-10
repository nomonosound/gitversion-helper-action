const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const semVer = core.getInput('SemVer');
    const ShortSha = core.getInput('ShortSha');
    const useTagIfExists = core.getBooleanInput('useTagIfExists');
    const githubRef = core.getInput('githubRef')
    const preReleaseNumber = core.getInput('preReleaseNumber')

    tagValue = null;
    if (githubRef.startsWith("refs/tags")) {
        tagValue = githubRef.replace("refs/tags/", "")
    }

    let pythonCompatibleVersion = semVer;


    calculatedSemVer = semVer;
    if (semVer.includes('-')) {
        calculatedSemVer = semVer.concat('.', ShortSha.toLowerCase());

        // ugly code for calculating a somewhat pep440-compatible string
        let versionParts = calculatedSemVer.split("-")
        pythonCompatibleVersion = versionParts[0] + ".dev" + preReleaseNumber + Math.floor(Math.random() * 10).toString()
    }

    if (useTagIfExists === true && tagValue != null) {
        console.log(`Using semver from tag: ${tagValue}`);
        core.setOutput("semver", tagValue);
        calculatedSemVer = tagValue;
        pythonCompatibleVersion = tagValue;
    }
    else {
        console.log(`Calculated version to be: ${calculatedSemVer}`);
        core.setOutput("semver", calculatedSemVer);
    }
    let isRelease = false;
    if (calculatedSemVer.includes("-")) {
        isRelease = false;
    } else {
        isRelease = true;
    }
    console.log(`pythoncompatibleversion: ${pythonCompatibleVersion}`);
    core.setOutput("pythoncompatibleversion", pythonCompatibleVersion);
    console.log(`isrelease: ${isRelease}`);
    core.setOutput("isrelease", isRelease);
} catch (error) {
    core.setFailed(error.message);
}