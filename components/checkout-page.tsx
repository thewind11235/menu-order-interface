"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MapPin, X, Plus, Minus } from "lucide-react"

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

interface CheckoutPageProps {
  cart: CartItem[]
  cartTotal: number
  onBack: () => void
  onUpdateCart: (cart: CartItem[]) => void
  onUpdateTotal: (total: number) => void
}

export default function CheckoutPage({ cart, cartTotal, onBack, onUpdateCart, onUpdateTotal }: CheckoutPageProps) {
  const [selectedBranch, setSelectedBranch] = useState("Cửa hàng 1 - Phố Huế, Hai Bà Trưng, Hà Nội")
  const [address, setAddress] = useState("12 Khuất Duy Tiến, Thanh Xuân Trung, Thanh Xuân, Hanoi")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [createAccount, setCreateAccount] = useState(false)
  const [orderNotes, setOrderNotes] = useState("")
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [deliveryOption, setDeliveryOption] = useState("fixed") // "fixed" or "distance"
  const [paymentMethod, setPaymentMethod] = useState("cash") // "cash" or "transfer"

  const deliveryFee = deliveryOption === "fixed" ? 20000 : 63500
  const finalTotal = cartTotal + deliveryFee - (cartTotal * appliedDiscount) / 100

  const removeFromCart = (itemIndex: number) => {
    const item = cart[itemIndex]
    if (item.quantity > 1) {
      const updatedCart = cart.map((cartItem, index) =>
        index === itemIndex ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
      )
      onUpdateCart(updatedCart)
      onUpdateTotal(cartTotal - item.finalPrice)
    } else {
      const updatedCart = cart.filter((_, index) => index !== itemIndex)
      onUpdateCart(updatedCart)
      onUpdateTotal(cartTotal - item.finalPrice)
    }
  }

  const addToCart = (itemIndex: number) => {
    const item = cart[itemIndex]
    const updatedCart = cart.map((cartItem, index) =>
      index === itemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
    )
    onUpdateCart(updatedCart)
    onUpdateTotal(cartTotal + item.finalPrice)
  }

  const removeItemFromCart = (itemIndex: number) => {
    const item = cart[itemIndex]
    const updatedCart = cart.filter((_, index) => index !== itemIndex)
    onUpdateCart(updatedCart)
    onUpdateTotal(cartTotal - item.finalPrice * item.quantity)
  }

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

  const handlePlaceOrder = () => {
    if (!fullName || !phone) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!")
      return
    }
    alert("Đặt hàng thành công! Cảm ơn bạn đã đặt hàng.")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Checkout Form */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-600">
                Bạn đã có tài khoản? <span className="text-blue-600 cursor-pointer">Ấn vào đây để đăng nhập</span>
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-red-500 mb-6">THANH TOÁN VÀ GIAO HÀNG</h2>

              {/* Branch Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn chi nhánh gần bạn</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="Cửa hàng 1 - Phố Huế, Hai Bà Trưng, Hà Nội">
                    Cửa hàng 1 - Phố Huế, Hai Bà Trưng, Hà Nội
                  </option>
                  <option value="Cửa hàng 2 - Cầu Giấy, Hà Nội">Cửa hàng 2 - Cầu Giấy, Hà Nội</option>
                </select>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ *</label>
                <div className="relative">
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pr-10"
                    placeholder="Nhập địa chỉ giao hàng"
                  />
                  <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Map placeholder */}
                <div className="mt-3 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Bản đồ hiển thị vị trí giao hàng</p>
                    <p className="text-xs mt-1">Khoảng cách: 6,7 km</p>
                    <p className="text-xs">Thời gian giao hàng: 17 phút</p>
                  </div>
                </div>
                <p className="text-xs text-orange-600 mt-2">
                  Vui lòng chọn vị trí chính xác của bạn trên bản đồ. (click hoặc di chuyển icon)
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <Input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ email (tùy chọn)</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" />
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">Tạo tài khoản mới?</span>
                </label>
              </div>

              {/* Additional Information */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-red-500 mb-4">THÔNG TIN BỔ SUNG</h3>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (tùy chọn)</label>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Order Summary */}
      <div className="w-96 bg-white shadow-sm border-l">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Giỏ hàng của bạn</h2>
        </div>

        <div className="p-4 space-y-4 max-h-64 overflow-y-auto">
          {cart.map((item, index) => (
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
                <Button size="sm" variant="outline" onClick={() => removeFromCart(index)} className="w-8 h-8 p-0">
                  <Minus className="w-3 h-3" />
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button size="sm" variant="outline" onClick={() => addToCart(index)} className="w-8 h-8 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t space-y-4">
          {/* Discount Code */}
          <div className="space-y-2">
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

          {/* Order Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Tổng ({cart.reduce((sum, item) => sum + item.quantity, 0)} món)</span>
              <span>{cartTotal.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Giao hàng</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="fixed"
                  checked={deliveryOption === "fixed"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="text-red-500"
                />
                <span className="text-sm">Đồng giá: {(20000).toLocaleString("vi-VN")}đ</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="distance"
                  checked={deliveryOption === "distance"}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                  className="text-red-500"
                />
                <span className="text-sm">Giao hàng theo km(6,7 km): {(63500).toLocaleString("vi-VN")}đ</span>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pt-2 border-t font-bold">
            <span>Tổng cộng</span>
            <span className="text-xl text-red-500">{finalTotal.toLocaleString("vi-VN")}đ</span>
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-500"
                />
                <span className="text-sm">Trả tiền mặt khi nhận hàng</span>
              </label>
              <div className="text-xs text-gray-500 ml-6">Trả tiền mặt khi giao hàng</div>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === "transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-red-500"
                />
                <span className="text-sm">Chuyển khoản ngân hàng</span>
              </label>
            </div>
          </div>

          <Button onClick={handlePlaceOrder} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3">
            ĐẶT HÀNG
          </Button>
        </div>
      </div>
    </div>
  )
}
