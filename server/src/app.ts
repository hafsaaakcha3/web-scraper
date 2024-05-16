import express, { Request, Response } from "express";
const cors = require('cors')

import getCategories from "./get-categories";
import getProducts from "./get-products";
import getProduct from "./get-product";

const app = express();

app.use(cors())
app.options('*', cors());

const baseUrl: string = "https://www.hollandandbarrett.com";

app.get("/categories", async (req: Request, res: Response) => {
  try {
    const usecashe: any = req.query.usecache
    const categories = await getCategories(baseUrl,usecashe);
    res.json(categories);
  } catch (err: any) {
    console.log("err");
    res.status(500).json({ error: err?.message });
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    
    const categoryUrl: string =baseUrl + req.query.url;
    console.log(categoryUrl)
    const productLinks = await getProducts(categoryUrl);
    console.log(productLinks.length)
    res.json(productLinks);
  } catch (err: any) {
    console.error("err");
    res.status(500).json({ error: err?.message });
  }
});

app.get("/product",async (req: Request,res: Response)=>{
  try {
    const categoryUrl: string = baseUrl + req.query.url;
    const productLinks = await getProduct(categoryUrl);
    res.json(productLinks);
  } catch (err: any) {
    console.error("err");
    res.status(500).json({ error: err?.message });
  }
})

app.listen(4000,'0.0.0.0', () => {
  console.log(`Server is running `);
});
