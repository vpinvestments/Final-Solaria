import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/db-switch"

// PATCH /api/watchlist/[coinId] - Update watchlist item
export async function PATCH(request: NextRequest, { params }: { params: { coinId: string } }) {
  try {
    const { userId = "1", notes, isFavorite } = await request.json()
    const { coinId } = params

    // Build update query dynamically
    const updates: string[] = []
    const values: any[] = []

    if (notes !== undefined) {
      updates.push("notes = ?")
      values.push(notes)
    }

    if (isFavorite !== undefined) {
      updates.push("is_favorite = ?")
      values.push(isFavorite ? 1 : 0)
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, error: "No fields to update" }, { status: 400 })
    }

    updates.push("updated_date = NOW()")
    values.push(userId, coinId)

    const updateQuery = `
      UPDATE watchlist_items 
      SET ${updates.join(", ")} 
      WHERE user_id = ? AND coin_id = ?
    `

    const result: any = await executeQuery(updateQuery, values)

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, error: "Item not found in watchlist" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Watchlist item updated",
    })
  } catch (error) {
    console.error("[v0] Watchlist PATCH error:", error)
    return NextResponse.json({ success: false, error: "Failed to update watchlist item" }, { status: 500 })
  }
}
