"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProduct } from "@/lib/api"
import { toast } from "sonner"
import { fetchProducts } from "./product-list"

export function ProductForm() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price) {
      toast("Please fill in all fields")
      return
    }

    setIsLoading(true)

    try {
      await createProduct({ name, price: Number.parseFloat(price) })
      toast("Product created successfully")
      setName("")
      setPrice("")
    } catch (error) {
      console.error(error)
      toast("Failed to create product")
    } finally {
      setIsLoading(false)
      fetchProducts()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter product price"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Product"}
      </Button>
    </form>
  )
}

