import React, { useMemo } from 'react';
import { View, Text, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Svg, { Path } from 'react-native-svg';
// @ts-ignore
import barcodes from './barcodes';
import { QRCodeModel } from './qr';

declare const __DEV__: boolean;

export type BarcodeFormat =
  | 'CODE39'
  | 'CODE128'
  | 'CODE128A'
  | 'CODE128B'
  | 'CODE128C'
  | 'EAN13'
  | 'EAN8'
  | 'EAN5'
  | 'EAN2'
  | 'UPC'
  | 'UPCE'
  | 'ITF14'
  | 'ITF'
  | 'MSI'
  | 'MSI10'
  | 'MSI11'
  | 'MSI1010'
  | 'MSI1110'
  | 'pharmacode'
  | 'codabar';

export type CodeType = 'barcode' | 'qrcode';

export interface BarcodeProps {
  /**
   * The type of code to generate
   * @default 'barcode'
   */
  type?: CodeType;
  /**
   * The text to be encoded
   */
  value: string;
  /**
   * The width of a single bar
   * @default 2
   */
  width?: number;
  /**
   * The max width of the barcode
   */
  maxWidth?: number;
  /**
   * The height of the barcode
   * @default 100
   */
  height?: number;
  /**
   * select which barcode type to use
   * @default 'CODE128'
   */
  format?: BarcodeFormat;
  /**
   * set the color of a single bar
   * @default '#000000'
   */
  lineColor?: string;
  /**
   * set the color of the container
   * @default '#ffffff'
   */
  background?: string;
  /**
   * an optional text that will be render under the barcode
   */
  text?: React.ReactNode;
  /**
   * styles to be applied on the text component
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * styles to be applied on the container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * fixed size for the code (mostly for QR codes)
   */
  size?: number;
  /**
   * an optional error handler
   */
  onError?: (error: Error) => void;
}

const Barcode: React.FC<BarcodeProps> = ({
  type = 'barcode',
  value = '',
  width = 2,
  height = 100,
  format = 'CODE128',
  lineColor = '#000000',
  background = '#ffffff',
  text,
  textStyle,
  style,
  onError,
  maxWidth,
  size,
}) => {
  const drawRect = (x: number, y: number, w: number, h: number) => {
    return `M${x},${y}h${w}v${h}h-${w}z`;
  };

  const drawSvgBarCode = (encoded: { data: string }) => {
    const rects: string[] = [];
    const binary = encoded.data;

    const barCodeWidth = binary.length * width;
    const singleBarWidth =
      typeof maxWidth === 'number' && barCodeWidth > maxWidth
        ? maxWidth / binary.length
        : width;
    
    let barConsecutiveCount = 0;
    let x = 0;
    const yFrom = 0;

    for (let b = 0; b < binary.length; b++) {
      x = b * singleBarWidth;
      if (binary[b] === '1') {
        barConsecutiveCount++;
      } else if (barConsecutiveCount > 0) {
        rects.push(
          drawRect(
            x - singleBarWidth * barConsecutiveCount,
            yFrom,
            singleBarWidth * barConsecutiveCount + 0.1, // Added overlap
            height
          )
        );
        barConsecutiveCount = 0;
      }
    }

    if (barConsecutiveCount > 0) {
      rects.push(
        drawRect(
          (binary.length - barConsecutiveCount) * singleBarWidth,
          yFrom,
          singleBarWidth * barConsecutiveCount + 0.1, // Added overlap
          height
        )
      );
    }

    return rects;
  };

  const drawSvgQrCode = (inputText: string) => {
    const qr = new QRCodeModel(-1, 'Q');
    qr.addData(inputText);
    qr.make();
    const rowCount = qr.getModuleCount();
    const rects: string[] = [];
    const cellSize = width;

    // QR Code standard recommends a quiet zone of 4 modules.
    // We'll add a small margin to ensure readability on all devices.
    const margin = 2; // Reduced from 4 to keep it compact but still helpful
    const size = (rowCount + margin * 2) * cellSize;

    for (let row = 0; row < rowCount; row++) {
      let col = 0;
      while (col < rowCount) {
        if (qr.isDark(row, col)) {
          let startCol = col;
          // Merge adjacent horizontal dark cells
          while (col < rowCount && qr.isDark(row, col)) {
            col++;
          }
          rects.push(
            drawRect(
              (startCol + margin) * cellSize,
              (row + margin) * cellSize,
              (col - startCol) * cellSize + 0.1, // Added overlap
              cellSize + 0.1 // Added overlap
            )
          );
        } else {
          col++;
        }
      }
    }

    return { rects, size, rowCount };
  };

  const encode = (inputText: string, Encoder: any) => {
    if (typeof inputText !== 'string' || inputText.length === 0) {
      throw new Error('Barcode value must be a non-empty string');
    }
    const encoder = new Encoder(inputText, {
      width,
      format,
      height,
      lineColor,
      background,
      flat: true,
    });
    if (!encoder.valid()) {
      throw new Error('Invalid barcode for selected format.');
    }
    return encoder.encode();
  };

  const { bars, barCodeWidth, barCodeHeight } = useMemo(() => {
    try {
      if (type === 'qrcode') {
        const { rects, size: qrInternalSize } = drawSvgQrCode(value);
        const finalSize = size || qrInternalSize;
        return {
          bars: rects,
          barCodeWidth: finalSize,
          barCodeHeight: finalSize,
          qrSize: qrInternalSize,
        };
      }

      const encoder = barcodes[format];
      if (!encoder) {
        throw new Error('Invalid barcode format.');
      }
      const encoded = encode(value, encoder);
      const calculatedWidth = encoded.data.length * width;

      return {
        bars: drawSvgBarCode(encoded),
        barCodeWidth:
          typeof maxWidth === 'number' && calculatedWidth > maxWidth
            ? maxWidth
            : calculatedWidth,
        barCodeHeight: height,
      };
    } catch (error) {
      if (typeof __DEV__ !== 'undefined' && __DEV__) {
        console.error(error instanceof Error ? error.message : error);
      }
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
    return {
      bars: [],
      barCodeWidth: 0,
      barCodeHeight: 0,
      qrSize: 0,
    };
  }, [
    type,
    value,
    width,
    height,
    format,
    lineColor,
    background,
    maxWidth,
    onError,
    size,
  ]);

  const barsData = bars as string[];
  const svgQrSize = (bars as any).qrSize;

  return (
    <View style={[{ backgroundColor: background, alignItems: 'center' }, style]}>
      <Svg
        height={barCodeHeight}
        width={barCodeWidth}
        fill={lineColor}
        viewBox={type === 'qrcode' ? `0 0 ${svgQrSize || barCodeWidth} ${svgQrSize || barCodeHeight}` : undefined}
      >
        <Path d={barsData.join ? barsData.join(' ') : ''} />
      </Svg>
      {text && (
        <Text style={[{ textAlign: 'center' }, textStyle] as any}>{text}</Text>
      )}
    </View>
  );
};

export default Barcode;
