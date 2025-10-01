import { NextResponse } from "next/server"
import { tradingAPI, type OrderRequest } from "@/lib/trading-api"

async function postHandler(request: Request) {
  try {
    const body = await request.json()
    const { order, exchangeId }: { order: OrderRequest; exchangeId?: string } = body

    // Validate order data
    if (!order.symbol || !order.side || !order.type || !order.quantity) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 })
    }

    if (order.quantity <= 0) {
      return NextResponse.json({ error: "Order quantity must be greater than 0" }, { status: 400 })
    }

    if (order.type === "limit" && !order.price) {
      return NextResponse.json({ error: "Limit orders require a price" }, { status: 400 })
    }

    // Place order through trading API
    const result = await tradingAPI.placeOrder(order, exchangeId)

    return NextResponse.json({ success: true, order: result })
  } catch (error) {
    console.error("Order placement error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to place order" },
      { status: 500 },
    )
  }
}

async function getHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const exchangeId = searchParams.get("exchange")
    const symbol = searchParams.get("symbol")
    const type = searchParams.get("type") // 'open' or 'history'

    if (!exchangeId) {
      return NextResponse.json({ error: "Exchange ID is required" }, { status: 400 })
    }

    const exchange = tradingAPI.getExchange(exchangeId)
    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found or not connected" }, { status: 404 })
    }

    let orders
    if (type === "history") {
      orders = await exchange.getOrderHistory(symbol || undefined)
    } else {
      orders = await exchange.getOpenOrders(symbol || undefined)
    }

    return NextResponse.json({ success: true, orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get orders" },
      { status: 500 },
    )
  }
}

async function deleteHandler(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const symbol = searchParams.get("symbol")
    const exchangeId = searchParams.get("exchange")

    if (!orderId || !symbol || !exchangeId) {
      return NextResponse.json({ error: "Order ID, symbol, and exchange ID are required" }, { status: 400 })
    }

    const exchange = tradingAPI.getExchange(exchangeId)
    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found or not connected" }, { status: 404 })
    }

    const success = await exchange.cancelOrder(orderId, symbol)

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Cancel order error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to cancel order" },
      { status: 500 },
    )
  }
}

export const POST = postHandler
export const GET = getHandler
export const DELETE = deleteHandler
