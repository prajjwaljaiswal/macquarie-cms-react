import wretch, { ConfiguredMiddleware } from "wretch";
import { history } from "../modules/app/App";

const config: ConfiguredMiddleware = (next) => (url, opts) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    opts.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return next(url, opts);
};

export const baseService = wretch()
  .catcher(401, (err) => {
    sessionStorage.clear();
    history.push("/sg_cms");
  })
  .catcher(501, (err) => {
    sessionStorage.clear();
    location.href = "https://www.warrants.com.sg/";
  })
  .middlewares([config]);
