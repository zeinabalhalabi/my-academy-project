import { Product} from "./product";

export interface IProductCard extends Product {
  description: string;
  rating: {
    rate: number;
    count: number;
  }
}
