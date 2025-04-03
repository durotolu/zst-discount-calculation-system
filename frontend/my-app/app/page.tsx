import { ProductForm } from "@/components/product-form"
import { ProductList } from "@/components/product-list"
import { DiscountCalculator } from "@/components/discount-calculator"
import { ProductProvider } from "@/components/product-context"

export default function Home() {
  return (
    <ProductProvider>
      <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Discount Calculation System</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Create Product</h2>
            <ProductForm />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Products</h2>
            <ProductList />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Calculate Discount</h2>
          <DiscountCalculator />
        </div>
      </div>
      </main>
    </ProductProvider>
  )
}

