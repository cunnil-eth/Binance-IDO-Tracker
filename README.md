# Binance IDO Tracker Bot

## Overview

Binance IDO Tracker Bot is a WebSocket-based bot written in TypeScript. It listens for NewIDOContract events from a specific smart contract and sends notifications to a Telegram channel.

## Features

- Listens for NewIDOContract events via WebSocket.
- Retrieves the transaction data that triggered the event.
- Extracts function parameters from the transaction input data.
- Fetches the ERC-20 token symbol for better readability.
- Sends notifications to a Telegram channel.

## Installation

### Prerequisites
- Node.js (version 18 or later)
- TypeScript installed globally (npm install -g typescript)
- Telegram Bot API token
- WebSocket RPC URL (e.g., Alchemy, Infura)

### Steps
1. Clone the repository:
   ```
   git clone https://github.com/cunnil-eth/Binance-IDO-Tracker.git
   cd binance-ido-tracker
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=-100XXXXXXXXXX # Telegram channel ID
   WS_RPC_URL=wss://your-websocket-rpc
   CONTRACT_ADDRESS=0xYourContractAddress
   ```
4. Start the bot:
   ```
   npx ts-node src/index.ts
   ```
