import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { parse } from 'csv-parse/sync';
export const runtime='nodejs';
export async function POST(req: NextRequest){
  const data = await req.formData();
  const file = data.get('file') as File | null;
  if(!file) return NextResponse.json({error:'file required'},{status:400});
  const buf = Buffer.from(await file.arrayBuffer());
  const rows:any[] = parse(buf, { columns:true, trim:true, skip_empty_lines:true });
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });
  let created = 0;
  for(const r of rows){
    const item = await prisma.item.upsert({
      where: { sku_tenantId: { sku: String(r.item_sku), tenantId: tenant.id } },
      update: { name: r.item_name ?? r.item_sku, price: Number(r.item_price||0) },
      create: { tenantId: tenant.id, name: r.item_name ?? r.item_sku, sku: String(r.item_sku), price: Number(r.item_price||0) }
    });
    await prisma.order.create({
      data: {
        tenantId: tenant.id,
        orderTime: new Date(r.order_time),
        channel: String(r.channel || 'pos'),
        subtotal: Number(r.subtotal||0), tax: Number(r.tax||0), fees: Number(r.fees||0), discount: Number(r.discount||0),
        lines: { create: [{ tenantId: tenant.id, itemId: item.id, qty: Number(r.qty||0), price: Number(r.item_price||0) }] }
      }
    });
    created++;
  }
  return NextResponse.json({ ok:true, orders: created });
}
