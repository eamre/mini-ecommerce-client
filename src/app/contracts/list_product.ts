import { ListProductImage } from "./list_product_image";

export class ListProduct{
  id:string;
  name:string;
  stock: number;
  price: number;
  createdDate:Date;
  updatedDate:Date;
  productImages?:ListProductImage[];
  imagePath?:string
}
