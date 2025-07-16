import QRCode from 'qrcode';

export async function generateQRCode(text: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

export async function generateStyledQRCode(text: string, foregroundColor: string = '#000000', backgroundColor: string = '#FFFFFF'): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(text, {
      width: 256,
      margin: 2,
      color: {
        dark: foregroundColor,
        light: backgroundColor
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Failed to generate styled QR code');
  }
}