import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
export const runtime='nodejs';
export async function GET(req: NextRequest){
  const dateStr = new URL(req.url).searchParams.get('date');
  const when = dateStr ? new Date(dateStr) : new Date();
  const tenant = await prisma.tenant.upsert({ where:{ slug:'demo' }, update:{}, create:{ slug:'demo', name:'Demo' } });
  const f = await prisma.forecast.findMany({ where:{ tenantId: tenant.id, date: when } });
  const vendors = await prisma.vendor.findMany({ where:{ tenantId: tenant.id } });
  const vendorBySku: Record<string, {name:string, moq:number}> = {}; // extend mapping as needed
  const rows = f.map(x=>{ const v = vendorBySku[x.sku]; let needed_qty = x.qty; const moq = v?.moq || 1; if(needed_qty<moq) needed_qty=moq; return { sku: x.sku, needed_qty, vendor: v?.name || 'default', moq }; });
  return NextResponse.json(rows);
}
