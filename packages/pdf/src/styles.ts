import { StyleSheet } from '@react-pdf/renderer';

export const COMPANY = {
  name: 'C.H.C. Horses SA',
  address: 'Via Ressiga 7',
  city: '6514 Sementina',
  phone: '+41 76 339 38 65',
  iban: 'CH40 0900 0000 6947 0789 7',
  che: 'CHE-115.295.448',
  owner: 'Gianluca Agustoni',
} as const;

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  companyInfo: {
    fontSize: 9,
    color: '#666',
  },
  invoiceTitle: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  invoiceMeta: {
    fontSize: 10,
  },
  clientSection: {
    marginBottom: 25,
  },
  clientName: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
  },
  clientAddress: {
    fontSize: 10,
    marginTop: 4,
  },
  table: {
    marginTop: 10,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 5,
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
  },
  colArt: { width: '8%' },
  colName: { width: '25%' },
  colDesc: { width: '27%', paddingRight: 5 },
  colUnit: { width: '10%' },
  colPrice: { width: '10%', textAlign: 'right' },
  colQty: { width: '8%', textAlign: 'center' },
  colVat: { width: '5%', textAlign: 'right' },
  colSubtotal: { width: '12%', textAlign: 'right' },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingVertical: 3,
    width: 200,
  },
  totalsLabel: {
    width: 100,
    textAlign: 'left',
  },
  totalsValue: {
    width: 100,
    textAlign: 'right',
  },
  totalsFinal: {
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginTop: 5,
    paddingTop: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
  },
  footerLine: {
    fontSize: 8,
    color: '#666',
    textAlign: 'center',
  },
  paymentBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  paymentTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
  },
  notes: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fafafa',
    fontSize: 9,
    fontStyle: 'italic',
  },
});
