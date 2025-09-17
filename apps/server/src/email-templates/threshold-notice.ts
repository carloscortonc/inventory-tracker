import { Product } from "@/entities/product";
import Mailgen from "mailgen";

const thresholdNotice = (params: { products: Product[] }) =>
  ({
    subject: "Treshold notice",
    body: {
      intro: [
        "An inventory update has triggered this notice, due to some product quantity being below its configured threshold.",
        "Below is a list of such products:",
      ],
      table: {
        data: params.products.map((p) => ({ "Product name": p.name, quantity: p.quantity, threshold: p.threshold })),
      },
      signature: false,
      greeting: false,
    },
  } as Mailgen.Content & { subject: string });

export default thresholdNotice;
