import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles, COMPANY } from './styles';
import type { InvoiceData } from './types';

function formatCHF(amount: number): string {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

interface InvoiceDocumentProps {
  data: InvoiceData;
}

export function InvoiceDocument({ data }: InvoiceDocumentProps) {
  const balance = data.total - (data.paidAmount ?? 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>FATTURA</Text>
            <Text style={styles.invoiceMeta}>N. {data.number}</Text>
            <Text style={styles.invoiceMeta}>Data: {formatDate(data.date)}</Text>
            {data.period && (
              <Text style={styles.invoiceMeta}>Periodo: {data.period}</Text>
            )}
          </View>
          <View style={styles.companyInfo}>
            <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 11 }}>{COMPANY.name}</Text>
            <Text>{COMPANY.address}</Text>
            <Text>{COMPANY.city}</Text>
            <Text>Tel: {COMPANY.phone}</Text>
            <Text>{COMPANY.che}</Text>
          </View>
        </View>

        {/* Client */}
        <View style={styles.clientSection}>
          <Text style={styles.clientName}>{data.client.name}</Text>
          {data.client.address && (
            <Text style={styles.clientAddress}>{data.client.address}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colArt}>Art.</Text>
            <Text style={styles.colName}>Prestazione</Text>
            <Text style={styles.colDesc}>Descrizione</Text>
            <Text style={styles.colUnit}>Unità</Text>
            <Text style={styles.colPrice}>Prezzo</Text>
            <Text style={styles.colQty}>Qtà</Text>
            <Text style={styles.colVat}>IVA</Text>
            <Text style={styles.colSubtotal}>Totale</Text>
          </View>
          {data.items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colArt}>{item.art}</Text>
              <Text style={styles.colName}>{item.name}</Text>
              <Text style={styles.colDesc}>{item.desc}</Text>
              <Text style={styles.colUnit}>{item.unit}</Text>
              <Text style={styles.colPrice}>{formatCHF(item.price)}</Text>
              <Text style={styles.colQty}>{item.qty}</Text>
              <Text style={styles.colVat}>{item.vat > 0 ? `${item.vat}%` : '-'}</Text>
              <Text style={styles.colSubtotal}>{formatCHF(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsLabel}>Netto:</Text>
            <Text style={styles.totalsValue}>CHF {formatCHF(data.net)}</Text>
          </View>
          {Object.entries(data.vatMap).map(([rate, amount]) => (
            <View key={rate} style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>IVA {rate}%:</Text>
              <Text style={styles.totalsValue}>CHF {formatCHF(amount)}</Text>
            </View>
          ))}
          <View style={[styles.totalsRow, styles.totalsFinal]}>
            <Text style={styles.totalsLabel}>TOTALE:</Text>
            <Text style={styles.totalsValue}>CHF {formatCHF(data.total)}</Text>
          </View>
          {data.paidAmount !== null && data.paidAmount > 0 && (
            <>
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Vs. Versamento:</Text>
                <Text style={styles.totalsValue}>CHF {formatCHF(data.paidAmount)}</Text>
              </View>
              <View style={[styles.totalsRow, styles.totalsFinal]}>
                <Text style={styles.totalsLabel}>A SALDO:</Text>
                <Text style={styles.totalsValue}>CHF {formatCHF(balance)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.notes}>
            <Text>{data.notes}</Text>
          </View>
        )}

        {/* Payment Info */}
        <View style={styles.paymentBox}>
          <Text style={styles.paymentTitle}>Coordinate di pagamento</Text>
          <Text>IBAN: {COMPANY.iban}</Text>
          <Text>Intestato a: {COMPANY.name}</Text>
          <Text>Riferimento: Fattura N. {data.number}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>
            {COMPANY.name} • {COMPANY.address}, {COMPANY.city} • {COMPANY.che}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
