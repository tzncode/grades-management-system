import { google } from 'googleapis';

/**
 * Obtener cliente autenticado de Google Sheets
 * usando Service Account (para operaciones del servidor)
 */
export async function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive.readonly',
      ],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    
    return sheets;
  } catch (error) {
    console.error('Error al autenticar con Google Sheets:', error);
    throw new Error('No se pudo conectar con Google Sheets');
  }
}

/**
 * Leer datos de una hoja específica
 */
export async function readSheetData(spreadsheetId, sheetName, range = 'A1:Z1000') {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${range}`,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error al leer datos:', error);
    throw new Error(`No se pudieron leer los datos de la hoja: ${sheetName}`);
  }
}

/**
 * Escribir datos en una hoja específica
 */
export async function writeSheetData(spreadsheetId, sheetName, range, values) {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!${range}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al escribir datos:', error);
    throw new Error('No se pudieron guardar los datos');
  }
}

/**
 * Obtener lista de hojas (materias) de un spreadsheet
 */
export async function getSheetsList(spreadsheetId) {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    return response.data.sheets.map(sheet => ({
      id: sheet.properties.sheetId,
      name: sheet.properties.title,
      index: sheet.properties.index,
    }));
  } catch (error) {
    console.error('Error al obtener lista de hojas:', error);
    throw new Error('No se pudo obtener la lista de materias');
  }
}

/**
 * Actualizar múltiples rangos a la vez (batch update)
 */
export async function batchUpdateSheetData(spreadsheetId, updates) {
  try {
    const sheets = await getGoogleSheetsClient();
    
    const response = await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: updates,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error en batch update:', error);
    throw new Error('No se pudieron actualizar los datos');
  }
}