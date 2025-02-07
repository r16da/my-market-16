import React from "react";
import { useRouter } from "next/router";
import sanityClient from "@sanity/client";
import Image from "next/image";

const sanity = sanityClient({
  projectId: "27hpiqt4",
  dataset: "production",
  apiVersion: "2025-01-13",
  useCdn: true,
});

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const query = `
          *[_type == "product" && _id == $id][0] {
            title,
            price,
            description,
            discountPercentage,
            "imageUrl": productImage.asset->url,
            tags
          }
        `;
        const data = await sanity.fetch(query, { id });
        setProduct(data);
      };

      fetchProduct();
    }
  }, [id]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <Image
        src={product.imageUrl}
        alt={product.title}
        width={600}
        height={600}
        className="rounded-md my-4"
      />
      <p className="text-lg">{product.description}</p>
      <p className="text-xl font-semibold text-green-700">${product.price}</p>
      {product.discountPercentage > 0 && (
        <p className="text-sm text-red-600">
          {product.discountPercentage}% OFF
        </p>
      )}
      <div className="mt-4">
        {product.tags.map((tag: string, idx: number) => (
          <span
            key={idx}
            className="text-xs bg-gray-300 px-2 py-1 rounded-full mr-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;


