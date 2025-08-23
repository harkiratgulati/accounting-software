import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { subDays } from 'date-fns';
export const runtime='nodejs';
export async function GET(){
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });
  const items = await prisma.item.findMany({ where:{ tenantId: tenant.id } });
  const costs = await prisma.itemCost.findMany({ where:{ tenantId: tenant.id }, orderBy:{ effectiveFrom:'desc' } });
  const latestCost: Record<string, number> = {};
  for(const c of costs){ if(latestCost[c.itemId] === undefined) latestCost[c.itemId] = c.unitCost; }
  const since = subDays(new Date(), 30);
  const lines = await prisma.orderLine.findMany({ where:{ tenantId: tenant.id, order:{ orderTime: { gte: since } } }, include:{ order:true } });
  const soldQty: Record<string, number> = {}; const rev: Record<string, number> = {};
  for(const l of lines){ soldQty[l.itemId]=(soldQty[l.itemId]||0)+l.qty; rev[l.itemId]=(rev[l.itemId]||0)+l.qty*l.price; }
  const rows = items.map(it=>{
    const unit_cost = latestCost[it.id] ?? 0; const price = it.price;
    const margin = price - unit_cost; const q = soldQty[it.id]||0; const r = rev[it.id]||0;
    return { item_id: it.id, name: it.name, price, unit_cost, margin, sold_qty_30d: q, revenue_30d: r, status: margin<=0?'loss': margin < price*0.2 ? 'low':'ok' };
  }).sort((a,b)=>a.margin-b.margin);
  return NextResponse.json(rows);
}
