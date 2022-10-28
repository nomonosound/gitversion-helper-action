# GitVersion-Helper-Action
Helper that can be used to enforce tag-based versioning if a version exists, and otherwise use gitversion's calculated version.

## Build it:
`npm run build`


## Use it in a github action
```yaml
---
name: build
on:
  push:
jobs:
  calculate-version:
    runs-on: ubuntu-latest
    outputs: 
      semVer: ${{ steps.gitversion.outputs.semver }}
    steps:
    - name: Checkout
      uses: actions/checkout@v2
      with:
        fetch-depth: 0

    - name: Install GitVersion
      uses: gittools/actions/gitversion/setup@v0.9.7
      with:
        versionSpec: '5.x'

    - name: Determine Version
      id: gitversion_initial
      uses: gittools/actions/gitversion/execute@v0.9.7
      with:
        useConfigFile: true

    - name: Calculate final version
      id: gitversion
      uses: nomonosound/gitversion-helper-action@2.8.0
      with:
        semver: ${{ steps.gitversion_initial.outputs.semVer }}
        shortsha: ${{ steps.gitversion_initial.outputs.ShortSha }}
        useTagIfExists: true
        githubRef: ${{ github.ref }}

  build-and-push-image:
    runs-on: ubuntu-latest
    needs: 
    - calculate-version
    env:
      SEMVER: ${{ needs.calculate-version.outputs.semVer }}
    steps:
    - run: echo "{{ env.SEMVER }}"
```
