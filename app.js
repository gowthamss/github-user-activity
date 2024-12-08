#!/usr/bin/env node
import { argv } from 'node:process';
import {makeFetchCall} from './fetch-client.js';
import {returnError} from './errors.js';

const githubActivity = async () => {
    const username = readUsername(argv);
    const response = await makeFetchCall(`https://api.github.com/users/${username}/events`);

    processEvents(response);
};

const processEvents = (events) => {
    if (!events.length) {
        returnError('No activities of the user.')
    }

    for (const eventt of events) {
        switch(eventt.type) {
            case 'CreateEvent':
                printCreateEvent(eventt);
                break;
            case 'PushEvent':
                printPushEvent(eventt);
                break;
            case 'WatchEvent':
                printWatchEvent(eventt);
                break;
            case 'IssuesEvent':
                printIssuesEvent(eventt);
                break;
            case 'PullRequestEvent':
                printPullRequestEvent(eventt);
                break;
            case 'PullRequestReviewCommentEvent':
                printPullRequestReviewCommentEvent(eventt);
                break;
            case 'PullRequestReviewEvent':
                printPullRequestReviewEvent(eventt);
                break;
            default:
                continue;
        }
    }
}

const printCreateEvent = eventt => {
    if (eventt.payload.ref_type === 'branch') {
        console.log(`Created ${eventt.payload.ref_type} "${eventt.payload.ref}" on "${eventt.repo.name}"`);
    } else {
        console.log(`Created a ${eventt.payload.ref_type}: ${eventt.repo.name}`);
    }
};

const printPushEvent = eventt => {
    console.log(`Pushed ${eventt.payload.commits.length} commits to "${eventt.repo.name}"`);
};

const printWatchEvent = eventt => {
    console.log(`Stated watching "${eventt.repo.name}"`);
};

const printIssuesEvent = eventt => {
    console.log(`${eventt.payload.action.substring(0,1).toUpperCase() + eventt.payload.action.substring(1)} issue on "${eventt.repo.name}"`);
};

const printPullRequestEvent = eventt => {
    console.log(`${eventt.payload.action.substring(0,1).toUpperCase() + eventt.payload.action.substring(1)} pull request on "${eventt.repo.name}"`);
};

const printPullRequestReviewCommentEvent = eventt => {
    console.log(`${eventt.payload.action.substring(0,1).toUpperCase() + eventt.payload.action.substring(1)} a comment ${eventt.payload.comment.url} on PR ${eventt.payload.pull_request.url}(${eventt.payload.pull_request.title}) of "${eventt.repo.name}"`);
};

const printPullRequestReviewEvent = eventt => {
    console.log(`${eventt.payload.action.substring(0,1).toUpperCase() + eventt.payload.action.substring(1)} a review on pull request ${eventt.payload.pull_request.url}(${eventt.payload.pull_request.title})`);
};

const readUsername = (input) => {
    const username = input[2];

    if (!username.length || username.length < 3) {
        returnError('The username should be not empty and must be more than 3 letters.');
    }

    return username;
};

githubActivity();