The front end for isaacpatterson.crypto and isaacgpatterson.com


# Local Development

This repository uses [batect](https://batect.dev/docs/), so no dev setup is required

To start, test, build and deploy this application, see a list of tasks and then run

```
./batect --list-tasks

#for example:
./batect test 
```

# Deployment pipeline

#TODO make build pipeline

Upon merging to master aws codepipeline will:
   - run unit tests
   - build and push to aws ecr
   - deploy to test
   - run e2e tests
   - run ui tests
   - await user action
   - deploy to prod
   - track metrics
   
# Monitoring
???

# Tech Stack

| Field | Software |
| --- | ----------- |
| Language | typescript |
| UI | react, mui |
| Storage | redux |
| Auth | cognito via amplify |
| Hosting | s3 edge buckets, cloudfront |
| Pipeline | aws codebuild, codepipeline & ecr |
| Testing | jest (unit tests), e2e tests(??), ui tests(??) |
| Crypto | metamask, yori |
| DevOps Tools | batect |