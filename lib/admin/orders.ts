import "server-only";
import { d1All, d1Exec, d1Configured, nowMs } from "@/lib/db";
import { newId } from "@/lib/store";
import type {
  DeliveryAddress,
  DeliveryMethod,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/types/admin";

type OrderRow = {
  id: string;
  reference: string;
  status: string;
  data: string;
  created_at: number;
  updated_at: number;
};

function rowToOrder(row: OrderRow): Order {
  const parsed = JSON.parse(row.data) as Order;
  return { ...parsed, id: row.id, reference: row.reference, status: row.status as OrderStatus };
}

export async function listOrders(): Promise<Order[]> {
  if (!d1Configured) return [];
  try {
    const rows = await d1All<OrderRow>(
      "SELECT id, reference, status, data, created_at, updated_at FROM orders ORDER BY created_at DESC",
    );
    return rows.map(rowToOrder);
  } catch (err) {
    console.warn("[orders] list failed:", err);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!d1Configured) return null;
  const rows = await d1All<OrderRow>(
    "SELECT id, reference, status, data, created_at, updated_at FROM orders WHERE id = ?",
    [id],
  );
  return rows[0] ? rowToOrder(rows[0]) : null;
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  if (!d1Configured) return null;
  const rows = await d1All<OrderRow>(
    "SELECT id, reference, status, data, created_at, updated_at FROM orders WHERE reference = ?",
    [reference],
  );
  return rows[0] ? rowToOrder(rows[0]) : null;
}

type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerBusiness?: string;
  notes?: string;
  items: OrderItem[];
  deliveryMethod?: DeliveryMethod;
  deliveryAddress?: DeliveryAddress;
  deliveryFee?: number;
  paymentMethod?: PaymentMethod;
  source?: string;
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const nowIso = new Date().toISOString();
  const subtotal = input.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
  const deliveryFee = input.deliveryFee ?? 0;
  const total = subtotal + deliveryFee;
  const currency = input.items[0]?.currency ?? "PKR";
  const id = newId("ord");
  const reference = `DH-${Date.now().toString().slice(-7)}`;
  const order: Order = {
    id,
    reference,
    status: "new",
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    customerBusiness: input.customerBusiness,
    notes: input.notes,
    items: input.items,
    subtotal,
    deliveryFee,
    totalAmount: total,
    currency,
    deliveryMethod: input.deliveryMethod ?? "pickup",
    deliveryAddress: input.deliveryAddress,
    paymentMethod: input.paymentMethod ?? "cod",
    createdAt: nowIso,
    updatedAt: nowIso,
    source: input.source ?? "designhub.com.pk",
  };
  const now = nowMs();
  await d1Exec(
    `INSERT INTO orders (id, reference, status, data, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, reference, order.status, JSON.stringify(order), now, now],
  );
  return order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  notes?: string,
): Promise<Order | null> {
  const current = await getOrderById(id);
  if (!current) return null;
  const next: Order = { ...current, status, updatedAt: new Date().toISOString() };
  if (notes !== undefined) next.notes = notes;
  await d1Exec(
    `UPDATE orders SET status = ?, data = ?, updated_at = ? WHERE id = ?`,
    [status, JSON.stringify(next), nowMs(), id],
  );
  return next;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const current = await getOrderById(id);
  if (!current) return false;
  await d1Exec("DELETE FROM orders WHERE id = ?", [id]);
  return true;
}
