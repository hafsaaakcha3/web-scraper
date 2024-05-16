import axios, { AxiosResponse } from "axios";
const randomUseragent = require("random-useragent");

interface Category {
  link: string;
  name: string;
}

let categories: Category[] = [];

export default async function getCategories(baseUrl: string, useCache: boolean): Promise<Category[]> {
  // if not refresh then returned the previously cached categories
  if (useCache && categories.length) {
    console.log("returning cached categories");
    return categories;
  }

  const regex = /\{(?:\s*"id"\s*:\s*"[^"]+",\s*"link"\s*:\s*"[^"]+",\s*"name"\s*:\s*"[^"]+"\s*)\}/g;
  const response: AxiosResponse = await axios.get(baseUrl, {
    headers: {
      Accept: "application/json",
      "User-Agent": randomUseragent.getRandom(),
    },
  });

  const catRes = await response.data;
  let scrappedCategories: Category[] = [];
  if (catRes) {
    const elements: string = JSON.stringify(catRes);
    const matches = elements.match(regex);
    if (matches) {
      scrappedCategories = matches
        .map((match) => JSON.parse(match))
        .filter((obj) => typeof obj === "object" && obj.link && !obj.link.includes("offers"))
        .map((obj) => ({
          link: baseUrl + obj.link,
          name: obj.name,
        }));
    }
  }
  categories = scrappedCategories;
  return categories;
}
