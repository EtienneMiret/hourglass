import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';
import { FetchTeamAction } from './teams';
import { FetchEventAction } from './events';
import { FetchWhoamiAction } from './who-am-i';
import { FetchSingleTeamAction } from './team';
import { EditTeamAction } from './team-edition';
import { FetchSingleEventAction } from './event';
import { FetchRuleAction } from './rules';
import { FetchSingleRuleAction } from './rule';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchSingleRuleAction
    | FetchRuleAction
    | FetchSingleEventAction
    | FetchEventAction
    | FetchSingleTeamAction
    | EditTeamAction
    | FetchTeamAction
    | FetchWhoamiAction
    | FetchUserAction;
