import config from '../config.json';

export default Constants = {
  GraphQLUri: config.prod ? "https://jeev-wavelength.herokuapp.com/graphql" :
    "http://localhost:5000/graphql", // 10.0.3.2 for genymotion
  FbAppId: "1387424857934791",
  FbPermissions: ["public_profile", "user_friends"],
  FbUserFields: "name,first_name,last_name",
  FbUserIdPrefix: "fb"
};
