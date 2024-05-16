import axios from "axios";
const randomUseragent = require("random-useragent");
var jp = require("jsonpath");

const headers = {
  Accept: "application/json",
  "User-Agent": randomUseragent.getRandom(),
};
const removeHtmlTags = (s: string) => (s || "").replace(/(<([^>]+)>)/gi, "");

function niceJson(element: any[]){
  if (!element || element.length === 0 ) return []
  let resut: any={}
  element.forEach(elem => {
    let r:any={}
    elem.fact.keys.forEach((e:any)=>{r[e.key]=e.value})
    resut[elem.heading]=r
  });
  return resut
}

export default async function getProduct(url: string): Promise<object> {
  let response = await axios.get(url, { headers });

  const responseData = response.data;
  if (!responseData) return [];
  const Nut=jp.query(responseData,'$..nutritionals[0].value[0].sections')[0]

  return {
      category: jp.value(responseData, "$..primaryCategory.path").split('/').pop(),
      Manufacturer:jp.query(responseData,"$..product.brand.name")[0],
      name:jp.query(responseData,"$..skus[0].name")[0],
      images:jp.query(responseData,"$..variant.images[0]")[0][2]['url'].replace('//','www.'),
      price:jp.query(responseData,"$..actualPrice")[0],
      description: removeHtmlTags(jp.value(responseData, "$..variant.description")),
      ingredients: removeHtmlTags(jp.value(responseData, "$..otherIngredients.text")),
      Nutritional: niceJson(Nut)
    }
}
