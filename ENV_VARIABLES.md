# Environment Variables Documentation

This document lists all environment variables required for the Bingo Bot.

## Required Environment Variables

### 1. `TELEGRAM_BOT_TOKEN` ⚠️ **REQUIRED**
- **Description**: Your Telegram bot token obtained from [@BotFather](https://t.me/BotFather)
- **Type**: String
- **Required**: Yes (bot will not start without this)
- **Example**: `8276788640:AAHLiEsJLJN6BbDnjIWRZYcwYC4zsQwi2zg`
- **Where it's used**: `src/bot/bot.ts` - Bot initialization
- **How to get it**:
  1. Open Telegram and search for `@BotFather`
  2. Send `/newbot` command
  3. Follow the instructions to create a bot
  4. Copy the token provided

---

### 2. `API_BASE_URL`
- **Description**: Base URL of your Go backend API server
- **Type**: String (URL)
- **Required**: No (defaults to `http://localhost:8080`)
- **Default**: `http://localhost:8080`
- **Example**: 
  - Development: `http://localhost:8080`
  - Production: `https://api.yourdomain.com`
- **Where it's used**: `src/bot/services/apiClient.ts` - All API calls
- **Note**: Should not have a trailing slash (automatically removed)

---

### 3. `FRONTEND_URL`
- **Description**: URL of your frontend application
- **Type**: String (URL)
- **Required**: No (defaults to `http://localhost:3001`)
- **Default**: `http://localhost:3001`
- **Example**:
  - Development: `http://localhost:3001`
  - Production: `https://yourdomain.com`
- **Where it's used**:
  - `src/bot/handlers/playHandler.ts` - Game URL generation
  - `src/bot/handlers/instructionHandler.ts` - Instruction page link
  - `src/bot/handlers/callbackHandler.ts` - Game URL in callbacks
- **Note**: Used to generate links for `/play` and `/instruction` commands

---

### 4. `CHANNEL_USERNAME`
- **Description**: Your Telegram channel username (without @ symbol)
- **Type**: String
- **Required**: No (defaults to `your_channel`)
- **Default**: `your_channel`
- **Example**: 
  - If channel is `@mybingo_channel`, use: `mybingo_channel`
  - If channel is `@CheersBingo`, use: `CheersBingo`
- **Where it's used**: `src/bot/handlers/joinChannelHandler.ts` - `/join_channel` command
- **Note**: The @ symbol is automatically removed if present

---

### 5. `SUPPORT_USERNAMES`
- **Description**: Comma-separated list of support channel/username usernames
- **Type**: String (comma-separated)
- **Required**: No (defaults to empty string)
- **Default**: `''` (empty)
- **Example**:
  - `Cheershelp,Cheersbingocontact1`
  - `@Cheershelp,@Cheersbingocontact1`
  - `support1,support2,support3`
- **Where it's used**: `src/bot/handlers/supportHandler.ts` - `/support` command
- **Note**: 
  - Can include or exclude @ symbol (automatically handled)
  - Multiple usernames separated by commas
  - Each username becomes a clickable button in the support message

---

## Complete .env File Example

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8276788640:AAHLiEsJLJN6BbDnjIWRZYcwYC4zsQwi2zg

# Backend API Configuration
API_BASE_URL=http://localhost:8080

# Frontend Configuration
FRONTEND_URL=http://localhost:3001

# Telegram Channel Configuration
CHANNEL_USERNAME=mybingo_channel

# Support Channels Configuration
SUPPORT_USERNAMES=Cheershelp,Cheersbingocontact1
```

---

## Production .env Example

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8276788640:AAHLiEsJLJN6BbDnjIWRZYcwYC4zsQwi2zg

# Backend API Configuration
API_BASE_URL=https://api.yourdomain.com

# Frontend Configuration
FRONTEND_URL=https://yourdomain.com

# Telegram Channel Configuration
CHANNEL_USERNAME=mybingo_channel

# Support Channels Configuration
SUPPORT_USERNAMES=Cheershelp,Cheersbingocontact1
```

---

## Environment Variable Priority

1. **Required**: `TELEGRAM_BOT_TOKEN` - Bot will exit with error if missing
2. **Recommended**: `API_BASE_URL`, `FRONTEND_URL` - Should match your deployment
3. **Optional**: `CHANNEL_USERNAME`, `SUPPORT_USERNAMES` - Have defaults but should be configured

---

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your `.env` file to version control
- The `.env` file should be in `.gitignore`
- `TELEGRAM_BOT_TOKEN` is sensitive - keep it secret
- Use different tokens for development and production
- Rotate tokens if they are exposed

---

## Testing Your Configuration

After setting up your `.env` file, you can test if all variables are loaded correctly:

```bash
# The bot will show an error if TELEGRAM_BOT_TOKEN is missing
npm run dev

# Check if API is reachable (if API_BASE_URL is set)
curl $API_BASE_URL/health
```

---

## Troubleshooting

### Bot won't start
- Check if `TELEGRAM_BOT_TOKEN` is set correctly
- Verify the token is valid by checking with @BotFather

### API calls failing
- Verify `API_BASE_URL` is correct
- Check if the backend server is running
- Ensure the URL doesn't have a trailing slash

### Frontend links not working
- Verify `FRONTEND_URL` is correct
- Check if the frontend server is running
- Ensure URLs are accessible

### Support/Channel commands not working
- Verify `CHANNEL_USERNAME` and `SUPPORT_USERNAMES` are set
- Check that usernames don't have @ symbol (or it will be removed)
- For support, ensure usernames are comma-separated

