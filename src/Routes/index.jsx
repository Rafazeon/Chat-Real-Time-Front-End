import UserComponent from '../Components/User';
import ChatComponent from '../Components/Chat';

var indexRoutes = [
  { path: "/user", name: "User", component: UserComponent },
  { path: "/chat", name: "Chat", component: ChatComponent }
];

export default indexRoutes;