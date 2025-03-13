import HasAccess from "../context/HasAccess";
import ListUsers from "../features/user/user-component/list-user/listUser";

const ListUser = () => {
  return (
    <div>
      {/* <HasAccess requiredPermission="view_users"> */}
        <ListUsers />
      {/* </HasAccess> */}
    </div>
  );
};

export default ListUser;
