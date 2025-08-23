import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { startOfDay, addDays, subDays } from 'date-fns';
export const runtime='nodejs';
export async function POST(){
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });
  const today = startOfDay(new Date());
  const windowStart = subDays(today, 60);
  const lines = await prisma.orderLine.findMany({ where:{ tenantId: tenant.id, order:{ orderTime: { gte: windowStart, lt: today } } }, include:{ item:true, order:true } });
  const bySkuDow: Record<string, number[]> = {} as any;
  for(const l of lines){ const sku=l.item.sku; const dow=l.order.orderTime.getDay(); bySkuDow[sku]=bySkuDow[sku]||[0,0,0,0,0,0,0]; bySkuDow[sku][dow]+=l.qty; }
  await prisma.forecast.deleteMany({ where: { tenantId: tenant.id } });
  const data:any[]=[];
  for(let d=0; d<14; d++){ const day=addDays(today,d); const dow=day.getDay(); for(const [sku,arr] of Object.entries(bySkuDow)){ const qty=Math.max(0, Math.round((arr as number[])[dow]||0)); data.push({ tenantId: tenant.id, sku, date: day, qty }); } }
  if(data.length) await prisma.forecast.createMany({ data });
  return NextResponse.json({ ok:true, records: data.length });
}
