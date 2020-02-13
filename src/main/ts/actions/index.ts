import { FetchSingleUserAction } from './user';
import { FetchUserAction } from './users';
import { EditUserAction } from './user-edition';
import { FetchTeamAction } from './teams';
import { FetchEventAction } from './events';
import { FetchWhoamiAction } from './who-am-i';

export type Action = FetchSingleUserAction
    | EditUserAction
    | FetchEventAction
    | FetchTeamAction
    | FetchWhoamiAction
    | FetchUserAction;
