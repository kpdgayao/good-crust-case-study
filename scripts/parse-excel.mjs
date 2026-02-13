import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docsDir = join(root, "docs");
const dataDir = join(root, "src", "data");

async function parseExcel(filename, sheetIndex = 0) {
  const buf = await readFile(join(docsDir, filename));
  const wb = XLSX.read(buf, { type: "buffer", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[sheetIndex]];
  return XLSX.utils.sheet_to_json(sheet);
}

function normalizeDate(d) {
  if (!d) return null;
  const date = new Date(d);
  if (isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
}

async function main() {
  await mkdir(dataDir, { recursive: true });

  // Parse Order Master
  const rawOrders = await parseExcel("Order Master.xlsx");
  const orders = rawOrders.map((r) => ({
    order_id: r.order_id,
    order_date: normalizeDate(r.order_date),
    channel: r.channel,
    sku: r.sku,
    order_quantity: Number(r.order_quantity) || 0,
  }));

  // Parse Fulfillment Lines
  const rawFulfillment = await parseExcel("Fulfillment Lines.xlsx");
  const fulfillment = rawFulfillment.map((r) => ({
    fulfillment_order_id: r.fulfillment_order_id,
    order_date: normalizeDate(r.order_date),
    channel: r.channel,
    fulfilled_quantity: Number(r.fulfilled_quantity) || 0,
    fulfillment_location: r.fulfillment_location,
    carrier: r.carrier || null,
    tracking_number: r.tracking_number || null,
    erp_sync_status: r.erp_sync_status,
    ship_date: normalizeDate(r.ship_date_dt),
  }));

  await writeFile(
    join(dataDir, "orders.json"),
    JSON.stringify(orders, null, 2)
  );
  await writeFile(
    join(dataDir, "fulfillment.json"),
    JSON.stringify(fulfillment, null, 2)
  );

  console.log(
    `Parsed ${orders.length} orders, ${fulfillment.length} fulfillment lines`
  );
}

main().catch(console.error);
