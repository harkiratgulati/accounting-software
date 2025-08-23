import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { startOfDay, addDays } from 'date-fns';
export const runtime='nodejs';
export async function GET(){
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });
  const day = startOfDay(new Date()); const next = addDays(day,1);
  const sales = await prisma.order.findMany({ where:{ tenantId: tenant.id, orderTime: { gte: day, lt: next } } });
  const revenue = sales.reduce((s,o)=>s+o.subtotal,0); const orders = sales.length;
  const lines = await prisma.orderLine.findMany({ where:{ tenantId: tenant.id, order: { orderTime: { gte: day, lt: next } } }, include:{ item:true } });
  const topMap: Record<string, {name:string, qty:number, revenue:number}> = {};
  for(const l of lines){ const k=l.itemId; if(!topMap[k]) topMap[k]={name:l.item.name, qty:0, revenue:0}; topMap[k].qty+=l.qty; topMap[k].revenue+=l.qty*l.price; }
  const top = Object.entries(topMap).map(([k,v])=>({ item_id:k, name:v.name, qty:v.qty, revenue:v.revenue })).sort((a,b)=>b.qty-a.qty).slice(0,5);
  const content = { date: day, revenue_today: revenue, orders_today: orders, top_items: top };
  await prisma.digest.upsert({ where:{ tenantId_date: { tenantId: tenant.id, date: day } }, update:{ content: JSON.stringify(content) }, create:{ tenantId: tenant.id, date: day, content: JSON.stringify(content) } });
  return NextResponse.json(content);
}
