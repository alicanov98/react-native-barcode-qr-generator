# react-native-barcode-qr-generator

<div align="center">
  <p align="center">
    <img src="https://img.shields.io/badge/UI-Premium-blueviolet?style=for-the-badge" alt="Aesthetic" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript" alt="Type" />
    <img src="https://img.shields.io/badge/Dependencies-Zero-green?style=for-the-badge" alt="Deps" />
    <img src="https://img.shields.io/badge/iOS-Supported-black?style=for-the-badge&logo=apple" alt="iOS" />
    <img src="https://img.shields.io/badge/Android-Supported-green?style=for-the-badge&logo=android" alt="Android" />
  </p>
</div>

Modern, **TypeScript-first**, SVG-based barcode and QR code generator for React Native. This library provides a high-performance, dependency-free way to generate sharp barcodes and QR codes that scan instantly on both iOS and Android.

---

## 🌟 Features

- **✅ Native Scanability**: Optimized SVG paths with high-precision rounding to ensure perfect scanning on Android (even with 100+ characters).
- **⚡ SVG Rendering**: Built on `react-native-svg` for crisp, resolution-independent quality.
- **🛡️ Custom QR Engine**: Robust internal QR generator supporting high-capacity data (up to version 20+).
- **🚀 Ultra Fast**: Leverages `useMemo` for efficient rendering and zero performance lag.
- **🎨 Complete Control**: Customize Error Correction Level (ECL), margins, colors, and sizing.

---

## 📦 Installation

Since this library uses `react-native-svg` for rendering, ensure you have it installed.

### Using npm
```bash
npm install react-native-svg react-native-barcode-qr-generator
```

### Using yarn
```bash
yarn add react-native-svg react-native-barcode-qr-generator
```

### iOS Setup (Required)
If you are developing for iOS, don't forget to install the pods:
```bash
cd ios && pod install && cd ..
```

---

## 🚀 Usage

### QR Code (Highly Recommended)
For QR codes, use the `size` prop and `ecl` (Error Correction Level) for the best results on mobile screens.

```tsx
import Barcode from 'react-native-barcode-qr-generator';

const MyComponent = () => (
  <Barcode
    value="https://github.com/alicanov98/react-native-barcode-qr-generator"
    type="qrcode"
    size={250}      // Fixed square size (recommended)
    ecl="M"        // Error Correction: L, M, Q, H (M is best for mobile)
  />
);
```

### Classic Barcode
```tsx
<Barcode
  value="alicanov98"
  format="CODE128"
  width={2}
  height={100}
  lineColor="#000000"
  background="#ffffff"
  text="MY BARCODE"
/>
```

### 🎨 Advanced Styling
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
| `value` | `string` | The text to encode (Required) | `''` |
| `type` | `'barcode' \| 'qrcode'` | Type of engine to use | `'barcode'` |
| `size` | `number` | Fixed dimension (Width & Height) for QR codes | - |
| `ecl` | `'L' \| 'M' \| 'Q' \| 'H'` | QR Error Correction Level | `'M'` |
| `format` | `BarcodeFormat` | Barcode encoding (CODE128, EAN, etc.) | `'CODE128'` |
| `width` | `number` | Single bar/module width | `2` |
| `height` | `number` | Height of the bars | `100` |
| `lineColor` | `string` | Bar/Module color | `#000000` |
| `background` | `string` | Quiet zone background color | `#ffffff` |
| `text` | `ReactNode` | Optional label displayed below | - |
| `textStyle` | `TextStyle` | Styling for the label text | - |
| `style` | `ViewStyle` | Styles for the outer container | - |
| `onError` | `(err: Error) => void` | Error callback | - |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/alicanov98/react-native-barcode-qr-generator).

## Support & Donation ☕️

If this library helped you, consider supporting its development!

<div align="center">
  <a href="https://kofe.al/@alicanov98">
    <img src="https://kofe.al/storage/images/qrcodes/alicanov98-1774646802.png" width="200" alt="Support QR Code" />
  </a>
  <br/>
  <a href="https://kofe.al/@alicanov98">
    <b>Buy me a coffee on kofe.al ☕️</b>
  </a>
</div>

---

## 📄 License

MIT © [alicanov98](https://github.com/alicanov98) | Created with ❤️ by Alijanov
