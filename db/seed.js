import db from "#db/client";

import { createProduct } from "#db/queries/products";
import { createUser } from "#db/queries/users";
import { createOrder } from "#db/queries/orders";
import { createOrderProduct } from "#db/queries/orders_products";
import { addItemToCart, createCart } from "#db/queries/cart";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create a test user
  const user = await createUser("parker", "parker@test.com", "password");
  console.log("Created user:", user.name);

  // Create at least 15 products
  const specificProducts = [
    {
      title: "Tissot PRX Chameleon",
      description: "40mm diameter with a Powermatic80 movement and stainless steel case",
      image: "https://watchshopbd.com/uploads/product/Tissot%20Mens%20Watch%20T137.407.11.351.01%20(1).webp",
      price: 775
    },
    {
      title: "Tudor Black Bay 54 Lagoon Blue",
      description: "37mm diameter with a MT5400 movement and a steel case",
      image: "https://media.tudorwatch.com/image/upload/q_auto/f_auto/t_tdr-grid/c_limit,w_3840/v1/catalogue/2025/upright-cb-with-drop-shadow/tudor-m79000-0001",
      price: 4350 
    },
    {
      title: "Grand Seiko White Birch",
      description: "40mm diameter with a Caliber 9S mechanical movement and a stainless steel case",
      image: "https://www.grand-seiko.com/us-en/-/media/Images/Product--Image/All/GrandSeiko/2022/02/19/23/13/SLGA009G/SLGA009G.png",
      price: 9800
    },
    {
      title: "Elsa Peretti",
      description: "Sterling silver with round brilliant diamonds",
      image: "https://media.tiffany.com/is/image/tco/60020136_ER_MAIN1X1?hei=628&wid=628",
      price: 1900
    },
    {
      title: "Tiffany Victoria",
      description: "Mixed-cut diamonds and platinum create a striking display of light to these vine drop earrings",
      price: 53000
    },
    {
      title: "Round white gold earrings",
      description: "These 1.00ctw, VS2 clarity paired with white gold offer a simple yet dazzling appearence",
      imgae: "https://bfasset.costco-static.com/U447IH35/as/cv48vczv4c738bhn3shp6q/1804624-847__1?auto=webp&amp;format=jpg&width=600&height=600&fit=bounds&canvas=600,600",
      price: 2000
    },
    {
      title: "Tennis Necklace",
      description: "This is a 4 prong set 8.75ctw, VS clarity necklace paired with white gold",
      image: "https://image.icebox.com/unsafe/600x0/icebox-jewelry.s3.amazonaws.com/products/67a5e5469e6d8fc8e13c450a758ffb18.jpg",
      price: 13300
    },
    {
      title: "Miami Cuban Chain",
      description: "This is a 3.5mm miami cuban link chain in 14k solid gold",
      image: "https://image.icebox.com/unsafe/600x0/icebox-jewelry.s3.amazonaws.com/products/c60bc9473eed729c238b34e68e610a29.jpg",
      price: 5165
    },
    {
      title: "Diamond Heart Pendant",
      description: "18k rose gold with round diamonds on a 16in chain",
      image: "https://media.tiffany.com/is/image/tco/60007674_PDT_MAIN1X1?hei=628&wid=628",
      price: 3400 
    },
    {
      title: "Cuban Diamond Ring",
      description: "14k solid gold with 0.55ctw handset VS diamonds",
      image: "https://image.icebox.com/unsafe/600x0/icebox-jewelry.s3.amazonaws.com/products/94969d6340ecff991c8792935b08f05f.jpg",
      price: 1940
    },
    {
      title: "Paloma Picasso",
      description: "Olive leaf bypass ring in 18k yellow gold",
      image: "https://media.tiffany.com/is/image/tco/67544412_RG_MAIN1X1?hei=628&wid=628",
      price: 1975
    },
    {
      title: "Tiffany T",
      description: "T1 ring in 18k white gold with diamonds",
      image: "https://media.tiffany.com/is/image/tco/67795474_RG_MAIN1X1?hei=628&wid=628",
      price: 2650
    }
  ];
  
  const products = [];
  for (let i = 0; i < specificProducts.length; i++) {
    const productData = specificProducts[i];
    const product = await createProduct(
      productData.title,
      productData.description,
      productData.image,
      productData.price
    );
    products.push(product);
    console.log(`Created product: ${product.title}`); 
  }
  // for (let i = 1; i <= 15; i++) {
  //   const product = await createProduct(
  //     `Product ${i}`,
  //     `Description for product ${i}`,
  //     Math.floor(Math.random() * 100) + 1
  //   );
  //   products.push(product);
  //   console.log(`Created product: ${product.title}`);
  // }

  // Create an order for the user
  const order = await createOrder("2024-01-15", "Test order", user.id);
  console.log("Created order:", order.id);

  // Add at least 1 distinct products to the order
  for (let i = 0; i < 1; i++) {
    await createOrderProduct(
      order.id,
      products[i].id,
      Math.floor(Math.random() * 5) + 1,
      10
    );
    console.log(`Added product ${products[i].id} to order ${order.id}`);
  }
  
  const updatedCart = await createCart(user.id);
  for (let i = 0; i< 5; i++) {
    await addItemToCart(user.id, products[i].id, Math.ceil(Math.random()*10))
  }
  console.log('cart items added here!', updatedCart);
}