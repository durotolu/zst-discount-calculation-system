"use client"

import { useState, useEffect } from "react"
import { getProducts, applyDiscount } from "@/lib/api"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Product } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

export function DiscountCalculator() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<string>("1")
  const [discountType, setDiscountType] = useState<string>("percentage")
  const [discountValue, setDiscountValue] = useState<string>("")
  const [finalPrice, setFinalPrice] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error(error)
        toast("Failed to fetch products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleCalculate = async () => {
    if (!selectedProductId || !quantity) {
      toast("Please select a product and enter quantity")
      return
    }

    if (discountType !== "bogo" && !discountValue) {
      toast("Please enter a discount value")
      return
    }

    setIsCalculating(true)
    setFinalPrice(null)

    try {
      const result = await applyDiscount({
        productId: Number.parseInt(selectedProductId),
        quantity: Number.parseInt(quantity),
        discountType,
        discountValue: discountType === "bogo" ? "0" : discountValue,
      })

      setFinalPrice(result.finalPrice)
    } catch (error) {
      console.error(error)
      toast("Failed to calculate discount")
    } finally {
      setIsCalculating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="product">Select Product</Label>
        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
          <SelectTrigger id="product">
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                {product.name} - ${product.price.toFixed(2)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Discount Type</Label>
        <RadioGroup value={discountType} onValueChange={setDiscountType} className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="percentage" id="percentage" />
            <Label htmlFor="percentage" className="cursor-pointer">
              Percentage Discount (%)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flat" id="flat" />
            <Label htmlFor="flat" className="cursor-pointer">
              Flat Discount ($)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bogo" id="bogo" />
            <Label htmlFor="bogo" className="cursor-pointer">
              Buy One Get One Free (BOGO)
            </Label>
          </div>
        </RadioGroup>
      </div>

      {discountType !== "bogo" && (
        <div className="space-y-2">
          <Label htmlFor="discountValue">
            {discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount ($)"}
          </Label>
          <Input
            id="discountValue"
            type="number"
            min="0"
            step={discountType === "percentage" ? "1" : "0.01"}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
          />
        </div>
      )}

      <Button onClick={handleCalculate} className="w-full" disabled={isCalculating}>
        {isCalculating ? "Calculating..." : "Calculate Final Price"}
      </Button>

      {finalPrice !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-center font-medium">
            Final Price: <span className="text-xl font-bold">${finalPrice.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  )
}

