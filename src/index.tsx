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
   * QR Error Correction Level
   * @default 'M'
   */
  ecl?: 'L' | 'M' | 'Q' | 'H';
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
  ecl = 'M',
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
            singleBarWidth * barConsecutiveCount,
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
          singleBarWidth * barConsecutiveCount,
          height
        )
      );
    }

    return rects;
  };

  const drawSvgQrCode = (inputText: string) => {
    const qr = new QRCodeModel(-1, ecl);
    qr.addData(inputText);
    qr.make();
    const rowCount = qr.getModuleCount();
    const modules: { x: number; y: number; width: number; height: number }[] = [];
    const cellSize = width;

    const margin = 4;
    const size = (rowCount + margin * 2) * cellSize;

    for (let row = 0; row < rowCount; row++) {
      let col = 0;
      while (col < rowCount) {
        if (qr.isDark(row, col)) {
          let startCol = col;
          while (col < rowCount && qr.isDark(row, col)) {
            col++;
          }
          modules.push({
            x: (startCol + margin) * cellSize,
            y: (row + margin) * cellSize,
            width: (col - startCol) * cellSize,
            height: cellSize,
          });
        } else {
          col++;
        }
      }
    }

    return { modules, size };
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

  const { bars, barCodeWidth, barCodeHeight, qrSize } = useMemo(() => {
    try {
      if (type === 'qrcode') {
        const { modules, size: qrInternalSize } = drawSvgQrCode(value);
        const finalSize = size || qrInternalSize;
        return {
          bars: modules,
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
      bars: [] as string[],
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
    ecl,
  ]);

  const svgQrInternalSize = qrSize || barCodeWidth;

  const svgDimensions = useMemo(() => {
    if (type === 'qrcode') {
      return {
        width: size || barCodeWidth,
        height: size || barCodeHeight,
      };
    }
    return {
      width: barCodeWidth,
      height: barCodeHeight,
    };
  }, [type, size, barCodeWidth, barCodeHeight]);

  return (
    <View style={[{ backgroundColor: background, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg
        {...svgDimensions}
        fill={lineColor}
        viewBox={type === 'qrcode' ? `0 0 ${svgQrInternalSize} ${svgQrInternalSize}` : undefined}
        preserveAspectRatio="xMidYMid meet"
      >
        {type === 'qrcode' ? (
          <>
            <Path
              d={drawRect(0, 0, svgQrInternalSize, svgQrInternalSize)}
              fill={background}
            />
            {(bars as any[]).map((m, i) => (
              <Path
                key={`q-${i}`}
                d={drawRect(m.x, m.y, m.width, m.height)}
                fill={lineColor}
              />
            ))}
          </>
        ) : (
          <Path d={(bars as string[]).join(' ')} />
        )}
      </Svg>
      {text && (
        <Text style={[{ textAlign: 'center' }, textStyle] as any}>{text}</Text>
      )}
    </View>
  );
};

export default Barcode;
