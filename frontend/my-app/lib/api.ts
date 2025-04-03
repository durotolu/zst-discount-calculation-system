import type { Product } from "./types"

const API_BASE_URL = "http://127.0.0.1:5000/api"

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`)

  if (!response.ok) {
    throw new Error("Failed to fetch products")
  }

  return response.json()
}

export async function createProduct(data: { name: string; price: number }): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to create product")
  }

  return response.json()
}

export async function deleteProduct(data: { id: number }): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to delete product")
  }

  return response.json()
}

export async function applyDiscount(data: {
  productId: number
  quantity: number
  discountType: string
  discountValue: string
}): Promise<{ final_price: number }> {
  const response = await fetch(`${API_BASE_URL}/products/${data.productId}/apply_discount`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      quantity: data.quantity,
      discount_type: data.discountType,
      discount_value: data.discountValue === "" ? "0" : data.discountValue,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to apply discount")
  }

  return response.json()
}

