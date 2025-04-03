"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { getProducts, deleteProduct } from "@/lib/api"
import { toast } from "sonner"
import type { Product } from "@/lib/types"

type ProductContextType = {
  products: Product[]
  isLoading: boolean
  fetchProducts: () => Promise<void>
  handleDelete: (id: number) => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error(error)
      toast("Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteProduct({ id })
      toast.success("Product deleted successfully")
      await fetchProducts()
    } catch (error) {
      console.error(error)
      toast.error("Failed to delete product")
    }
  }, [fetchProducts])

  return (
    <ProductContext.Provider value={{ products, isLoading, fetchProducts, handleDelete }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}