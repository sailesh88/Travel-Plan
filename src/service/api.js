import axios from "axios";
import { link } from "./link";

const baseURL = link.base_url;

export default axios.create({
  baseURL,
});
