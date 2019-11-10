import { connect } from 'react-redux';
import { UserList, UserListProps } from '../components/UserList';
import { GlobalState } from '../state';
import { fetchUsers } from '../actions/users';

function mapStateToProps (state: GlobalState) {
  const users = Object.values (state.users.list);
  users.sort ((a, b) => a.name.localeCompare (b.name));
  return {
    users,
    status: state.users.status
  };
}

const mapDispatchToProps = {
  fetchUsers
};

export const UserListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList);
