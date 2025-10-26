import { useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode.react';
import { useTranslation } from 'react-i18next';

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontSize: 11,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
    fontSize: 11,
    color: '#1f2937',
  },
  priceSection: {
    backgroundColor: '#f3f4f6',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  feature: {
    width: '50%',
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 5,
    paddingLeft: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 9,
    color: '#9ca3af',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  qrSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 10,
  },
  imageContainer: {
    marginTop: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  vehicleImage: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'cover',
  },
});

// PDF Document Component
const VehiclePDFDocument = ({ vehicle, qrCodeDataURL }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('ro-RO').format(num);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {vehicle.brand} {vehicle.model}
          </Text>
          <Text style={styles.subtitle}>
            Fișă Tehnică - Generated on {new Date().toLocaleDateString('ro-RO')}
          </Text>
        </View>

        {/* Price Section */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(vehicle.price)}</Text>
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informații Generale</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Brand:</Text>
            <Text style={styles.value}>{vehicle.brand}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>{vehicle.model}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>An Fabricație:</Text>
            <Text style={styles.value}>{vehicle.year}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Kilometraj:</Text>
            <Text style={styles.value}>{formatNumber(vehicle.mileage)} km</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Stare:</Text>
            <Text style={styles.value}>{vehicle.condition}</Text>
          </View>
        </View>

        {/* Technical Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specificații Tehnice</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Motor:</Text>
            <Text style={styles.value}>{vehicle.fuelType || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Transmisie:</Text>
            <Text style={styles.value}>{vehicle.transmission || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Putere Motor:</Text>
            <Text style={styles.value}>{vehicle.horsePower || 'N/A'} CP</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Capacitate Cilindree:</Text>
            <Text style={styles.value}>{vehicle.engineCapacity || 'N/A'} cm³</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tip Caroserie:</Text>
            <Text style={styles.value}>{vehicle.bodyType || 'N/A'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Culoare:</Text>
            <Text style={styles.value}>{vehicle.color || 'N/A'}</Text>
          </View>
        </View>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dotări și Opțiuni</Text>
            <View style={styles.featuresGrid}>
              {vehicle.features.map((feature, index) => (
                <Text key={index} style={styles.feature}>
                  • {feature}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* QR Code Section */}
        {qrCodeDataURL && (
          <View style={styles.qrSection}>
            <Image
              src={qrCodeDataURL}
              style={{ width: 100, height: 100 }}
            />
            <Text style={styles.qrText}>
              Scanați codul QR pentru a vizualiza anunțul online
            </Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Auto Marketplace Professional | www.automarketplace.ro | ID: {vehicle.id}
          </Text>
          <Text>
            Acest document are caracter informativ și nu constituie ofertă de vânzare.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// Main Component
const PDFGenerator = ({ vehicle }) => {
  const { t } = useTranslation();
  const [qrCodeDataURL, setQrCodeDataURL] = useState(null);

  // Generate QR Code as data URL
  const generateQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL();
      setQrCodeDataURL(dataURL);
    }
  };

  // URL for QR code (link to vehicle details)
  const vehicleURL = `${window.location.origin}/vehicles/${vehicle.id}`;

  return (
    <div className="pdf-generator">
      {/* Hidden QR Code Canvas */}
      <div style={{ display: 'none' }}>
        <QRCode
          id="qr-code-canvas"
          value={vehicleURL}
          size={256}
          level="H"
          onLoad={generateQRCode}
        />
      </div>

      {/* Download Button */}
      <PDFDownloadLink
        document={<VehiclePDFDocument vehicle={vehicle} qrCodeDataURL={qrCodeDataURL} />}
        fileName={`${vehicle.brand}-${vehicle.model}-${vehicle.year}-${vehicle.id}.pdf`}
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        onRender={generateQRCode}
      >
        {({ loading }) => (
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {loading ? t('pdf.generating') || 'Generating PDF...' : t('pdf.download') || 'Download Technical Sheet PDF'}
          </span>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFGenerator;
