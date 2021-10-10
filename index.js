const core = require('@actions/core');
const github = require('@actions/github');

try {
    // `who-to-greet` input defined in action metadata file
    const semVer = core.getInput('SemVer');
    const ShortSha = core.getInput('ShortSha');
    const useTagIfExists = core.getBooleanInput('useTagIfExists');
    const githubRef = core.getInput('githubRef')

    tagValue = null;
    if (githubRef.startsWith("refs/tags")) {
        tagValue = githubRef.replace("refs/tags/", "")
    }

    pythonCompatibleVersion = null;


    calculatedSemVer = semVer;
    if (semVer.includes('-')) {
        calculatedSemVer = semVer.concat('.', ShortSha.toLowerCase());


        // ugly code for calculating a somewhat pep440-compatible string
        let versionParts = calculatedSemVer.split("-")
        let pythonVersionSuffix = versionParts.slice(1).join(".").substring(0, 6)  // make sure its not too long
        let pythonCompatibleVersion = versionParts[0] + "." + pythonVersionSuffix
        if (pythonCompatibleVersion.endsWith(".")) { pythonCompatibleVersion = pythonCompatibleVersion.slice(0, -1) }
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