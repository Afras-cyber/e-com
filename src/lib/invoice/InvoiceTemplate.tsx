import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    color: "#1a1a1a",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 36,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
  },
  shopName: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    color: "#111111",
  },
  shopTagline: {
    fontSize: 8,
    color: "#888888",
    marginTop: 4,
    letterSpacing: 1.5,
  },
  invoiceTitleBlock: {
    alignItems: "flex-end",
  },
  invoiceTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    letterSpacing: 1,
  },
  invoiceNumber: {
    fontSize: 11,
    color: "#555555",
    marginTop: 4,
  },
  invoiceDate: {
    fontSize: 9,
    color: "#888888",
    marginTop: 2,
  },

  // Status badge
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#111111",
    borderRadius: 4,
    alignSelf: "flex-end",
  },
  statusText: {
    fontSize: 8,
    color: "#ffffff",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1.5,
  },

  // Info section
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 20,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  infoName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    marginBottom: 3,
  },
  infoText: {
    fontSize: 9.5,
    color: "#444444",
    marginBottom: 2,
    lineHeight: 1.5,
  },

  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    marginBottom: 24,
  },

  // Items table
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111111",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    letterSpacing: 1,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tableRowAlt: {
    backgroundColor: "#fafafa",
  },

  // Column widths
  colProduct: { flex: 4 },
  colSize: { flex: 1.5, textAlign: "center" },
  colColor: { flex: 1.5, textAlign: "center" },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 2, textAlign: "right" },

  cellText: {
    fontSize: 9.5,
    color: "#333333",
  },
  cellTextBold: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9.5,
    color: "#111111",
  },

  // Totals
  totalsBlock: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 6,
    gap: 16,
  },
  totalLabel: {
    fontSize: 9,
    color: "#888888",
    width: 120,
    textAlign: "right",
  },
  totalValue: {
    fontSize: 9,
    color: "#333333",
    width: 90,
    textAlign: "right",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#111111",
    gap: 16,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    width: 120,
    textAlign: "right",
  },
  grandTotalValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    width: 90,
    textAlign: "right",
  },

  // Note
  noteBlock: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderLeftWidth: 3,
    borderLeftColor: "#111111",
    borderRadius: 2,
  },
  noteLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 9,
    color: "#555555",
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 12,
  },
  footerText: {
    fontSize: 8,
    color: "#aaaaaa",
  },
  footerBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#888888",
  },

  // Thank you
  thankYou: {
    marginTop: 32,
    alignItems: "center",
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  thankYouText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#333333",
    letterSpacing: 1,
  },
  thankYouSub: {
    fontSize: 8.5,
    color: "#aaaaaa",
    marginTop: 4,
  },
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvoiceData {
  orderNumber: string;
  createdAt: string; // ISO date string
  status: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  items: {
    productName: string;
    selectedSize: string;
    selectedColor: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  negotiatedTotal?: number;
  notes?: string;
  shopName: string;
  shopPhone: string;
  shopEmail: string;
  shopAddress: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return `LKR ${amount.toLocaleString("en-LK")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export function InvoiceDocument({ data }: { data: InvoiceData }) {
  const finalTotal = data.negotiatedTotal ?? data.totalAmount;
  const hasDiscount =
    data.negotiatedTotal !== undefined &&
    data.negotiatedTotal !== data.totalAmount;

  return (
    <Document
      title={`Invoice — ${data.orderNumber}`}
      author={data.shopName}
      subject="Order Invoice"
    >
      <Page size="A4" style={styles.page}>
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.shopName}>{data.shopName.toUpperCase()}</Text>
            <Text style={styles.shopTagline}>
              PREMIUM SHOES & BAGS — SINCE 2024
            </Text>
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{data.orderNumber}</Text>
            <Text style={styles.invoiceDate}>
              {formatDate(data.createdAt)}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {data.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Billing Info ── */}
        <View style={styles.infoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>BILL TO</Text>
            <Text style={styles.infoName}>{data.customer.name}</Text>
            <Text style={styles.infoText}>{data.customer.phone}</Text>
            {data.customer.email && (
              <Text style={styles.infoText}>{data.customer.email}</Text>
            )}
            {data.customer.address && (
              <Text style={styles.infoText}>{data.customer.address}</Text>
            )}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>FROM</Text>
            <Text style={styles.infoName}>{data.shopName}</Text>
            <Text style={styles.infoText}>{data.shopAddress}</Text>
            <Text style={styles.infoText}>{data.shopPhone}</Text>
            <Text style={styles.infoText}>{data.shopEmail}</Text>
          </View>
        </View>

        {/* ── Items Table ── */}
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.colProduct]}>
              PRODUCT
            </Text>
            <Text style={[styles.tableHeaderText, styles.colSize]}>
              SIZE
            </Text>
            <Text style={[styles.tableHeaderText, styles.colColor]}>
              COLOR
            </Text>
            <Text style={[styles.tableHeaderText, styles.colQty]}>
              QTY
            </Text>
            <Text style={[styles.tableHeaderText, styles.colPrice]}>
              AMOUNT
            </Text>
          </View>

          {data.items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 1 ? styles.tableRowAlt : {},
              ]}
            >
              <Text style={[styles.cellTextBold, styles.colProduct]}>
                {item.productName}
              </Text>
              <Text style={[styles.cellText, styles.colSize]}>
                {item.selectedSize}
              </Text>
              <Text style={[styles.cellText, styles.colColor]}>
                {item.selectedColor}
              </Text>
              <Text style={[styles.cellText, styles.colQty]}>
                {item.quantity}
              </Text>
              <Text style={[styles.cellTextBold, styles.colPrice]}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Totals ── */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(data.totalAmount)}
            </Text>
          </View>
          {hasDiscount && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Negotiated Price</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.negotiatedTotal!)}
              </Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL DUE</Text>
            <Text style={styles.grandTotalValue}>
              {formatCurrency(finalTotal)}
            </Text>
          </View>
        </View>

        {/* ── Note ── */}
        {data.notes && (
          <View style={styles.noteBlock}>
            <Text style={styles.noteLabel}>NOTE</Text>
            <Text style={styles.noteText}>{data.notes}</Text>
          </View>
        )}

        {/* ── Thank You ── */}
        <View style={styles.thankYou}>
          <Text style={styles.thankYouText}>Thank you for your purchase!</Text>
          <Text style={styles.thankYouSub}>
            We appreciate your business and hope to see you again soon.
          </Text>
        </View>

        {/* ── Footer ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.shopName} · {data.shopPhone}
          </Text>
          <Text style={styles.footerBold}>{data.orderNumber}</Text>
          <Text style={styles.footerText}>
            This is an official invoice generated by {data.shopName}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
