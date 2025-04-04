import { ethers } from "ethers";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const WS_RPC_URL = process.env.WS_RPC_URL!;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

const provider = new ethers.WebSocketProvider(WS_RPC_URL);
const bot = new Telegraf(TELEGRAM_BOT_TOKEN);

const contractAbi = [
  "event NewIDOContract(address indexed idoAddress)",
  "function createIDO(address[] _addresses,uint256[] _startAndEndTimestamps,uint8 _maxPoolId)"
];

const erc20Abi = [
    "function symbol() view returns (string)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
const iface = new ethers.Interface(contractAbi);

contract.on("NewIDOContract", async (idoAddress: string, event: any) => {
  try {
    // Get transaction data
    const tx = await provider.getTransaction(event.log.transactionHash);
    if (!tx) {
      console.error("Error: transaction is not found");
      return;
    }

    // Decoding transaction parameters
    const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });

    if (decoded?.name === "createIDO") {
      const addresses = decoded.args[0]; 
      const timestamps = decoded.args[1]; 
      const tokenAddress = addresses[2];

      // Searching for symbol
      let tokenSymbol = "Unknown";
      if (ethers.isAddress(tokenAddress)) {
        try {
          const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, provider);
          tokenSymbol = await tokenContract.symbol();
        } catch (error) {
          console.error(`Error receiving token symbol: ${error}`);
        }
      }

      // Configuring message
      const message = `🔔 *New IDO!*
      *IDO address:* https://bscscan.com/address/${idoAddress}

      *Token*
      - Address: https://bscscan.com/address/${tokenAddress}
      - Symbol: ${tokenSymbol}

      📅 *IDO timestamps:*
      - Start: ${new Date(Number(timestamps[0]) * 1000).toLocaleString()} 
      - End: ${new Date(Number(timestamps[1]) * 1000).toLocaleString()} 
      `;

      await bot.telegram.sendMessage(TELEGRAM_CHAT_ID, message, { parse_mode: "Markdown" });
    }
  } catch (error) {
    console.error("Event processing error:", error);
  }
});

console.log("The bot is running and listening for events...");

process.on("SIGINT", () => {
  provider.destroy();
  console.log("WebSocket closed");
  process.exit();
});
