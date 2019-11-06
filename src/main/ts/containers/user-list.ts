import { connect } from 'react-redux';
import { UserList, UserListProps } from '../components/UserList';
import { GlobalState } from '../state';

function mapStateToProps (state: GlobalState): UserListProps {
  const users = Object.values (state.users.list);
  users.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    users,
    status: state.users.status
  };
}

export const UserListContainer = connect(
  mapStateToProps
)(UserList);
