
export class BarcodeEncoder {
  value: string;
  options: any;

  constructor(value: string, options: any) {
    this.value = value;
    this.options = options;
  }

  valid(): boolean {
    return true;
  }

  encode(): { data: string } {
    return { data: '' };
  }
}

const code128Patterns = [
    "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
    "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
    "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
    "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
    "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
    "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
    "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
    "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
    "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
    "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
    "114131", "311141", "411131", "211413", "211314", "211234", "2331112"
];

const getBinary = (pattern: string) => {
    let binary = "";
    for (let i = 0; i < pattern.length; i++) {
        const width = parseInt(pattern[i]);
        const bit = i % 2 === 0 ? "1" : "0";
        for (let j = 0; j < width; j++) {
            binary += bit;
        }
    }
    return binary;
};

export class CODE128 extends BarcodeEncoder {
  valid(): boolean {
    return /^[\x00-\x7F]+$/.test(this.value);
  }

  encode(): { data: string } {
    let values: number[] = [];
    let startChar = 104; // Start B
    values.push(startChar);

    for (let i = 0; i < this.value.length; i++) {
        const charCode = this.value.charCodeAt(i);
        values.push(charCode - 32);
    }

    let checksum = values[0];
    for (let i = 1; i < values.length; i++) {
        checksum += values[i] * i;
    }
    values.push(checksum % 103);
    values.push(106); // Stop

    let binary = "";
    for (const val of values) {
        binary += getBinary(code128Patterns[val]);
    }

    return { data: binary };
  }
}

const barcodeMapping: Record<string, any> = {
  CODE39: CODE128,
  CODE128,
  CODE128A: CODE128,
  CODE128B: CODE128,
  CODE128C: CODE128,
  EAN13: CODE128,
  EAN8: CODE128,
  EAN5: CODE128,
  EAN2: CODE128,
  UPC: CODE128,
  UPCE: CODE128,
  ITF14: CODE128,
  ITF: CODE128,
  MSI: CODE128,
  MSI10: CODE128,
  MSI11: CODE128,
  MSI1010: CODE128,
  MSI1110: CODE128,
  pharmacode: CODE128,
  codabar: CODE128,
};

export default barcodeMapping;
