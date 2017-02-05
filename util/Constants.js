import {
  Platform,
} from 'react-native';

export default Constants = {
  GraphQLUri: (Platform.OS === "ios") ?
    "http://localhost:5000/graphql" : "http://10.0.3.2:5000/graphql",
  FbAppId: "1387424857934791",
  FbPermissions: ["public_profile", "user_friends"],
  FbUserFields: "name,first_name,last_name",
  FbUserIdPrefix: "fb"
};
