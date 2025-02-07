import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import sanityClient from "@sanity/client";

const sanity = sanityClient({
  projectId: "27hpiqt4",
  dataset: "production",
  apiVersion: "2025-01-13",
  useCdn: true,
});

const ProductDetails = () => {
  const router = useRouter();
  const { id } = router.query; // This extracts the dynamic ID
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const query = `*[_type == "product" && _id == "${id}"][0] {
          _id,
          title,
          description,
          price,
          discountPercentage,
          "imageUrl": productImage.asset->url,
        }`;
        const data = await sanity.fetch(query);
        setProduct(data);
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{product.title}</h1>
      <img src={product.imageUrl} alt={product.title} />
      <p>{product.description}</p>
      <p>${product.price}</p>
      {product.discountPercentage > 0 && (
        <p>Discount: {product.discountPercentage}%</p>
      )}
    </div>
  );
};

export default ProductDetails;
