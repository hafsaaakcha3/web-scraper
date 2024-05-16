import axios from "axios";
const randomUseragent = require("random-useragent");
var jp = require("jsonpath");

interface Product {
  link: string,
  name: string,
}

const headers = {
  Accept: "application/json",
  "User-Agent": randomUseragent.getRandom(),
};

export default async function getProducts(baseUrl: string): Promise<Product[]> {
  return await getProductPage(baseUrl, 1);
}

async function getProductPage(
  baseUrl: string,
  page: number
): Promise<Product[]> {

  let response = await axios.get(baseUrl + `?page=${page}`, { headers });

  const responseData = response.data;

  if (!responseData) return [];

  const totalPages = jp.query(responseData, "$..pagination.totalPages")[0];
  let productFromPage = jp
    .query(responseData, "$..data.tiles[*]")
    .map((elem: any) => ({ 
      link: elem.url,
      name: elem.name
    }));
  
  if (page >= totalPages) return productFromPage;

  return [...productFromPage, ...(await getProductPage(baseUrl, page + 1))];
}
