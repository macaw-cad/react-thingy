import * as React from 'react';
import { Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../store/RootState';
import { ApplicationContextConsumerProps, AsyncTaskContext, withApplicationContext } from '../ApplicationContext';
import { Environment } from '../Environment';
import { UserData, getUsers } from '../store/api';
import { createSetUsersAction } from '../store/user/UserActions';

interface UsersStoreProps {
  users: UserData[] | null;
  setUsers: (users: UserData[]) => void;
}

type UsersAllProps = UsersStoreProps & ApplicationContextConsumerProps;
class Users extends React.Component<UsersAllProps> {
  asyncTaskContext: AsyncTaskContext;

  constructor(props: UsersAllProps) {
    super(props);

    this.asyncTaskContext = this.props.applicationContext as AsyncTaskContext;

    if (Environment.isServer) {
      props.applicationContext.addComponentDidRenderServerSideFunc(this.loadUsers.bind(this));
    }
  }

  async loadUsers(): Promise<void> {
    let getUsersPromise: Promise<void> = new Promise(async (resolve, reject) => {
      try {
        let users: UserData[] = await getUsers(this.asyncTaskContext);
        this.props.setUsers(users);
        resolve();
      } catch (error) {
        this.props.setUsers([]);
        console.log('Failed to load users. Offline?');
        reject();
      }
    });

    this.asyncTaskContext.addTask(getUsersPromise);
    return getUsersPromise;
    
  }

  componentDidMount() {
    this.loadUsers();
  }

  render() {
    const { users } = this.props;
    return (
      <div>
        { 
          !!users ?
            users.length === 0 ?
              <h2>Could not load users, are you offline?</h2>
            :
              <ul>
                { users.map((user: UserData) => (
                  <li key={user.id}>
                    {user.first_name} {user.last_name}
                  </li>
                )) }
              </ul>
          :
            <h2>Loading users...</h2>
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
      users: state.user.users
  };
};

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
      setUsers: (users: UserData[]) => dispatch(createSetUsersAction(users))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withApplicationContext<UsersAllProps>(Users));
