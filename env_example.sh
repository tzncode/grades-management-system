# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_key_aqui_genera_uno_aleatorio

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id_de_google_cloud_console
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google_cloud_console

# Google Sheets API
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu_private_key_aqui\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=tu_service_account@proyecto.iam.gserviceaccount.com

# ID de la hoja de cálculo principal (se obtiene de la URL de Google Sheets)
# Ejemplo: https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
GOOGLE_SPREADSHEET_ID=tu_spreadsheet_id_aqui

# Ambiente
NODE_ENV=development