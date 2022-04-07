import * as github from '@actions/github';
import {
  CloseMilestoneInfo,
  OctokitType,
  OpenMilestoneInfo
} from './interface';
import * as milestoneInfo from './milestone.json';

const printErrorAndExit = (message: string) => {
  console.error(message);
  process.exit(1);
};

const runOpenMilestones = async (
  octokit: OctokitType,
  owner: string,
  openMilestoneInfo: OpenMilestoneInfo
) => {
  const hasOpenMilestoneRepo =
    openMilestoneInfo && openMilestoneInfo.repos.length > 0;

  if (hasOpenMilestoneRepo) {
    if (!openMilestoneInfo.title) printErrorAndExit('open.title is empty');
    if (!openMilestoneInfo.dueOn) printErrorAndExit('open.dueOn is empty');
    if (!openMilestoneInfo.description)
      printErrorAndExit('open.description is empty');

    const { title, dueOn, description } = openMilestoneInfo;

    await Promise.all(
      openMilestoneInfo.repos.map(repo =>
        octokit.rest.issues.createMilestone({
          owner,
          repo,
          title,
          due_on: dueOn,
          description
        })
      )
    );
  }
};

const runCloseMilestones = async (
  octokit: OctokitType,
  owner: string,
  closeMilestoneInfo: CloseMilestoneInfo
) => {
  const hasCloseMilestoneRepo =
    closeMilestoneInfo && closeMilestoneInfo?.repos.length > 0;

  if (hasCloseMilestoneRepo) {
    if (!closeMilestoneInfo.title) printErrorAndExit('close.title is empty');

    const { title, repos } = closeMilestoneInfo;

    const findMilestoneNumberAndClose = async (repo: string) => {
      const { data: milestoneList } = await octokit.rest.issues.listMilestones({
        owner,
        repo
      });

      const foundMilestone = milestoneList.find(
        milestone => milestone.title === title
      );

      if (foundMilestone) {
        await octokit.rest.issues.updateMilestone({
          owner,
          repo,
          milestone_number: foundMilestone.number,
          state: 'closed'
        });
      }
    };

    await Promise.all(repos.map(findMilestoneNumberAndClose));
  }
};

const run = async (token: string) => {
  if (!milestoneInfo) printErrorAndExit('milestone.json file is empty');
  if (!milestoneInfo.owner) printErrorAndExit('owner is empty');

  const octokit = github.getOctokit(token);
  const owner = milestoneInfo.owner;

  const openMilestoneInfo = milestoneInfo.open;
  if (openMilestoneInfo)
    await runOpenMilestones(octokit, owner, openMilestoneInfo);

  const closeMilestoneRepo = milestoneInfo.close;
  if (closeMilestoneRepo)
    await runCloseMilestones(octokit, owner, closeMilestoneRepo);
};

const [, , token] = process.argv;

run(token);
