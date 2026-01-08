"use client";

const ProductsDetails = () => {
  return (
    <div className="w-full space-y-8 mb-10">
      {/* Description Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-shop_orange rounded-full"></span>
          Description
        </h2>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p className="mb-4">
            Experience premium quality with this exceptional product designed for modern lifestyles.
            Built with durable materials and precision engineering, it delivers reliable performance
            for everyday use.
          </p>
          <p className="mb-4">
            Key features include advanced technology integration, ergonomic design, and energy-efficient
            operation. Whether for work or leisure, this product adapts seamlessly to your needs.
          </p>
          <p>
            Backed by our comprehensive warranty and dedicated customer support, you can purchase with
            confidence. Join thousands of satisfied customers who have made this their product of choice.
          </p>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-shop_dark_green mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-shop_orange rounded-full"></span>
          Additional Information
        </h2>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 w-1/3">
                  Weight
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  190 kg
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 w-1/3">
                  Dimensions
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  3 × 72 × 109 cm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;
