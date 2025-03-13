import { RouteObject } from "react-router-dom";
import CreateUserPage from "../pages/createUser";
import ListUser from "../pages/listUser";
// import UpdateUser from "../pages/UpdateUserPage";

export const userRoutes : RouteObject[] = [
    {
        path : '/create-user' ,
        element : <CreateUserPage/>
    },
    {
        path : '/list-users' , 
        element : <ListUser/>
    },

    // {
    //     path : '/update-user/:id' , 
    //     element : <UpdateUser/>
    // },
]