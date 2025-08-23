import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { subDays, startOfDay, addDays } from 'date-fns';

export const runtime = 'nodejs';

export async function GET() {
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });

  // Last 30 days sales per day
  const today = startOfDay(new Date());
  const since = subDays(today, 29);
  const orders = await prisma.order.findMany({ where: { tenantId: tenant.id, orderTime: { gte: since, lt: addDays(today,1) } } });
  const byDay = new Map<string, number>();
  for (let i=0;i<30;i++){ const d = addDays(since, i); byDay.set(d.toISOString().slice(0,10), 0); }
  for (const o of orders) {
    const key = startOfDay(o.orderTime).toISOString().slice(0,10);
    byDay.set(key, (byDay.get(key) || 0) + o.subtotal);
  }
  const salesSeries = Array.from(byDay.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Top items (last 30d)
  const lines = await prisma.orderLine.findMany({ where: { tenantId: tenant.id, order: { orderTime: { gte: since, lt: addDays(today,1) } } }, include: { item: true, order: true } });
  const topMap: Record<string, { name: string, qty: number, revenue: number }> = {};
  for (const l of lines) {
    const id = l.itemId;
    if (!topMap[id]) topMap[id] = { name: l.item.name, qty: 0, revenue: 0 };
    topMap[id].qty += l.qty;
    topMap[id].revenue += l.qty * l.price;
  }
  const topItems = Object.values(topMap).sort((a,b)=>b.revenue-a.revenue).slice(0,5);

  // Forecast next 14 days (sum qty per day)
  const f = await prisma.forecast.findMany({ where: { tenantId: tenant.id } });
  const fByDate = new Map<string, number>();
  for (const r of f) {
    const key = startOfDay(r.date).toISOString().slice(0,10);
    fByDate.set(key, (fByDate.get(key) || 0) + r.qty);
  }
  const forecastSeries = Array.from(fByDate.entries()).sort((a,b)=>a[0].localeCompare(b[0])).map(([date, qty])=>({ date, qty }));

  return NextResponse.json({ salesSeries, topItems, forecastSeries });
}
