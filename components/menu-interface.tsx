"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, ShoppingCart, Search, X, Tag } from "lucide-react"
import CheckoutPage from "./checkout-page"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  sizes?: { name: string; price: number }[]
  toppings?: { name: string; price: number }[]
}

interface CartItem extends MenuItem {
  quantity: number
  selectedSize?: string
  selectedToppings?: string[]
  notes?: string
  finalPrice: number
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Bạc Xỉu",
    description:
      "Theo chân những người gốc Hoa đến định cư tại Sài Gòn, Bạc sỉu là cách gọi tắt của 'Bạc tẩy sỉu phé' trong tiếng Quảng Đông, chính là ly cà phê trắng sữa chút đỉnh.",
    price: 29000,
    category: "CƠM",
    image: "/vietnamese-white-coffee-bac-xiu.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
    toppings: [
      { name: "Extra foam", price: 10000 },
      { name: "Trân châu trắng", price: 10000 },
    ],
  },
  {
    id: 2,
    name: "Cold Brew Cam Sả",
    description:
      "Tươi mát – Mượt mà, là sự kết hợp đầy mới mẻ khi hương vị của cam và sả được cân bằng trên nền của những nốt hương cà phê pha lạnh.",
    price: 50000,
    category: "CƠM",
    image: "/cold-brew-coffee-with-orange-and-lemongrass.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
    toppings: [
      { name: "Extra foam", price: 10000 },
      { name: "Trân châu trắng", price: 10000 },
    ],
  },
  {
    id: 3,
    name: "Cà Phê Sữa Đá",
    description:
      "Cà phê sữa đá là thức uống truyền thống của Việt Nam, kết hợp vị đắng của cà phê và vị ngọt của sữa đặc.",
    price: 18000,
    category: "CƠM",
    image: "/vietnamese-iced-coffee-with-condensed-milk.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
  },
  {
    id: 4,
    name: "Caramel Macchiato Đá",
    description: "Caramel Macchiato đá là một loại cà phê đặc biệt với lớp caramel ngọt ngào và espresso đậm đà.",
    price: 35000,
    category: "CƠM",
    image: "/iced-caramel-macchiato-coffee.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
  },
  {
    id: 5,
    name: "Trà Sen Macchiato",
    description: "Trà sen macchiato là thức uống độc đáo kết hợp hương sen thanh mát với lớp macchiato béo ngậy.",
    price: 42000,
    category: "MACCHIATO",
    image: "/lotus-tea-macchiato-vietnamese-drink.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
  },
  {
    id: 6,
    name: "Bánh Mì Dưa",
    description: "Bánh mì dưa chua giòn tan, thơm ngon với nhân dưa chua truyền thống.",
    price: 15000,
    category: "BÁNH MÌ DƯA",
    image: "/vietnamese-pickled-vegetable-sandwich-banh-mi.png",
  },
  {
    id: 7,
    name: "Chè Cung Đình Huế",
    description: "Chè cung đình Huế là món tráng miệng truyền thống với nhiều lớp nguyên liệu phong phú.",
    price: 35000,
    category: "CHÈ CUNG ĐÌNH HUẾ",
    image: "/hue-royal-sweet-soup-che-dessert.png",
  },
  {
    id: 8,
    name: "Trà Chanh Dây Hạt É",
    description: "Trà chanh dây hạt é với vị chua ngọt tự nhiên, giải khát tuyệt vời.",
    price: 42000,
    category: "TRÀ THÁI LAN",
    image: "/passion-fruit-tea-with-basil-seeds.png",
    sizes: [
      { name: "Nhỏ", price: 0 },
      { name: "Vừa", price: 6000 },
      { name: "Lớn", price: 13000 },
    ],
  },
]

const categories = ["CƠM", "MACCHIATO", "BÁNH MÌ DƯA", "CHÈ CUNG ĐÌNH HUẾ", "TRÀ THÁI LAN"]

export default function MenuInterface() {
  const [selectedCategory, setSelectedCategory] = useState("CƠM")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)

  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [itemNotes, setItemNotes] = useState("")
  const [dialogQuantity, setDialogQuantity] = useState(1)

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item)
    setSelectedSize(item.sizes?.[0]?.name || "")
    setSelectedToppings([])
    setItemNotes("")
    setDialogQuantity(1)
    setDialogOpen(true)
  }

  const addToCartFromDialog = () => {
    if (!selectedItem) return

    const sizePrice = selectedItem.sizes?.find((s) => s.name === selectedSize)?.price || 0
    const toppingsPrice = selectedToppings.reduce((total, topping) => {
      const toppingPrice = selectedItem.toppings?.find((t) => t.name === topping)?.price || 0
      return total + toppingPrice
    }, 0)

    const finalPrice = selectedItem.price + sizePrice + toppingsPrice

    const cartItem: CartItem = {
      ...selectedItem,
      quantity: dialogQuantity,
      selectedSize,
      selectedToppings: [...selectedToppings],
      notes: itemNotes,
      finalPrice,
    }

    setCart([...cart, cartItem])
    setCartTotal(cartTotal + finalPrice * dialogQuantity)
    setDialogOpen(false)
  }

  const calculateDialogTotal = () => {
    if (!selectedItem) return 0
    const sizePrice = selectedItem.sizes?.find((s) => s.name === selectedSize)?.price || 0
    const toppingsPrice = selectedToppings.reduce((total, topping) => {
      const toppingPrice = selectedItem.toppings?.find((t) => t.name === topping)?.price || 0
      return total + toppingPrice
    }, 0)
    return (selectedItem.price + sizePrice + toppingsPrice) * dialogQuantity
  }

  const removeFromCart = (itemId: number, itemIndex: number) => {
    const item = cart[itemIndex]
    if (item) {
      if (item.quantity > 1) {
        const updatedCart = cart.map((cartItem, index) =>
          index === itemIndex ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
        setCart(updatedCart)
      } else {
        setCart(cart.filter((_, index) => index !== itemIndex))
      }
      setCartTotal(cartTotal - item.finalPrice)
    }
  }

  const removeItemFromCart = (itemIndex: number) => {
    const item = cart[itemIndex]
    if (item) {
      setCart(cart.filter((_, index) => index !== itemIndex))
      setCartTotal(cartTotal - item.finalPrice * item.quantity)
    }
  }

  const addToCart = (itemIndex: number) => {
    const item = cart[itemIndex]
    const updatedCart = cart.map((cartItem, index) =>
      index === itemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
    )
    setCart(updatedCart)
    setCartTotal(cartTotal + item.finalPrice)
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const finalTotal = cartTotal - (cartTotal * appliedDiscount) / 100

  const applyDiscountCode = () => {
    const discountCodes: { [key: string]: number } = {
      GIAM10: 10,
      GIAM20: 20,
      NEWUSER: 15,
      SALE50: 50,
    }

    const discount = discountCodes[discountCode.toUpperCase()]
    if (discount) {
      setAppliedDiscount(discount)
      alert(`Áp dụng mã giảm giá thành công! Giảm ${discount}%`)
    } else {
      alert("Mã giảm giá không hợp lệ!")
    }
  }

  const handleShowCheckout = () => {
    setShowCheckout(true)
  }

  const handleBackToMenu = () => {
    setShowCheckout(false)
  }

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart)
  }

  const handleUpdateTotal = (newTotal: number) => {
    setCartTotal(newTotal)
  }

  if (showCheckout) {
    return (
      <CheckoutPage
        cart={cart}
        cartTotal={cartTotal}
        onBack={handleBackToMenu}
        onUpdateCart={handleUpdateCart}
        onUpdateTotal={handleUpdateTotal}
      />
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar - Categories */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedCategory === category ? "bg-red-500 text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Menu Items */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full max-w-md"
              />
            </div>
            <Badge variant="destructive" className="mb-2">
              {selectedCategory}
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy món ăn nào</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-red-500">{item.price.toLocaleString("vi-VN")}đ</span>
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleItemClick(item)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Thêm
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Cart */}
      <div className="w-80 bg-white shadow-sm border-l">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-800">Giỏ hàng của bạn</h2>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Giỏ hàng trống</p>
          ) : (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <h4 className="font-medium text-sm text-gray-800">{item.name}</h4>
                      <span className="text-sm font-bold text-gray-800">
                        {item.finalPrice.toLocaleString("vi-VN")}đ x {item.quantity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600 ml-8">
                      {item.selectedSize && <div>{item.selectedSize}</div>}
                      {item.selectedToppings && item.selectedToppings.length > 0 && (
                        <div>+ {item.selectedToppings.join(", ")}</div>
                      )}
                      {item.notes && <div className="italic">{item.notes}</div>}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItemFromCart(index)}
                    className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromCart(item.id, index)}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button size="sm" variant="outline" onClick={() => addToCart(index)} className="w-8 h-8 p-0">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Mã ưu đãi</span>
              </div>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Mã ưu đãi"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applyDiscountCode}
                  className="px-3 bg-orange-500 text-white hover:bg-orange-600"
                >
                  Áp dụng
                </Button>
              </div>
              {appliedDiscount > 0 && (
                <div className="text-sm text-green-600 font-medium">Giảm giá: -{appliedDiscount}%</div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-gray-800">
                  Tổng ({cart.reduce((sum, item) => sum + item.quantity, 0)} món)
                </span>
                <span className="text-xl font-bold text-red-500">{finalTotal.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
            <Button onClick={handleShowCheckout} className="w-full bg-red-500 hover:bg-red-600">
              XEM GIỎ HÀNG
            </Button>
          </div>
        )}
      </div>

      {/* Customization Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <img
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-500 mb-1">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-600">{selectedItem.category}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>
                </div>
              </div>

              {selectedItem.sizes && selectedItem.sizes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Size</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedItem.sizes.map((size) => (
                      <label key={size.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="size"
                          value={size.name}
                          checked={selectedSize === size.name}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="text-red-500"
                        />
                        <span className="text-sm">
                          {size.name} {size.price > 0 && `(+${size.price.toLocaleString("vi-VN")}đ)`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.toppings && selectedItem.toppings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Topping</h4>
                  <div className="space-y-2">
                    {selectedItem.toppings.map((topping) => (
                      <label key={topping.name} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={topping.name}
                          checked={selectedToppings.includes(topping.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedToppings([...selectedToppings, topping.name])
                            } else {
                              setSelectedToppings(selectedToppings.filter((t) => t !== topping.name))
                            }
                          }}
                          className="text-red-500"
                        />
                        <span className="text-sm">
                          {topping.name} (+{topping.price.toLocaleString("vi-VN")}đ)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Textarea
                  placeholder="Thêm ghi chú món này"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  className="text-sm min-h-[60px]"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogQuantity(Math.max(1, dialogQuantity - 1))}
                    className="w-10 h-10 p-0 rounded-full border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-lg min-w-[30px] text-center">{dialogQuantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogQuantity(dialogQuantity + 1)}
                    className="w-10 h-10 p-0 rounded-full border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={addToCartFromDialog} className="bg-red-500 hover:bg-red-600 px-6">
                  THÊM VÀO GIỎ {calculateDialogTotal().toLocaleString("vi-VN")}đ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
