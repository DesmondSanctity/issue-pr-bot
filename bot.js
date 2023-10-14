import {
  welcome,
  assign,
  label,
  timing,
  reassign,
  notifyPR,
  buildPR,
  testPR,
  mergePR
} from "./functions/index.js";

const bot = async (name, octokit, payload) => {
  // perform actions on application issues only
  if (payload.issue.title.match(/event/i)) {
    // when applicant issue is open, welcome the applicant
    if (name === "issues" && payload.action === "opened") {
      welcome(octokit, payload);
    }
    // assign issue to maintainer(s)
    if (name === "issue_comment" && payload.action === "created") {
      // add label to issues
      if (payload.comment.body.match("/assign")) {
        assign(octokit, payload);
      }
    }
    // comment commands
    if (name === "issue_comment" && payload.action === "created") {
      // add label to issues
      if (payload.comment.body.match("/label")) {
        label(octokit, payload);
      }
    }
    // when issue is assigned, triger the assign algorithm
    if (name === "issues" && payload.action === "assigned") {
      timing(octokit, payload);
    }
    // when issue is closed, update the readme with the event
    if (name === "issues" && payload.action === "closed") {
      reassign(octokit, payload);
    }
  }

  // perform actions on pull request only
  if (payload.pull_request.title.match(/event/i)) {
    // when pull request is open, notify the applicant
    if (name === "pull_request" && payload.action === "opened") {
      notifyPR(octokit, payload);
      buildPR(octokit, payload);
      testPR(octokit, payload);
    }
    // when pull request is approved, merge the pull request
    if (name === "pull_request" && payload.action === "approved") {
      mergePR(octokit, payload);
      notifyPR(octokit, payload);
    }
  }

  if (
    name === "installation" &&
    payload.action === "new_permissions_accepted"
  ) {
    console.info("New permissions accepted");
  } else if (name === "*") {
    console.info(
      `Webhook: ${name}.${payload.action} not yet automated or needed`
    );
  }
};

export default bot;
