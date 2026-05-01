import "server-only";
import { readJson, writeJson, newId } from "@/lib/store";
import type {
  DeliveryAddress,
  DeliveryMethod,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
} from "@/types/admin";

const FILE = "orders.json";

export async function listOrders(): Promise<Order[]> {
  const all = await readJson<Order[]>(FILE, []);
  return [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const all = await listOrders();
  return all.find((o) => o.id === id) ?? null;
}

export async function getOrderByReference(reference: string): Promise<Order | null> {
  const all = await listOrders();
  return all.find((o) => o.reference === reference) ?? null;
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
  const all = await readJson<Order[]>(FILE, []);
  const now = new Date().toISOString();
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
    createdAt: now,
    updatedAt: now,
    source: input.source ?? "designhub.pk",
  };
  await writeJson(FILE, [order, ...all]);
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<Order | null> {
  const all = await listOrders();
  const i = all.findIndex((o) => o.id === id);
  if (i < 0) return null;
  const next: Order = { ...all[i], status, updatedAt: new Date().toISOString() };
  if (notes !== undefined) next.notes = notes;
  const arr = [...all];
  arr[i] = next;
  await writeJson(FILE, arr);
  return next;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const all = await listOrders();
  const next = all.filter((o) => o.id !== id);
  if (next.length === all.length) return false;
  await writeJson(FILE, next);
  return true;
}
