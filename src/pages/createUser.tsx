import HasAccess from "../context/HasAccess";
import CreateUser from "../features/user/user-component/create-user/createUser";

const CreateUserPage = () => {
  return (
    <div>
      <HasAccess requiredPermission="create_users">
        <CreateUser />
      </HasAccess>
    </div>
  );
};

export default CreateUserPage;
