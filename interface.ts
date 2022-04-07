import { Octokit } from '@octokit/core';
import { PaginateInterface } from '@octokit/plugin-paginate-rest';
import { Api } from '@octokit/plugin-rest-endpoint-methods/dist-types/types';

interface MilestoneInfo {
  title: string;
  repos: string[];
}

export interface OpenMilestoneInfo extends MilestoneInfo {
  description: string;
  dueOn: string;
}

export type CloseMilestoneInfo = MilestoneInfo;

export type OctokitType = Octokit &
  Api & {
    paginate: PaginateInterface;
  };
