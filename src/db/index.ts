import { Index } from "@upstash/vector";



type Product = {
  id: string
  imageId: string
  name: string
  size: "S"  | "M" | "L" 
  color:  "blue" |   "black" | "white" |  "purple" | "beige" 
}


export const db =  new Index<Product>()

