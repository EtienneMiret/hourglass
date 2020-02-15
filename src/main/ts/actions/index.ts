import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';
import { FetchTeamAction } from './teams';
import { FetchEventAction } from './events';
import { FetchWhoamiAction } from './who-am-i';
import { FetchSingleTeamAction } from './team';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchEventAction
    | FetchSingleTeamAction
    | FetchTeamAction
    | FetchWhoamiAction
    | FetchUserAction;
