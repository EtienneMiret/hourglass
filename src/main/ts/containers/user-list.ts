import { connect} from 'react-redux';
import { UserList, UserListProps } from '../components/UserList';
import { GlobalState } from '../state';

function mapStateToProps (state: GlobalState): UserListProps {
  return {
    users: state.users.list,
    status: state.users.status
  };
}

export const UserListContainer = connect(
  mapStateToProps
)(UserList);
