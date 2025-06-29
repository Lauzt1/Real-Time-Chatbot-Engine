// src/app/product/[category]/[id]/page.jsx
import CategorySidebar from "@/components/CategorySidebar";
import Polisher from "@/models/polisher";
import Pad from "@/models/pad";
import Compound from "@/models/compound";
import ProductEnquiryForm from "@/components/ProductEnquiryForm";
import ProductImageGallery from "@/components/ProductImageGallery";

async function getItem(category, id) {
  switch (category) {
    case "polisher":
      return Polisher.findById(id).lean();
    case "pad":
      return Pad.findById(id).lean();
    case "compound":
      return Compound.findById(id).lean();
    default:
      return null;
  }
}

export default async function DetailPage({ params }) {
  const { category, id } = params;
  const item = await getItem(category, id);

  if (!item) {
    return <p className="p-6">Item not found</p>;
  }

  return (
    <div className="flex">
      <CategorySidebar active={category} />
      <main className="flex-1 p-8 bg-white rounded-lg m-3">
        <h1 className="text-3xl font-bold mb-6">{item.name}</h1>

        {/* Two-column: images left, details right */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: client‐side gallery */}
          <div className="lg:w-1/2">
            <ProductImageGallery images={item.images} alt={item.name} />
          </div>

          {/* Right: details */}
          <div className="lg:w-1/2 flex flex-col justify-between">
            <dl className="space-y-4 text-gray-700">
              {category === "polisher" && (
                <>
                  <div>
                    <dt className="font-semibold inline">Backing Pad:</dt>{" "}
                    <dd className="inline">{item.backingpad}"</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Orbit:</dt>{" "}
                    <dd className="inline">{item.orbit} mm</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Power:</dt>{" "}
                    <dd className="inline">{item.power} W</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">R.P.M.:</dt>{" "}
                    <dd className="inline">{item.rpm}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Weight:</dt>{" "}
                    <dd className="inline">{item.weight} kg</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Type:</dt>{" "}
                    <dd className="inline">{item.type}</dd>
                  </div>
                </>
              )}

              {category === "pad" && (
                <>
                  <div>
                    <dt className="font-semibold inline">Code:</dt>{" "}
                    <dd className="inline">{item.code}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Size:</dt>{" "}
                    <dd className="inline">{item.size}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Properties:</dt>{" "}
                    <dd className="inline">{item.properties}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Colour:</dt>{" "}
                    <dd className="inline">{item.colour}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Type:</dt>{" "}
                    <dd className="inline">{item.type}</dd>
                  </div>
                </>
              )}

              {category === "compound" && (
                <>
                  <div>
                    <dt className="font-semibold inline">Code:</dt>{" "}
                    <dd className="inline">{item.code}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Size:</dt>{" "}
                    <dd className="inline">{item.size}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Properties:</dt>{" "}
                    <dd className="inline">{item.properties}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold inline">Type:</dt>{" "}
                    <dd className="inline">{item.type}</dd>
                  </div>
                </>
              )}

              <div>
                <dt className="font-semibold">Description:</dt>
                <dd className="mt-1 text-gray-600">{item.description}</dd>
              </div>
              <div className="text-center">
                <a
                  href="#enquiry"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition mt-2"
                >
                  Make An Enquiry
                </a>
              </div>
            </dl>
          </div>
        </div>

        {/* Enquiry Form */}
        <section
          id="enquiry"
          className="mt-12 rounded-lg shadow-lg max-w-2xl mx-auto"
        >
          <ProductEnquiryForm
            category={category}
            productId={id}
            productName={item.name}
          />
        </section>
      </main>
    </div>
  );
}
