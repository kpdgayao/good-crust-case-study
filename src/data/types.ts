export interface OrderLine {
  order_id: string;
  order_date: string;
  channel: string;
  sku: string;
  order_quantity: number;
}

export interface FulfillmentLine {
  fulfillment_order_id: string;
  order_date: string;
  channel: string;
  fulfilled_quantity: number;
  fulfillment_location: string;
  carrier: string | null;
  tracking_number: string | null;
  erp_sync_status: string;
  ship_date: string | null;
}

export interface ReconciliationRow {
  order_id: string;
  order_date: string;
  channel: string;
  sku: string;
  ordered: number;
  fulfilled: number;
  shortfall: number;
  fillRate: number;
}

export interface ChannelSummary {
  channel: string;
  orderLines: number;
  ordered: number;
  fulfilled: number;
  shortfall: number;
  fillRate: number;
}

export interface SkuSummary {
  sku: string;
  lines: number;
  ordered: number;
  fulfilled: number;
  shortfall: number;
  fillRate: number;
}

export interface LocationSummary {
  location: string;
  provider: string;
  lines: number;
  synced: number;
  pending: number;
  syncRate: number;
  avgLag: number | null;
  medianLag: number | null;
  maxLag: number | null;
}
