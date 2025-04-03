"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useProducts } from "./product-context"

export function ProductList() {
  const { products, isLoading, fetchProducts } = useProducts()

  const handleFetchProducts = async () => {
    await fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  }

  if (products.length === 0) {
    return <p className="text-center text-gray-500">No products available</p>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 font-medium text-sm text-gray-500">
        <div>Name</div>
        <div>Price</div>
        <div className="text-right">ID</div>
      </div>

      <div className="space-y-2">
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-3 items-center py-2 px-3 bg-gray-50 rounded-md">
            <div className="font-medium">{product.name}</div>
            <div>${product.price.toFixed(2)}</div>
            <div className="text-right text-gray-500">{product.id}</div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full" onClick={handleFetchProducts}>
        Refresh Products
      </Button>
    </div>
  )
}

