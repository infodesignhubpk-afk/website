"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { deleteOrder, updateOrderStatus } from "@/lib/admin/orders";
import type { OrderStatus } from "@/types/admin";

export async function setOrderStatusAction(id: string, status: OrderStatus): Promise<void> {
  await requireAdmin();
  await updateOrderStatus(id, status);
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
}

export async function deleteOrderAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteOrder(id);
  revalidatePath("/admin/orders");
}
