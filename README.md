# react-native-barcode-qr-generator

<img src="/images/example.png" width="350" alt="Barcode Generator" />

Modern, TypeScript-first, SVG-based barcode and QR code generator for React Native. This library provides a simple, performant way to generate high-quality barcodes and QR codes using standard SVG paths.

Developed by Alijanov.

## 🌟 Features

- **✅ TypeScript Support**: Built from the ground up with TypeScript for the best developer experience.
- **⚡ SVG Rendering**: Uses `react-native-svg` for crisp, resolution-independent rendering.
- **🚀 Optimized**: Leverages `useMemo` to ensure minimal re-renders and smooth performance.
- **🛠️ Versatile**: Supports a wide range of barcode formats including CODE128, CODE39, EAN, UPC, and QR Codes.
- **🎨 Customizable**: Easily change colors, dimensions, and add custom labels.

---

## 📦 Installation

Since this library uses `react-native-svg` for rendering, you need to install both:

### 1. Install Dependencies

```bash
# Using npm
npm install react-native-svg react-native-barcode-qr-generator

# Using yarn
yarn add react-native-svg react-native-barcode-qr-generator
```

### 2. iOS Setup (Required for react-native-svg)

If you are developing for iOS, don't forget to install the pods:

```bash
cd ios && pod install && cd ..
```

---

## 🚀 Usage

### Simple Barcode

```tsx
import Barcode from 'react-native-barcode-qr-generator';

const MyComponent = () => (
  <Barcode
    value="alicanov98"
    format="CODE128"
    width={2}
    height={100}
    lineColor="#000000"
    background="#ffffff"
    text="MY BARCODE"
  />
);
```

### QR Code

```tsx
import Barcode from 'react-native-barcode-qr-generator';

const MyComponent = () => (
  <Barcode
    value="https://github.com/alicanov98/alicanov98"
    type="qrcode"
    width={5}
  />
);
```

### 🎨 Customization

You can fully customize the barcode's look and feel, including colors and label styling:

```tsx
<Barcode
  value="CUSTOM-STYLE"
  format="CODE128"
  lineColor="#2e7d32"      // Custom bar color (Green)
  background="#fcfcfc"     // Custom container background
  width={2}
  height={100}
  text="GREEN BARCODE"
  textStyle={{             // Styling for the text label
    color: '#2e7d32',
    fontSize: 18,
    fontWeight: 'bold',
  }}
  style={{                 // Styling for the outer container
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  }}
/>
```

---

## 📝 Props

| Prop | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| `type` | `'barcode' \| 'qrcode'` | The type of code to generate | `'barcode'` |
| `value` | `string` | The message/text to encode (Required) | `''` |
| `format` | `BarcodeFormat` | The barcode format (e.g., CODE128, CODE39) | `'CODE128'` |
| `width` | `number` | Width of a single bar (pixel-based) | `2` |
| `maxWidth` | `number` | Maximum width for the entire barcode | - |
| `height` | `number` | Height of the barcode bars | `100` |
| `lineColor` | `string` | Color of the barcode bars | `#000000` |
| `background` | `string` | Background color of the container | `#ffffff` |
| `text` | `ReactNode` | Optional text to display below the barcode | - |
| `textStyle` | `TextStyle` | Styles for the label text | - |
| `style` | `ViewStyle` | Styles for the outer container | - |
| `onError` | `(err: Error) => void` | Callback triggered on encoding error | - |

### Supported Barcode Formats

- **Standard**: CODE128 (A, B, C), CODE39
- **Retail**: EAN13, EAN8, EAN5, EAN2, UPC, UPCE
- **Industrial**: ITF14, ITF, Codabar, Pharmacode
- **MSI**: MSI10, MSI11, MSI1010, MSI1110

---

## 🤝 Contributing

Contributions are welcome! If you find a bug or have a feature request, please open an issue or submit a pull request on the [GitHub repository](https://github.com/alicanov98/alicanov98).

## Support & Donation ☕️

If this library has been helpful to you, consider supporting its development! Your contributions help maintain the project and introduce new features.

<div align="center">
  <p><b>Scan the QR code to support:</b></p>
  <a href="https://kofe.al/@alicanov98">
    <img src="https://kofe.al/storage/images/qrcodes/alicanov98-1774646802.png" width="200" alt="Support QR Code" />
  </a>
  <p>
    <a href="https://kofe.al/@alicanov98">
      <b>Buy me a coffee on kofe.al ☕️</b>
    </a>
  </p>
</div>

---

## 📄 License

MIT © alicanov98
Created with ❤️ by Alijanov
